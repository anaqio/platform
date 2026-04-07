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

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
