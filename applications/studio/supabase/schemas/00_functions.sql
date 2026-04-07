-- ============================================================
-- Shared functions (lexicographic order: runs first)
-- ============================================================

-- Auto-set updated_at on row update (reusable for all tables)
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql
set search_path = '';

-- Auto-create profile on auth.users signup
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
$$ language plpgsql security definer
set search_path = '';
