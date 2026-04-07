-- ─────────────────────────────────────────────────────────────────────────────
-- Seed: preset_models
-- Source:  Production DB snapshot — 2026-04-07
-- Purpose: Pre-load the AI studio model catalogue for dev / staging environments.
--          These are the 5 launch-phase virtual try-on models (Moroccan market
--          localised: French labels + Arabic labels).
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.preset_models (
  id, label, label_ar, preview_path, gender, style_tags, active, sort_order
) VALUES
  (
    'f-01-moderne',
    'Femme — Style Moderne',
    'أنثى — عصري',
    'f-01-moderne.webp',
    'female',
    ARRAY['modern', 'casual'],
    true, 1
  ),
  (
    'f-02-kaftan',
    'Femme — Kaftan Élégant',
    'أنثى — قفطان',
    'f-02-kaftan.webp',
    'female',
    ARRAY['kaftan', 'elegant'],
    true, 2
  ),
  (
    'f-03-casual',
    'Femme — Casual Chic',
    'أنثى — كاجوال',
    'f-03-casual.webp',
    'female',
    ARRAY['casual', 'chic'],
    true, 3
  ),
  (
    'm-01-moderne',
    'Homme — Style Moderne',
    'ذكر — عصري',
    'm-01-moderne.webp',
    'male',
    ARRAY['modern', 'smart'],
    true, 4
  ),
  (
    'm-02-jellaba',
    'Homme — Jellaba Classique',
    'ذكر — جلابة',
    'm-02-jellaba.webp',
    'male',
    ARRAY['jellaba', 'classic'],
    true, 5
  )
ON CONFLICT (id) DO NOTHING;
