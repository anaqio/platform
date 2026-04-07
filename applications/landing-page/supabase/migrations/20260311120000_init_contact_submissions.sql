-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: init_contact_submissions
-- Created:   2026-03-11
-- Purpose:   Bootstrap the contact_submissions table with essential fields,
--            UTM attribution, geo data, and status lifecycle management.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── contact_submissions ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Contact essentials
  full_name      text        NOT NULL CHECK (char_length(full_name) >= 2 AND char_length(full_name) <= 100),
  email          text        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company        text        CHECK (char_length(company) <= 100),
  inquiry_type   text        NOT NULL
                 CHECK (inquiry_type IN ('partnership', 'support', 'press', 'careers', 'general', 'other')),
  subject        text        NOT NULL CHECK (char_length(subject) >= 3 AND char_length(subject) <= 200),
  message        text        NOT NULL CHECK (char_length(message) >= 10 AND char_length(message) <= 5000),

  -- UTM attribution (optional, auto-populated from URL params)
  utm_source     text,                                   -- e.g. 'instagram'
  utm_medium     text,                                   -- e.g. 'social'
  utm_campaign   text,                                   -- e.g. 'launch-teaser'
  utm_content    text,                                   -- e.g. 'contact-cta'
  utm_term       text,                                   -- paid search keyword

  -- Request meta
  referrer       text,                                   -- HTTP Referer header
  country        text,                                   -- from Cloudflare/Vercel edge headers
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

-- Reuse existing handle_updated_at function from init_waitlist migration
CREATE TRIGGER contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Service role has full access (used by server actions)
CREATE POLICY "service_role_all"
  ON public.contact_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Public visitors may insert (submit a contact form)
CREATE POLICY "anon_insert"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
