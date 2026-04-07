-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: landing_tables
-- Purpose:   Marketing / waitlist schema — all tables in `landing` schema.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── waitlist ─────────────────────────────────────────────────────────────────

create table landing.waitlist (
  id             uuid        default gen_random_uuid() primary key,

  -- Contact
  email          text        unique not null,
  full_name      text,
  role           text        not null default 'interested',
  company        text,
  revenue_range  text,

  -- Preferences (aesthetic, etc.)
  preferences    jsonb       not null default '{}',

  -- Acquisition attribution
  source         text        not null default 'unknown',
  referrer       text,
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  utm_content    text,
  utm_term       text,

  -- Geo (from Cloudflare/Vercel edge headers at insert time)
  country        text,
  city           text,

  -- Lead lifecycle
  status         text        not null default 'pending'
                 check (status in ('pending', 'invited', 'active', 'unsubscribed')),
  lead_score     integer     not null default 0 check (lead_score >= 0),
  invited_at     timestamptz,
  notes          text,

  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index waitlist_status_idx       on landing.waitlist(status);
create index waitlist_source_idx       on landing.waitlist(source);
create index waitlist_utm_campaign_idx on landing.waitlist(utm_campaign) where utm_campaign is not null;
create index waitlist_created_at_idx   on landing.waitlist(created_at desc);
create index waitlist_lead_score_idx   on landing.waitlist(lead_score desc);

create trigger waitlist_updated_at
  before update on landing.waitlist
  for each row execute function public.set_updated_at();

alter table landing.waitlist enable row level security;

create policy "service_role_all" on landing.waitlist for all to service_role using (true) with check (true);
create policy "anon_insert"      on landing.waitlist for insert to anon, authenticated with check (true);
create policy "user_read_own"    on landing.waitlist for select to authenticated
  using (email = (auth.jwt() ->> 'email'));

grant insert on landing.waitlist to anon, authenticated;
grant select on landing.waitlist to authenticated;
grant all    on landing.waitlist to service_role;

-- ─── campaigns ────────────────────────────────────────────────────────────────

create table landing.campaigns (
  id              uuid        default gen_random_uuid() primary key,
  name            text        not null,
  slug            text        unique not null,
  description     text,
  type            text        not null default 'organic'
                  check (type in ('email','social','influencer','paid','organic','referral','seo','smo')),
  platform        text
                  check (platform in ('instagram','tiktok','facebook','google','linkedin','x','whatsapp','email','other')),
  start_date      date,
  end_date        date,
  budget_mad      numeric(12, 2) check (budget_mad >= 0),
  target_audience jsonb       not null default '{}',
  meta            jsonb       not null default '{}',
  is_active       boolean     not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index campaigns_slug_idx           on landing.campaigns(slug);
create index campaigns_type_platform_idx  on landing.campaigns(type, platform);
create index campaigns_active_idx         on landing.campaigns(is_active) where is_active = true;

create trigger campaigns_updated_at
  before update on landing.campaigns
  for each row execute function public.set_updated_at();

alter table landing.campaigns enable row level security;

create policy "service_role_all" on landing.campaigns for all to service_role using (true) with check (true);

grant all on landing.campaigns to service_role;

-- ─── waitlist_campaign_attribution ────────────────────────────────────────────

create table landing.waitlist_campaign_attribution (
  waitlist_id   uuid not null references landing.waitlist(id)   on delete cascade,
  campaign_id   uuid not null references landing.campaigns(id)  on delete cascade,
  attributed_at timestamptz not null default now(),
  primary key (waitlist_id, campaign_id)
);

create index wca_campaign_id_idx on landing.waitlist_campaign_attribution(campaign_id);

alter table landing.waitlist_campaign_attribution enable row level security;

create policy "service_role_all" on landing.waitlist_campaign_attribution
  for all to service_role using (true) with check (true);

grant all on landing.waitlist_campaign_attribution to service_role;

-- ─── contact_submissions ──────────────────────────────────────────────────────

create table landing.contact_submissions (
  id          uuid        default gen_random_uuid() primary key,
  full_name   text        not null,
  email       text        not null,
  company     text,
  message     text        not null,
  source      text        default 'contact-form',
  status      text        default 'unread'
              check (status in ('unread', 'read', 'replied', 'archived')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index contact_submissions_status_idx on landing.contact_submissions(status);

create trigger contact_submissions_updated_at
  before update on landing.contact_submissions
  for each row execute function public.set_updated_at();

alter table landing.contact_submissions enable row level security;

create policy "service_role_all" on landing.contact_submissions
  for all to service_role using (true) with check (true);
create policy "anon_insert" on landing.contact_submissions
  for insert to anon, authenticated with check (true);

grant insert on landing.contact_submissions to anon, authenticated;
grant all    on landing.contact_submissions to service_role;

-- ─── atelier_invitations ──────────────────────────────────────────────────────

create table landing.atelier_invitations (
  id          uuid        default gen_random_uuid() primary key,
  email       text        not null,
  code        text        unique not null,
  used        boolean     not null default false,
  used_at     timestamptz,
  expires_at  timestamptz,
  created_at  timestamptz not null default now()
);

create index atelier_invitations_code_idx  on landing.atelier_invitations(code);
create index atelier_invitations_email_idx on landing.atelier_invitations(email);

alter table landing.atelier_invitations enable row level security;

create policy "service_role_all" on landing.atelier_invitations
  for all to service_role using (true) with check (true);
create policy "anon_read_by_code" on landing.atelier_invitations
  for select to anon, authenticated using (true);

grant select on landing.atelier_invitations to anon, authenticated;
grant all    on landing.atelier_invitations to service_role;
