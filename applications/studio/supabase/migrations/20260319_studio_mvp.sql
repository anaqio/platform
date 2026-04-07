-- ============================================================
-- profiles — extends auth.users, auto-created on signup
-- ============================================================
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  email       text,
  full_name   text,
  avatar_url  text,
  plan        text default 'free'
              check (plan in ('free', 'starter', 'pro', 'business'))
);

alter table public.profiles enable row level security;

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger (reuse for all tables)
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- preset_models — static AI model catalog (managed by CTO)
-- ============================================================
create table public.preset_models (
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

alter table public.preset_models enable row level security;

create policy "Public read active preset models"
  on public.preset_models for select
  using (active = true);

-- seed initial presets
insert into public.preset_models (id, label, label_ar, preview_path, gender, style_tags, sort_order)
values
  ('f-01-moderne',  'Femme — Style Moderne',    'أنثى — عصري',    'presets/f-01-moderne.webp',  'female', '{modern,casual}',  1),
  ('f-02-kaftan',   'Femme — Kaftan Élégant',   'أنثى — قفطان',   'presets/f-02-kaftan.webp',   'female', '{kaftan,elegant}', 2),
  ('f-03-casual',   'Femme — Casual Chic',      'أنثى — كاجوال',  'presets/f-03-casual.webp',   'female', '{casual,chic}',    3),
  ('m-01-moderne',  'Homme — Style Moderne',    'ذكر — عصري',     'presets/m-01-moderne.webp',  'male',   '{modern,smart}',   4),
  ('m-02-jellaba',  'Homme — Jellaba Classique','ذكر — جلابة',    'presets/m-02-jellaba.webp',  'male',   '{jellaba,classic}',5);

-- ============================================================
-- generations — core usage log (NEVER hard delete rows)
-- ============================================================
create table public.generations (
  id                  uuid default gen_random_uuid() primary key,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  user_id             uuid references auth.users(id) on delete set null,
  session_id          text,
  status              text default 'pending'
                      check (status in ('pending','processing','completed','failed')),
  garment_path        text not null,
  preset_model_id     text references public.preset_models(id) not null,
  output_path         text,
  inference_provider  text default 'hf_spaces'
                      check (inference_provider in ('hf_spaces','fal_ai')),
  inference_ms        integer,
  error_message       text,
  metadata            jsonb default '{}'::jsonb
);

alter table public.generations enable row level security;

create policy "Users read own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Anon read own session generations"
  on public.generations for select
  using (session_id = current_setting('request.headers', true)::json->>'x-session-id');

create index generations_user_id_idx    on public.generations(user_id);
create index generations_session_id_idx on public.generations(session_id);
create index generations_status_idx     on public.generations(status);
create index generations_created_at_idx on public.generations(created_at desc);

create trigger generations_updated_at
  before update on public.generations
  for each row execute function public.set_updated_at();

-- Enable Realtime on generations (client subscribes for live status)
alter publication supabase_realtime add table public.generations;
