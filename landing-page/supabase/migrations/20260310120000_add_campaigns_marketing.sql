-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add_campaigns_marketing
-- Created:   2026-03-10
-- Purpose:   Campaign-based marketing schema for SEO/SMO attribution.
--            Adds a campaigns catalogue, a waitlist attribution join table,
--            and a view for per-campaign signup analytics.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── campaigns ────────────────────────────────────────────────────────────────
--
-- One row per marketing campaign (social post series, email drip, paid ad set…).
-- Campaigns are identified by a URL-safe slug used in UTM parameters:
--   ?utm_campaign=<slug>
--
-- Chain-of-thought rationale:
--   • Moroccan luxury market → budget tracked in MAD
--   • Platform enum covers current channels; 'other' acts as escape hatch
--   • target_audience JSONB stores profile criteria (age range, city, interest…)
--     without requiring a schema migration every time criteria expand
--   • meta JSONB stores platform-specific IDs (fb_ad_set_id, ig_post_id…)

CREATE TABLE IF NOT EXISTS public.campaigns (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,

  name            text        NOT NULL,
  slug            text        UNIQUE NOT NULL,           -- matches utm_campaign value
  description     text,

  -- Channel taxonomy
  type            text        NOT NULL DEFAULT 'organic'
                  CHECK (type IN (
                    'email', 'social', 'influencer',
                    'paid', 'organic', 'referral', 'seo', 'smo'
                  )),
  platform        text
                  CHECK (platform IN (
                    'instagram', 'tiktok', 'facebook', 'google',
                    'linkedin', 'x', 'whatsapp', 'email', 'other'
                  )),

  -- Schedule
  start_date      date,
  end_date        date,

  -- Budget (MAD — Moroccan market primary currency)
  budget_mad      numeric(12, 2) CHECK (budget_mad >= 0),

  -- Audience profile & platform metadata (schemaless for flexibility)
  target_audience jsonb       NOT NULL DEFAULT '{}',
  meta            jsonb       NOT NULL DEFAULT '{}',

  is_active       boolean     NOT NULL DEFAULT true,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ─── waitlist_campaign_attribution ────────────────────────────────────────────
--
-- Many-to-many: a signup can be attributed to multiple campaigns
-- (e.g., first touch + last touch), and a campaign can attract many signups.

CREATE TABLE IF NOT EXISTS public.waitlist_campaign_attribution (
  waitlist_id     uuid        NOT NULL REFERENCES public.waitlist (id) ON DELETE CASCADE,
  campaign_id     uuid        NOT NULL REFERENCES public.campaigns (id) ON DELETE CASCADE,
  attributed_at   timestamptz NOT NULL DEFAULT now(),

  PRIMARY KEY (waitlist_id, campaign_id)
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS campaigns_slug_idx
  ON public.campaigns (slug);

CREATE INDEX IF NOT EXISTS campaigns_type_platform_idx
  ON public.campaigns (type, platform);

CREATE INDEX IF NOT EXISTS campaigns_active_idx
  ON public.campaigns (is_active)
  WHERE is_active = true;

CREATE INDEX IF NOT EXISTS wca_campaign_id_idx
  ON public.waitlist_campaign_attribution (campaign_id);

-- ─── Analytics view ───────────────────────────────────────────────────────────
--
-- Aggregates signup counts per campaign for dashboard queries.
-- Join with waitlist to filter by status, geo, or lead_score as needed.

CREATE OR REPLACE VIEW public.campaign_signup_stats AS
SELECT
  c.id,
  c.name,
  c.slug,
  c.type,
  c.platform,
  c.is_active,
  c.budget_mad,
  c.start_date,
  c.end_date,
  COUNT(wca.waitlist_id)        AS signups_total,
  COUNT(w.id) FILTER (
    WHERE w.status = 'invited'
  )                             AS signups_invited,
  COUNT(w.id) FILTER (
    WHERE w.status = 'active'
  )                             AS signups_active,
  AVG(w.lead_score)             AS avg_lead_score,
  MIN(wca.attributed_at)        AS first_signup_at,
  MAX(wca.attributed_at)        AS last_signup_at
FROM public.campaigns c
LEFT JOIN public.waitlist_campaign_attribution wca ON wca.campaign_id = c.id
LEFT JOIN public.waitlist w ON w.id = wca.waitlist_id
GROUP BY c.id;

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist_campaign_attribution ENABLE ROW LEVEL SECURITY;

-- Admin / server actions (service_role) have full access
CREATE POLICY "service_role_all"
  ON public.campaigns
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "service_role_all"
  ON public.waitlist_campaign_attribution
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);
