-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: init_schemas
-- Purpose:   Create app-specific PostgreSQL schemas.
--            All apps share one Supabase project; schemas provide isolation.
--
-- Schema layout:
--   auth    → Supabase-managed (users, sessions, etc.) — do not touch
--   studio  → AI Virtual Studio tables (profiles, preset_models, generations)
--   landing → Marketing / waitlist tables (waitlist, campaigns, etc.)
--   public  → Cross-schema views consumed by backoffice + shared functions
-- ─────────────────────────────────────────────────────────────────────────────

create schema if not exists studio;
create schema if not exists landing;

-- Grant usage to authenticated and anon roles so PostgREST can expose them.
grant usage on schema studio to anon, authenticated, service_role;
grant usage on schema landing to anon, authenticated, service_role;
