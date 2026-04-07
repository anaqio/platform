-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: campaigns
-- Source:  Production DB snapshot — 2026-04-07
-- Purpose: Pre-load the campaigns catalogue for fresh dev / staging environments.
--          These are the launch-phase marketing channels seeded by the founders.
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.campaigns (
  id, name, slug, description, type, platform,
  start_date, end_date, budget_mad,
  target_audience, meta, is_active, created_at
) VALUES
  (
    'ffd15f0f-085c-4ae7-bbfd-dd9cf3fb849a',
    'Prelaunch Waitlist — LinkedIn Founder Posts',
    'prelaunch-linkedin-founder',
    'Organic founder storytelling posts driving waitlist signups',
    'social', 'linkedin',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '6e6e40f0-da21-4271-baaf-89f066f79d4e',
    'Prelaunch Waitlist — LinkedIn Outreach',
    'prelaunch-linkedin-dm',
    'Direct outreach to fashion founders and ecommerce managers',
    'organic', 'linkedin',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '6a85ee32-40f6-4e30-be29-f2e9931a4f79',
    'Prelaunch Waitlist — Instagram Teasers',
    'prelaunch-instagram',
    'Teaser visuals and AI studio previews for fashion brands',
    'smo', 'instagram',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    'd7ed4c92-4700-40c4-884d-d8745ec08064',
    'Fashion Community Seeding',
    'community-seeding',
    'Posts in fashion startup communities and ecommerce groups',
    'organic', 'other',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '1de83e53-1402-4bcf-a818-e1a1e9ff731e',
    'GITEX Africa Event',
    'gitex-africa-2026',
    'Networking and QR waitlist acquisition at GITEX Africa',
    'organic', 'other',
    '2026-04-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '51d6df0e-9375-46a0-8bd7-8a1882e2b1ff',
    'Founder Email Outreach',
    'founder-email',
    'Manual outreach emails to target brands',
    'email', 'email',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '79d871fc-a180-4037-8231-7b5de409679c',
    'Waitlist Referral Program',
    'waitlist-referral',
    'Users invite other brands to skip the queue',
    'referral', 'other',
    '2026-03-01', NULL, NULL,
    '{}', '{}', true,
    '2026-03-11 21:40:22.708897+00'
  ),
  (
    '22265cec-184b-4fa4-952e-e3e910385b49',
    'Dev Test – WhatsApp Cofounders',
    'devtest-whatsapp-cofounders',
    'Internal campaign used to test waitlist attribution via WhatsApp links shared with cofounders.',
    'organic', 'whatsapp',
    '2026-03-11', NULL, NULL,
    '{"team": ["amal", "mohamed", "chaimae"], "segment": "internal_testing"}',
    '{"purpose": "tracking_validation", "environment": "dev"}',
    true,
    '2026-03-11 21:41:53.825235+00'
  )
ON CONFLICT (slug) DO NOTHING;
