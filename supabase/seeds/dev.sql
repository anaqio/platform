-- Dev seed — safe to run repeatedly (uses ON CONFLICT DO NOTHING).
-- Run automatically by `supabase db reset` or `supabase start`.

-- Preset models (studio)
insert into studio.preset_models (id, label, label_ar, preview_path, gender, style_tags, sort_order)
values
  ('model_f_01', 'Amina',   'أمينة',  'presets/amina.jpg',   'female', '{"classic","modest"}',   1),
  ('model_f_02', 'Leila',   'ليلى',   'presets/leila.jpg',   'female', '{"modern","casual"}',    2),
  ('model_m_01', 'Youssef', 'يوسف',   'presets/youssef.jpg', 'male',   '{"classic","formal"}',   3)
on conflict (id) do nothing;

-- Demo campaign (landing)
insert into landing.campaigns (name, slug, type, platform, is_active)
values
  ('Launch Teaser', 'launch-teaser', 'social', 'instagram', true),
  ('Brand Awareness Q1', 'brand-q1', 'paid', 'facebook', false)
on conflict (slug) do nothing;
