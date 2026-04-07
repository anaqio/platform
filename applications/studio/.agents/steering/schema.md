# steering: schema

# live DB reference — psycholium Supabase account

# use Supabase MCP to verify current state: mcp**supabase**list_tables

## TABLES

### profiles

```
id           uuid PK → auth.users.id (cascade delete)
created_at   timestamptz NOT NULL default now()
updated_at   timestamptz NOT NULL default now() [trigger]
email        text
full_name    text
avatar_url   text
plan         text default 'free' CHECK IN ('free','starter','pro','business')
```

RLS: users read/update own row only.
Trigger: `on_auth_user_created` → auto-insert on signup.

### preset_models

```
id           text PK (slug: 'f-01-moderne')
created_at   timestamptz NOT NULL default now()
label        text NOT NULL              (French: "Femme — Style Moderne")
label_ar     text                       (Arabic: "أنثى — عصري")
preview_path text NOT NULL              (Storage path: presets/f-01-moderne.webp)
gender       text CHECK IN ('female','male','neutral')
style_tags   text[] default '{}'        (['kaftan','modern','casual'])
active       boolean default true
sort_order   integer default 0
```

RLS: public read for active=true rows.
Seeded: 5 presets (3 female, 2 male).

### generations

```
id                  uuid PK default gen_random_uuid()
created_at          timestamptz NOT NULL default now()
updated_at          timestamptz NOT NULL default now() [trigger]
user_id             uuid → auth.users.id (set null on delete)
session_id          text                     (anon/kiosk sessions)
status              text default 'pending'
                    CHECK IN ('pending','processing','completed','failed')
garment_path        text NOT NULL            (Storage: garments/{uid}/{uuid}.webp)
preset_model_id     text NOT NULL → preset_models.id
output_path         text                     (Storage: outputs/{uid}/{uuid}.webp  )
inference_provider  text default 'hf_spaces'
                    CHECK IN ('hf_spaces','fal_ai')
inference_ms        integer                  (latency tracking)
error_message       text                     (set on failed)
metadata            jsonb default '{}'       (seed, style params, future use)
```

RLS:

- Users: SELECT own rows (user_id = auth.uid())
- Anon: SELECT own session rows
- INSERT: NO policy — service role only from /api/generate

Indexes: user_id, session_id, status, created_at DESC
Realtime: added to supabase_realtime publication

## STORAGE BUCKETS

```
garments  private  max 10MB  allowed: image/jpeg, image/png, image/webp
outputs   private  max 20MB  allowed: image/jpeg, image/png, image/webp
presets   public   max 5MB   allowed: image/webp
```

Storage paths:

```
garments/{user_id or session_id}/{uuid}.{ext}
outputs/{user_id or session_id}/{generationId}.webp
presets/f-01-moderne.webp
presets/f-02-kaftan.webp
presets/f-03-casual.webp
presets/m-01-moderne.webp
presets/m-02-jellaba.webp
```

## ALREADY APPLIED MIGRATIONS (psycholium account)

```
init_waitlist              → waitlist table + brevo webhook
add_campaigns_marketing    → campaigns table for waitlist tracking
20260319_studio_mvp.sql    → profiles, preset_models, generations, storage, realtime
```

## QUERY CHEAT SHEET

```typescript
// Get user's recent generations
supabase
  .from('generations')
  .select('id, status, output_path, preset_model_id, created_at, inference_ms')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)

// Get active presets ordered
supabase
  .from('preset_models')
  .select('id, label, label_ar, preview_path, gender, style_tags')
  .eq('active', true)
  .order('sort_order')

// Get single generation for status check
supabase
  .from('generations')
  .select('id, status, output_path, error_message, inference_ms')
  .eq('id', generationId)
  .single()

// Admin: insert generation (service role)
admin
  .from('generations')
  .insert({
    user_id,
    session_id,
    status: 'pending',
    garment_path,
    preset_model_id,
    inference_provider,
  })
  .select('id')
  .single()

// Admin: update status
admin
  .from('generations')
  .update({ status, output_path, inference_ms, error_message })
  .eq('id', generationId)
```
