-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: backoffice_events
-- Purpose:   Marketing events table for the backoffice (in public schema,
--            consistent with current DB state where all tables are in public).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.events (
  id               uuid        default gen_random_uuid() primary key,
  name             text        not null,
  slug             text        unique not null,
  description      text,
  type             text        not null default 'other'
                   check (type in ('fashion_show', 'expo', 'launch', 'workshop', 'webinar', 'pop_up', 'other')),
  venue            text,
  city             text,
  country          text        not null default 'MA',
  start_at         timestamptz,
  end_at           timestamptz,
  capacity         integer     check (capacity > 0),
  registration_url text,
  campaign_id      uuid        references public.campaigns(id) on delete set null,
  is_active        boolean     not null default true,
  meta             jsonb       not null default '{}',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index events_type_idx       on public.events(type);
create index events_city_idx       on public.events(city) where city is not null;
create index events_start_at_idx   on public.events(start_at desc);
create index events_campaign_id_idx on public.events(campaign_id) where campaign_id is not null;
create index events_active_idx     on public.events(is_active) where is_active = true;

create trigger events_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

create policy "service_role_all" on public.events for all to service_role using (true) with check (true);

grant all on public.events to service_role;
