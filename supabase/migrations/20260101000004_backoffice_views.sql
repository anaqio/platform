-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: backoffice_views
-- Purpose:   Cross-schema views in `public` that join studio + landing data.
--            Backoffice queries these via the service_role client.
--            Views stay in `public` so the admin client needs no schema switch.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── campaign_signup_stats ────────────────────────────────────────────────────
-- Per-campaign signup analytics (pure landing schema, replaces old public view).

create or replace view public.campaign_signup_stats as
select
  c.id,
  c.name,
  c.slug,
  c.type,
  c.platform,
  c.is_active,
  c.budget_mad,
  c.start_date,
  c.end_date,
  count(wca.waitlist_id)                             as signups_total,
  count(w.id) filter (where w.status = 'invited')    as signups_invited,
  count(w.id) filter (where w.status = 'active')     as signups_active,
  avg(w.lead_score)                                  as avg_lead_score,
  min(wca.attributed_at)                             as first_signup_at,
  max(wca.attributed_at)                             as last_signup_at
from landing.campaigns c
left join landing.waitlist_campaign_attribution wca on wca.campaign_id = c.id
left join landing.waitlist w on w.id = wca.waitlist_id
group by c.id;

grant select on public.campaign_signup_stats to service_role;

-- ─── user_overview ────────────────────────────────────────────────────────────
-- Unified user view joining studio profiles with landing waitlist entries.
-- Backoffice uses this to see who's on the waitlist AND who's a studio user.

create or replace view public.user_overview as
select
  coalesce(p.id::text, w.email)           as id,
  coalesce(p.email, w.email)              as email,
  coalesce(p.full_name, w.full_name)      as full_name,

  -- Studio state
  p.id                                    as studio_user_id,
  p.plan                                  as studio_plan,
  p.created_at                            as studio_joined_at,

  -- Waitlist state
  w.id                                    as waitlist_id,
  w.status                                as waitlist_status,
  w.role                                  as waitlist_role,
  w.company,
  w.lead_score,
  w.utm_source,
  w.utm_campaign,
  w.created_at                            as waitlist_joined_at

from studio.profiles p
full outer join landing.waitlist w on lower(w.email) = lower(p.email);

grant select on public.user_overview to service_role;

-- ─── generation_stats ─────────────────────────────────────────────────────────
-- Aggregated generation metrics per user for backoffice dashboard.

create or replace view public.generation_stats as
select
  g.user_id,
  p.email,
  p.plan,
  count(*)                                           as total_generations,
  count(*) filter (where g.status = 'completed')     as completed,
  count(*) filter (where g.status = 'failed')        as failed,
  avg(g.inference_ms) filter (where g.status = 'completed') as avg_inference_ms,
  max(g.created_at)                                  as last_generation_at
from studio.generations g
join studio.profiles p on p.id = g.user_id
group by g.user_id, p.email, p.plan;

grant select on public.generation_stats to service_role;
