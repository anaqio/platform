-- ─────────────────────────────────────────────────────────────────────────────
-- Migration: studio_tables
-- Purpose:   AI Virtual Studio schema — profiles, preset_models, generations.
--            All tables live in the `studio` schema.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── preset_models ───────────────────────────────────────────────────────────
-- Static catalog of AI model presets. Read by anon (public catalog).

create table studio.preset_models (
  id            text primary key,
  created_at    timestamptz default now() not null,
  label         text not null,
  label_ar      text,
  preview_path  text not null,
  gender        text check (gender in ('female', 'male', 'neutral')),
  style_tags    text[] default '{}',
  active        boolean default true,
  sort_order    integer default 0
);

alter table studio.preset_models enable row level security;

-- Anyone can read the preset catalog
create policy "preset_models_public_read"
  on studio.preset_models for select
  to anon, authenticated
  using (active = true);

grant select on studio.preset_models to anon, authenticated;

-- ─── profiles ────────────────────────────────────────────────────────────────
-- One row per auth.users entry. Auto-created by handle_new_user() trigger.

create table studio.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  email       text,
  full_name   text,
  avatar_url  text,
  plan        text default 'free'
              check (plan in ('free', 'starter', 'pro', 'business'))
);

alter table studio.profiles enable row level security;

create trigger profiles_updated_at
  before update on studio.profiles
  for each row execute function public.set_updated_at();

-- Users manage their own profile
create policy "profiles_user_select" on studio.profiles for select
  to authenticated using (auth.uid() = id);

create policy "profiles_user_update" on studio.profiles for update
  to authenticated using (auth.uid() = id);

grant select, update on studio.profiles to authenticated;
grant all on studio.profiles to service_role;

-- ─── generations ─────────────────────────────────────────────────────────────
-- Core usage log. NEVER hard delete rows — status can be 'failed'.

create table studio.generations (
  id                  uuid default gen_random_uuid() primary key,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  user_id             uuid references auth.users(id) on delete set null,
  session_id          text,
  status              text default 'pending'
                      check (status in ('pending','processing','completed','failed')),
  garment_path        text not null,
  preset_model_id     text references studio.preset_models(id) not null,
  output_path         text,
  inference_provider  text default 'hf_spaces'
                      check (inference_provider in ('hf_spaces','fal_ai','gemini')),
  inference_ms        integer,
  error_message       text,
  metadata            jsonb default '{}'::jsonb
);

alter table studio.generations enable row level security;

create index generations_user_id_idx    on studio.generations(user_id);
create index generations_session_id_idx on studio.generations(session_id);
create index generations_status_idx     on studio.generations(status);
create index generations_created_at_idx on studio.generations(created_at desc);

create trigger generations_updated_at
  before update on studio.generations
  for each row execute function public.set_updated_at();

-- Users see their own generations; server-side inserts via service_role
create policy "generations_user_select" on studio.generations for select
  to authenticated using (auth.uid() = user_id);

-- Service role has full access (API routes use admin client)
grant all on studio.generations to service_role;
grant select on studio.generations to authenticated;

-- Enable Realtime for live status updates
alter publication supabase_realtime add table studio.generations;
