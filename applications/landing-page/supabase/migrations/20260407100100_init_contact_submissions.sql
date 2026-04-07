-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: init_contact_submissions
-- Created:   2026-04-07 (backfilled — originally designed 2026-03-11)
-- Purpose:   Create the contact_submissions table for the landing page contact
--            form. Tracks full-name, email, inquiry type, message, UTM
--            attribution, geo data, and a status lifecycle.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact essentials
  full_name      text        NOT NULL
                 CHECK (char_length(full_name) BETWEEN 2 AND 100),
  email          text        NOT NULL
                 CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company        text
                 CHECK (char_length(company) <= 100),
  inquiry_type   text        NOT NULL
                 CHECK (inquiry_type IN (
                   'partnership', 'support', 'press',
                   'careers', 'general', 'other'
                 )),
  subject        text        NOT NULL
                 CHECK (char_length(subject) BETWEEN 3 AND 200),
  message        text        NOT NULL
                 CHECK (char_length(message) BETWEEN 10 AND 5000),

  -- UTM attribution (optional — auto-populated from URL params)
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_content    text,
  utm_term       text,
  referrer       text,

  -- Geo (resolved from Cloudflare / Vercel edge headers)
  country        text,
  city           text,

  -- Status lifecycle
  status         text        NOT NULL DEFAULT 'new'
                 CHECK (status IN ('new', 'read', 'replied', 'closed')),

  -- Timestamps
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS contact_status_idx
  ON public.contact_submissions (status);

CREATE INDEX IF NOT EXISTS contact_inquiry_type_idx
  ON public.contact_submissions (inquiry_type);

CREATE INDEX IF NOT EXISTS contact_created_at_idx
  ON public.contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS contact_utm_campaign_idx
  ON public.contact_submissions (utm_campaign)
  WHERE utm_campaign IS NOT NULL;

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Server actions (service_role) have full access
CREATE POLICY "service_role_all"
  ON public.contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public visitors may submit the contact form
CREATE POLICY "anon_insert"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
