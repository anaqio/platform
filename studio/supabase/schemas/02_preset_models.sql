-- ============================================================
-- preset_models — static AI model catalog
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
