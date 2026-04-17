# skill: supabase

# load when: database · RLS · migrations · auth · storage · edge functions

## CLIENT INSTANTIATION (non-negotiable)

```typescript
// Browser (Client Components)
// lib/supabase/client.ts
import { cookies } from 'next/headers'
// Server (RSC, Server Actions, Route Handlers) — ASYNC
// lib/supabase/server.ts
import { createBrowserClient, createServerClient } from '@supabase/ssr'
// Admin / Service Role (Route Handlers only — NEVER client-side)
// lib/supabase/admin.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

import type { Database, Database, Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(list) {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {} // Server Component: ignore, middleware handles
        },
      },
    }
  )
}

export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
```

## QUERY PATTERNS

```typescript
// Always name columns — never select('*')
const { data, error } = await supabase
  .from('generations')
  .select('id, status, output_path, inference_ms')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(20)

// Single row
const { data, error } = await supabase
  .from('profiles')
  .select('id, email, full_name, plan')
  .eq('id', userId)
  .single()

// Insert with return
const { data, error } = await supabase
  .from('generations')
  .insert({ user_id, garment_path, preset_model_id, status: 'pending' })
  .select('id')
  .single()

// Update
await supabase
  .from('generations')
  .update({ status: 'completed', output_path, inference_ms })
  .eq('id', generationId)
```

## ERROR HANDLING

```typescript
const { data, error } = await supabase.from('table').select('col')
if (error) throw new Error(`[supabase.table.select] ${error.message}`)
if (!data) throw new Error('[supabase.table.select] no data returned')
```

## RLS PATTERNS FOR ANAQIO

```sql
-- User-scoped read
create policy "users_read_own"
  on public.generations for select
  using (auth.uid() = user_id);

-- Public read (preset_models catalog)
create policy "public_read_active"
  on public.preset_models for select
  using (active = true);

-- No INSERT policy on generations — service role only
-- No direct client inserts on generations ever

-- Anonymous session read (kiosk mode)
create policy "anon_read_own_session"
  on public.generations for select
  using (session_id = (current_setting('request.headers', true)::json->>'x-session-id'));
```

## STORAGE PATTERNS

```typescript
// lib/utils/storage.ts

// Upload garment (authenticated or kiosk)
export async function uploadGarment(
  file: File,
  userId: string | null,
  sessionId: string
): Promise<string> {
  const supabase = createClient() // browser client
  const ext = file.name.split('.').pop()
  const path = `${userId ?? sessionId}/${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('garments').upload(path, file, {
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new Error(`[storage.upload] ${error.message}`)
  return path
}

// Get signed URL for private buckets (server-side)
export async function getSignedUrl(
  bucket: 'garments' | 'outputs',
  path: string,
  expiresIn = 3600
): Promise<string> {
  const admin = createAdmin() // admin client
  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, expiresIn)
  if (error || !data) throw new Error(`[storage.signedUrl] ${error?.message}`)
  return data.signedUrl
}

// Public URL (presets bucket is public)
export function getPresetPublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/presets/${path}`
}
```

## STORAGE BUCKET CONFIG

```sql
-- Run in Supabase Dashboard > Storage > Create bucket
-- garments: private, max 10MB, allowed: image/jpeg, image/png, image/webp
-- outputs:  private, max 20MB, allowed: image/jpeg, image/png, image/webp
-- presets:  public,  max 5MB,  allowed: image/webp
```

## MIGRATION CONVENTION

Files in `supabase/migrations/`:

```
YYYYMMDD_description.sql
20260319_studio_mvp.sql          ← profiles, preset_models, generations, storage
20260320_add_realtime.sql        ← alter publication supabase_realtime add table
```

Apply: `npx supabase db push` or `npx supabase migration up`

## TYPES GENERATION

```bash
npx supabase gen types typescript \
  --project-id <ref> \
  > types/supabase.ts
```

Add to `package.json`:

```json
"db:types": "supabase gen types typescript --project-id <ref> > types/supabase.ts"
```

Import pattern:

```typescript
import type { Database } from '@/types/supabase'

type Generation = Database['public']['Tables']['generations']['Row']
type GenerationInsert = Database['public']['Tables']['generations']['Insert']
type GenerationStatus = Generation['status']
```

## AUTH PATTERNS

```typescript
// Get current user (Server Component / Route Handler)
const supabase = await createClient()
const {
  data: { user },
} = await supabase.auth.getUser()
// Note: getSession() is NOT reliable server-side — always use getUser()

// Sign in with email
await supabase.auth.signInWithPassword({ email, password })

// Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${origin}/auth/callback` },
})

// Sign out
await supabase.auth.signOut()
```

## COMMON MISTAKES TO AVOID

```
❌ supabase.from('table').select('*')
✅ supabase.from('table').select('id, status, created_at')

❌ const supabase = createBrowserClient(...) inline in component
✅ import { createClient } from '@/lib/supabase/client'

❌ supabase.auth.getSession() on server
✅ supabase.auth.getUser() on server

❌ NEXT_PUBLIC_ prefix on service role key
✅ SUPABASE_SERVICE_ROLE_KEY (server env only)

❌ Direct INSERT on generations from client
✅ POST /api/generate → server route → admin client → INSERT
```
