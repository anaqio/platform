-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: backoffice_schema_fixes
-- Purpose:   1. Grant service_role access to public cross-schema views
--            2. Note: atelier_invitations anon_read_by_code uses `true` USING
--               clause — intentional for now; scope via RPC in future if needed
-- ─────────────────────────────────────────────────────────────────────────────

-- Allow admin client (service_role) to read the cross-schema views
GRANT SELECT ON public.campaign_signup_stats TO service_role;
GRANT SELECT ON public.user_overview         TO service_role;
GRANT SELECT ON public.generation_stats      TO service_role;

-- events.campaign_id references landing.campaigns (correct FK across schemas)
-- Already established in 20260408000001_backoffice_events.sql applied to
-- the production project afspusrgrqpgxqhqfepy.
