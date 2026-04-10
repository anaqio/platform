-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: add_realtime_publications
-- Purpose:   Enable realtime on key tables for dashboard/CRM/campaigns/events
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable realtime on landing tables
alter publication supabase_realtime add table landing.waitlist;
alter publication supabase_realtime add table landing.campaigns;

-- Enable realtime on public.events
alter publication supabase_realtime add table public.events;
