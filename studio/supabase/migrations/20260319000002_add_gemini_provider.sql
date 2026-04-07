-- Add 'gemini' to inference_provider check constraint
alter table public.generations
  drop constraint if exists generations_inference_provider_check;

alter table public.generations
  add constraint generations_inference_provider_check
  check (inference_provider in ('hf_spaces', 'fal_ai', 'gemini'));
