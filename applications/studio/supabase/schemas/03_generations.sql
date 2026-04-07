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
                      check (inference_provider in ('hf_spaces','fal_ai','gemini')),
  inference_ms        integer,
  error_message       text,
  metadata            jsonb default '{}'::jsonb
);

alter table public.generations enable row level security;

create index generations_user_id_idx    on public.generations(user_id);
create index generations_session_id_idx on public.generations(session_id);
create index generations_status_idx     on public.generations(status);
create index generations_created_at_idx on public.generations(created_at desc);

create trigger generations_updated_at
  before update on public.generations
  for each row execute function public.set_updated_at();
