-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: init_waitlist
-- Created:   2026-03-01
-- Purpose:   Bootstrap the waitlist table with full contact, attribution,
--            UTM tracking, geo, and lead-management columns.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── updated_at helper ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ─── waitlist ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.waitlist (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact
  email          text        UNIQUE NOT NULL,
  full_name      text,                                   -- nullable: quick signups omit this
  role           text        NOT NULL DEFAULT 'interested',
  company        text,
  revenue_range  text,

  -- Preferences stored as arbitrary JSON (aesthetic, etc.)
  preferences    jsonb       NOT NULL DEFAULT '{}',

  -- Acquisition attribution
  source         text        NOT NULL DEFAULT 'unknown', -- 'home' | 'coming-soon' | …
  referrer       text,                                   -- HTTP Referer header
  utm_source     text,                                   -- e.g. 'instagram'
  utm_medium     text,                                   -- e.g. 'social'
  utm_campaign   text,                                   -- e.g. 'launch-teaser'
  utm_content    text,                                   -- e.g. 'hero-cta'
  utm_term       text,                                   -- paid search keyword

  -- Geo (resolved from Cloudflare/Vercel edge headers at insert time)
  country        text,
  city           text,

  -- Lead lifecycle
  status         text        NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'invited', 'active', 'unsubscribed')),
  lead_score     integer     NOT NULL DEFAULT 0 CHECK (lead_score >= 0),
  invited_at     timestamptz,
  notes          text,

  -- Timestamps
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS waitlist_status_idx
  ON public.waitlist (status);

CREATE INDEX IF NOT EXISTS waitlist_source_idx
  ON public.waitlist (source);

CREATE INDEX IF NOT EXISTS waitlist_utm_campaign_idx
  ON public.waitlist (utm_campaign)
  WHERE utm_campaign IS NOT NULL;

CREATE INDEX IF NOT EXISTS waitlist_created_at_idx
  ON public.waitlist (created_at DESC);

CREATE INDEX IF NOT EXISTS waitlist_lead_score_idx
  ON public.waitlist (lead_score DESC);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE TRIGGER waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Server actions run as service_role — full access
CREATE POLICY "service_role_all"
  ON public.waitlist
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public visitors may insert (join the waitlist / notify-me)
CREATE POLICY "anon_insert"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users can read their own row (opt-out flows, profile pages)
CREATE POLICY "user_read_own"
  ON public.waitlist
  FOR SELECT
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
