-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: init_atelier_invitations
-- Created:   2026-04-07 (backfilled — originally designed 2026-03-18)
-- Purpose:   High-intent early-access leads captured via the AtelierForm
--            Typeform-style drawer. Different from the public waitlist:
--            these are qualified brand leads who requested a personal invite.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.atelier_invitations (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact
  email           text        NOT NULL,
  whatsapp        text,

  -- Brand profile
  entity_name     text        NOT NULL,
  role            text        NOT NULL,
  revenue_range   text,

  -- Attribution
  referral_source text,
  source          text        NOT NULL DEFAULT 'early-access',

  -- Status lifecycle (mirrors waitlist for consistency)
  status          text        NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'invited', 'active', 'declined')),
  invited_at      timestamptz,
  notes           text,

  -- Timestamps
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Enforce one invitation per email (duplicate submissions rejected at DB level)
CREATE UNIQUE INDEX IF NOT EXISTS atelier_invitations_email_idx
  ON public.atelier_invitations (email);

CREATE INDEX IF NOT EXISTS atelier_invitations_status_idx
  ON public.atelier_invitations (status);

CREATE INDEX IF NOT EXISTS atelier_invitations_created_at_idx
  ON public.atelier_invitations (created_at DESC);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE TRIGGER atelier_invitations_updated_at
  BEFORE UPDATE ON public.atelier_invitations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.atelier_invitations ENABLE ROW LEVEL SECURITY;

-- Only service_role (server actions) may read and write — no public read access
CREATE POLICY "service_role_all"
  ON public.atelier_invitations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Authenticated users can read and update their own invitation
CREATE POLICY "user_read_own"
  ON public.atelier_invitations
  FOR SELECT
  TO authenticated
  USING (email = ((SELECT auth.jwt()) ->> 'email'));

-- Public visitors may submit the atelier invitation form
CREATE POLICY "anon_insert"
  ON public.atelier_invitations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
