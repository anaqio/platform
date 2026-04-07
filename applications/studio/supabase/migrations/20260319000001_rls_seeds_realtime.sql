-- ============================================================
-- RLS policies (not tracked by declarative diff)
-- ============================================================

-- profiles
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- preset_models
create policy "Public read active preset models"
  on public.preset_models for select
  using (active = true);

-- generations
create policy "Users read own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Anon read own session generations"
  on public.generations for select
  using (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- ============================================================
-- DML: seed preset models (not tracked by declarative diff)
-- ============================================================
insert into public.preset_models (id, label, label_ar, preview_path, gender, style_tags, sort_order)
values
  ('f-01-moderne',  'Femme — Style Moderne',    'أنثى — عصري',    'f-01-moderne.webp',  'female', '{modern,casual}',  1),
  ('f-02-kaftan',   'Femme — Kaftan Élégant',   'أنثى — قفطان',   'f-02-kaftan.webp',   'female', '{kaftan,elegant}', 2),
  ('f-03-casual',   'Femme — Casual Chic',      'أنثى — كاجوال',  'f-03-casual.webp',   'female', '{casual,chic}',    3),
  ('m-01-moderne',  'Homme — Style Moderne',    'ذكر — عصري',     'm-01-moderne.webp',  'male',   '{modern,smart}',   4),
  ('m-02-jellaba',  'Homme — Jellaba Classique','ذكر — جلابة',    'm-02-jellaba.webp',  'male',   '{jellaba,classic}',5)
on conflict (id) do nothing;

-- ============================================================
-- Realtime publication (not tracked by declarative diff)
-- ============================================================
alter publication supabase_realtime add table public.generations;
