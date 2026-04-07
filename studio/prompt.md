# Anaqio — studio.anaqio.com MVP Init (Claude Code)

## LOCKED DEPENDENCY VERSIONS

# Fetched March 19, 2026 — pin these exactly, no upgrades without explicit approval

next@16.2.0
react@19.x (latest)
react-dom@19.x (latest)
typescript@~5.x
tailwindcss@4.x # CSS-first config, no tailwind.config.js
@tailwindcss/postcss@4.x # PostCSS plugin for Next.js
tw-animate-css # replaces deprecated tailwindcss-animate in v4
@supabase/supabase-js@2.x (latest)
@supabase/ssr@0.9.0 # replaces all @supabase/auth-helpers-\* (deprecated)
shadcn/ui (latest, new-york style) # Tailwind v4 + React 19 compatible
lucide-react@latest
class-variance-authority (cva)
clsx + tailwind-merge

# Dev

@types/node@latest
@types/react@latest
vitest@latest
@playwright/test@latest

## PROJECT IDENTITY

Product : Anaqio — studio.anaqio.com
Tagline : "Your Digital Atelier — Create. Style. Launch."
Context : Morocco's first AI-powered virtual fashion studio. Pre-seed.
Team : 2 founders (CEO + CTO). Feature freeze March 28.
Expos : Morocco Fashion & Tex (Apr 2–5) + GITEX Africa (Apr 7–9).
Account : Supabase psycholium account (production: anaqio.com already live on it)

## OBJECTIVE

Bootstrap studio.anaqio.com from zero to a working, deployable MVP.
Single-page AI virtual try-on app. No auth friction on day one except
protecting the generation API. Expo-kiosk ready. Real-time generation
status via Supabase Realtime. Every decision must ship before March 28.

---

## STEP 0 — PROJECT BOOTSTRAP

```bash
# Start from the official Supabase + Next.js SSR template (already wired correctly)
npx create-next-app -e with-supabase studio

cd studio

# Install and lock the full stack
npm install next@16.2.0 react@latest react-dom@latest
npm install tailwindcss@latest @tailwindcss/postcss
npm install tw-animate-css
npm install @supabase/supabase-js @supabase/ssr@0.9.0
npm install class-variance-authority clsx tailwind-merge lucide-react

# Init shadcn with Tailwind v4 + new-york style
npx shadcn@latest init
# When prompted: style=new-york, baseColor=neutral, cssVariables=yes

# Add required shadcn components
npx shadcn@latest add button card dialog progress badge
npx shadcn@latest add input label separator skeleton toast

# Upgrade codemod (cleans deprecated Tailwind v3 patterns)
npx @tailwindcss/upgrade
```

---

## STEP 1 — TAILWIND v4 CONFIGURATION

Tailwind v4 has NO `tailwind.config.js`. All config is CSS-first.

```css
/* app/globals.css — complete file */
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

@theme inline {
  /* Anaqio brand tokens */
  --color-brand-ink: #0f172a;
  --color-brand-navy: #1b2f52;
  --color-brand-blue: #2563eb;
  --color-brand-violet: #7c3aed;
  --color-brand-gold: #d4af37;

  /* Shadcn semantic tokens — map to brand */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
}

:root {
  /* Light mode — Anaqio palette */
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.03 264); /* ink */
  --primary: oklch(0.53 0.24 264); /* blue #2563EB */
  --primary-foreground: oklch(0.98 0 0);
  --secondary: oklch(0.56 0.27 293); /* violet #7C3AED */
  --secondary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.96 0.01 264);
  --muted-foreground: oklch(0.55 0.02 264);
  --accent: oklch(0.82 0.12 85); /* gold #D4AF37 */
  --accent-foreground: oklch(0.13 0.03 264);
  --destructive: oklch(0.62 0.22 25);
  --border: oklch(0.92 0.01 264);
  --input: oklch(0.92 0.01 264);
  --ring: oklch(0.53 0.24 264);
  --radius: 0.5rem;
}

.dark {
  --background: oklch(0.13 0.03 264); /* ink */
  --foreground: oklch(0.97 0.01 264);
  --primary: oklch(0.6 0.24 264);
  --primary-foreground: oklch(0.13 0.03 264);
  --secondary: oklch(0.6 0.27 293);
  --secondary-foreground: oklch(0.97 0.01 264);
  --muted: oklch(0.22 0.02 264);
  --muted-foreground: oklch(0.65 0.02 264);
  --accent: oklch(0.78 0.12 85);
  --accent-foreground: oklch(0.13 0.03 264);
  --destructive: oklch(0.65 0.22 25);
  --border: oklch(0.25 0.02 264);
  --input: oklch(0.25 0.02 264);
  --ring: oklch(0.6 0.24 264);
}
```

---

## STEP 2 — NEXT.JS 16 CONFIG

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true, // stable in Next.js 16, zero-config memoization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Supabase Storage signed URLs
      },
    ],
  },
  // Turbopack is default in Next.js 16 — no flag needed
  // If you have a custom webpack config it will break; remove it
}

export default nextConfig
```

---

## STEP 3 — ENVIRONMENT VARIABLES

```bash
# .env.local
# Supabase — psycholium project
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
# New key format (post-May 2025 projects use publishable key)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
# Legacy fallback if using older project
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...         # NEVER prefix with NEXT_PUBLIC_

# AI Inference
HF_SPACE_URL=https://yisol-idm-vton.hf.space
HF_API_TOKEN=hf_...

# Feature flags
NEXT_PUBLIC_KIOSK_MODE=false             # true on expo device — skips auth wall

# Future (declare now, implement post-expo)
# FAL_API_KEY=key_...
```

```bash
# .env.example — commit this, never .env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HF_SPACE_URL=
HF_API_TOKEN=
NEXT_PUBLIC_KIOSK_MODE=false
```

---

## STEP 4 — SUPABASE AUTH (SSR — @supabase/ssr@0.9.0)

Follow https://supabase.com/docs/guides/auth/quickstarts/nextjs exactly.
Use `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (new key format, replaces anon key).

```typescript
// lib/supabase/client.ts  — browser only, Client Components
import { createBrowserClient } from '@supabase/ssr'

import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
```

```typescript
// lib/supabase/server.ts  — RSC, Server Actions, Route Handlers
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

import type { Database } from '@/types/supabase'

export async function createClient() {
  const cookieStore = await cookies() // await required in Next.js 16
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {} // Server Component — can't write cookies, middleware handles it
        },
      },
    },
  )
}
```

```typescript
// middleware.ts  — session refresh on every request
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: Do not run logic between createServerClient and getClaims
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isKioskMode = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  const isStudioRoute = request.nextUrl.pathname.startsWith('/studio')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  if (!isKioskMode && !user && isStudioRoute && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
```

```typescript
// app/auth/callback/route.ts  — PKCE exchange
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/studio'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          },
        },
      },
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
```

---

## STEP 5 — SUPABASE SCHEMA

Apply as a single migration file: `supabase/migrations/20260319_studio_mvp.sql`

```sql
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

create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup trigger
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
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger (reuse for all tables)
create or replace function public.set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ============================================================
-- preset_models — static AI model catalog (managed by CTO)
-- ============================================================
create table public.preset_models (
  id            text primary key,          -- slug: 'f-01-moderne', 'm-01-casual'
  created_at    timestamptz default now() not null,
  label         text not null,             -- "Femme — Style Moderne"
  label_ar      text,                      -- Arabic label for UI
  preview_path  text not null,             -- Supabase Storage: presets/f-01.webp
  gender        text check (gender in ('female', 'male', 'neutral')),
  style_tags    text[] default '{}',       -- ['kaftan','modern','casual']
  active        boolean default true,
  sort_order    integer default 0
);

alter table public.preset_models enable row level security;

create policy "Public read active preset models"
  on public.preset_models for select
  using (active = true);

-- seed initial presets
insert into public.preset_models (id, label, label_ar, preview_path, gender, style_tags, sort_order)
values
  ('f-01-moderne',  'Femme — Style Moderne',    'أنثى — عصري',    'presets/f-01-moderne.webp',  'female', '{modern,casual}',  1),
  ('f-02-kaftan',   'Femme — Kaftan Élégant',   'أنثى — قفطان',   'presets/f-02-kaftan.webp',   'female', '{kaftan,elegant}', 2),
  ('f-03-casual',   'Femme — Casual Chic',      'أنثى — كاجوال',  'presets/f-03-casual.webp',   'female', '{casual,chic}',    3),
  ('m-01-moderne',  'Homme — Style Moderne',    'ذكر — عصري',     'presets/m-01-moderne.webp',  'male',   '{modern,smart}',   4),
  ('m-02-jellaba',  'Homme — Jellaba Classique','ذكر — جلابة',    'presets/m-02-jellaba.webp',  'male',   '{jellaba,classic}',5);

-- ============================================================
-- generations — core usage log (NEVER hard delete rows)
-- ============================================================
create table public.generations (
  id                  uuid default gen_random_uuid() primary key,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null,
  user_id             uuid references auth.users(id) on delete set null,
  session_id          text,               -- anon/kiosk: device or tab session
  status              text default 'pending'
                      check (status in ('pending','processing','completed','failed')),
  garment_path        text not null,      -- Storage: garments/{user_id}/{uuid}.webp
  preset_model_id     text references public.preset_models(id) not null,
  output_path         text,               -- Storage: outputs/{user_id}/{uuid}.webp
  inference_provider  text default 'hf_spaces'
                      check (inference_provider in ('hf_spaces','fal_ai')),
  inference_ms        integer,            -- latency in ms for performance tracking
  error_message       text,
  metadata            jsonb default '{}'::jsonb  -- seed, style params, etc.
);

alter table public.generations enable row level security;

-- Users read own generations; service role inserts (from /api/generate)
create policy "Users read own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Anon read own session generations"
  on public.generations for select
  using (session_id = current_setting('request.headers', true)::json->>'x-session-id');

-- IMPORTANT: no INSERT policy for authenticated role
-- Inserts happen server-side via service role key only

create index generations_user_id_idx    on public.generations(user_id);
create index generations_session_id_idx on public.generations(session_id);
create index generations_status_idx     on public.generations(status);
create index generations_created_at_idx on public.generations(created_at desc);

create trigger generations_updated_at
  before update on public.generations
  for each row execute function public.set_updated_at();

-- Enable Realtime on generations (client subscribes for live status)
alter publication supabase_realtime add table public.generations;

-- ============================================================
-- Storage buckets (run in Supabase Dashboard or via CLI)
-- ============================================================
-- insert into storage.buckets (id, name, public) values
--   ('garments', 'garments', false),  -- user uploads, private
--   ('outputs',  'outputs',  false),  -- generated results, private signed URL
--   ('presets',  'presets',  true);   -- preset model previews, public
```

---

## STEP 6 — PROJECT FOLDER STRUCTURE

Build exactly this — no deviations:

```
app/
├── (auth)/
│   ├── auth/
│   │   ├── callback/route.ts       # PKCE code exchange (Step 4)
│   │   ├── confirm/route.ts        # Email OTP confirm
│   │   └── error/page.tsx          # Auth error fallback
│   ├── login/page.tsx              # Server Component shell
│   └── signup/page.tsx             # Server Component shell
├── (studio)/
│   ├── layout.tsx                  # Server: auth guard + profile fetch
│   └── page.tsx                    # Server: passes presets + user to StudioShell
├── api/
│   └── generate/
│       └── route.ts                # POST — HF Spaces call + generations insert
└── layout.tsx                      # Root: fonts, ThemeProvider, Toaster

components/
├── studio/
│   ├── StudioShell.tsx             # 'use client' — orchestrates full studio UI
│   ├── GarmentUploader.tsx         # 'use client' — drag-drop upload
│   ├── ModelPresetGrid.tsx         # Pure display, receives presets as props
│   ├── GenerateButton.tsx          # 'use client' — calls /api/generate
│   ├── GenerationStatus.tsx        # 'use client' — Realtime subscription
│   └── GenerationOutput.tsx        # 'use client' — preview + download
├── auth/
│   ├── LoginForm.tsx               # 'use client'
│   ├── SignupForm.tsx              # 'use client'
│   └── OAuthButton.tsx             # 'use client' — Google OAuth
└── ui/                             # Shadcn primitives only — never modify

hooks/
├── useGeneration.ts                # Generation state machine
└── useRealtimeGeneration.ts        # Supabase Realtime subscription

lib/
├── supabase/
│   ├── client.ts                   # createBrowserClient
│   ├── server.ts                   # createServerClient (async)
│   └── admin.ts                    # createClient with service_role (server only)
├── inference/
│   ├── hf-spaces.ts                # Gradio client wrapper — IDM-VTON
│   └── types.ts                    # InferenceRequest, InferenceResult
└── utils/
    ├── cn.ts                       # clsx + tailwind-merge
    ├── upload.ts                   # validateGarmentFile: type, size, dimensions
    └── storage.ts                  # getSignedUrl, uploadGarment, uploadOutput

types/
└── supabase.ts                     # Generated: npx supabase gen types typescript
```

---

## STEP 7 — CORE IMPLEMENTATION FILES

### 7a. `lib/utils/cn.ts`

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 7b. `lib/inference/hf-spaces.ts`

```typescript
// HuggingFace Spaces Gradio client — IDM-VTON
// fal.ai migration: only this file changes
import type { InferenceRequest, InferenceResult } from './types'

export async function runVTON(request: InferenceRequest): Promise<InferenceResult> {
  const { Client } = await import('@gradio/client')
  const client = await Client.connect(process.env.HF_SPACE_URL!, {
    hf_token: process.env.HF_API_TOKEN as `hf_${string}`,
  })
  const result = await client.predict('/tryon', {
    dict: { background: request.garmentUrl, layers: [], composite: null },
    garm_img: request.garmentUrl,
    garment_des: request.description ?? '',
    is_checked: true,
    is_checked_crop: false,
    denoise_steps: 30,
    seed: request.seed ?? 42,
  })
  return {
    outputUrl: (result.data as { url: string }[])[0].url,
    inferenceMs: result.duration ? Math.round(result.duration * 1000) : undefined,
  }
}
```

### 7c. `app/api/generate/route.ts`

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { runVTON } from '@/lib/inference/hf-spaces'
import { createClient as createAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { uploadOutput } from '@/lib/utils/storage'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  if (!isKiosk && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { garmentPath, presetModelId, sessionId } = await request.json()
  if (!garmentPath || !presetModelId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const admin = createAdmin()

  // 1. Insert pending generation row — return id immediately to client
  const { data: generation, error: insertError } = await admin
    .from('generations')
    .insert({
      user_id: user?.id ?? null,
      session_id: sessionId ?? null,
      status: 'pending',
      garment_path: garmentPath,
      preset_model_id: presetModelId,
      inference_provider: 'hf_spaces',
    })
    .select('id')
    .single()

  if (insertError || !generation) {
    return NextResponse.json({ error: 'Failed to create generation' }, { status: 500 })
  }

  // 2. Update to processing (client Realtime picks this up)
  await admin.from('generations').update({ status: 'processing' }).eq('id', generation.id)

  // 3. Get signed URL for garment to pass to HF Spaces
  const { data: signedUrl } = await admin.storage.from('garments').createSignedUrl(garmentPath, 300) // 5min TTL

  if (!signedUrl?.signedUrl) {
    await admin
      .from('generations')
      .update({
        status: 'failed',
        error_message: 'Could not read garment file',
      })
      .eq('id', generation.id)
    return NextResponse.json({ error: 'Storage error' }, { status: 500 })
  }

  // 4. Run inference (this is the slow part — HF Spaces ~30-60s)
  const start = Date.now()
  try {
    const result = await runVTON({ garmentUrl: signedUrl.signedUrl })
    const inferenceMs = Date.now() - start

    // 5. Upload output to Supabase Storage
    const outputPath = await uploadOutput(result.outputUrl, user?.id ?? sessionId ?? 'anon')

    // 6. Mark completed — Realtime notifies client
    await admin
      .from('generations')
      .update({
        status: 'completed',
        output_path: outputPath,
        inference_ms: inferenceMs,
      })
      .eq('id', generation.id)

    return NextResponse.json({ generationId: generation.id, outputPath })
  } catch (err) {
    await admin
      .from('generations')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Inference failed',
        inference_ms: Date.now() - start,
      })
      .eq('id', generation.id)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
```

### 7d. `hooks/useRealtimeGeneration.ts`

```typescript
'use client'

import { useEffect, useState } from 'react'

import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'

type Generation = Database['public']['Tables']['generations']['Row']
type GenerationStatus = Generation['status']

export function useRealtimeGeneration(generationId: string | null) {
  const [status, setStatus] = useState<GenerationStatus>('pending')
  const [outputPath, setOutputPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!generationId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`generation:${generationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generations',
          filter: `id=eq.${generationId}`,
        },
        (payload) => {
          const row = payload.new as Generation
          setStatus(row.status)
          if (row.status === 'completed' && row.output_path) {
            setOutputPath(row.output_path)
          }
          if (row.status === 'failed') {
            setError(row.error_message ?? 'Generation failed')
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [generationId])

  return { status, outputPath, error }
}
```

### 7e. `hooks/useGeneration.ts`

```typescript
'use client'

import { useState } from 'react'

type State = 'idle' | 'uploading' | 'generating' | 'completed' | 'error'

export function useGeneration() {
  const [state, setState] = useState<State>('idle')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function startGeneration(garmentFile: File, presetModelId: string) {
    setState('uploading')
    setErrorMessage(null)

    try {
      // 1. Upload garment to Supabase Storage via Server Action or direct upload
      const formData = new FormData()
      formData.append('garment', garmentFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { garmentPath } = await uploadRes.json()

      // 2. Start generation
      setState('generating')
      const sessionId = sessionStorage.getItem('anaqio-session') ?? crypto.randomUUID()
      sessionStorage.setItem('anaqio-session', sessionId)

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ garmentPath, presetModelId, sessionId }),
      })
      if (!genRes.ok) throw new Error('Generation request failed')
      const { generationId } = await genRes.json()
      setGenerationId(generationId)
      // Realtime hook picks up status changes from here
    } catch (err) {
      setState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  function reset() {
    setState('idle')
    setGenerationId(null)
    setErrorMessage(null)
  }

  return { state, generationId, errorMessage, startGeneration, reset }
}
```

---

## STEP 8 — COMPONENT RULES (DRY ENFORCEMENT)

### Server Components — NO `'use client'`

- `app/(studio)/layout.tsx` — auth check, profile fetch, pass to children
- `app/(studio)/page.tsx` — fetches `preset_models` once, renders `<StudioShell>`
- `ModelPresetGrid` — receives presets as props, pure display

### Client Components — `'use client'` required

- `StudioShell` — state machine, coordinates all studio sub-components
- `GarmentUploader` — FileReader, drag/drop events
- `GenerateButton` — calls `useGeneration`, loading state
- `GenerationStatus` — subscribes via `useRealtimeGeneration`
- `GenerationOutput` — signed URL fetch + download trigger
- `LoginForm`, `SignupForm`, `OAuthButton` — form state + auth calls

### Absolute Rules

1. `createClient()` and `createServerClient()` — only from `lib/supabase/`. Never inline.
2. `cn()` — only from `lib/utils/cn.ts`. Never raw `clsx` or string concatenation.
3. `select()` — never `select('*')`. Always name columns explicitly.
4. `SUPABASE_SERVICE_ROLE_KEY` — only in `lib/supabase/admin.ts`. Never in client code.
5. No `any` types. All Supabase types from `types/supabase.ts` (generated).
6. No `tailwind.config.js` — Tailwind v4 is CSS-first. All config in `globals.css`.
7. No `forwardRef` — shadcn v4 + React 19 removed it.
8. No `tailwindcss-animate` — use `tw-animate-css` in `globals.css`.

---

## STEP 9 — TYPES GENERATION

```bash
# After schema migration is applied, generate TypeScript types
npx supabase gen types typescript \
  --project-id <psycholium-ref> \
  > types/supabase.ts

# Add to package.json scripts for easy refresh
"db:types": "supabase gen types typescript --project-id <ref> > types/supabase.ts"
```

---

## STEP 10 — FONTS (next/font — no external link tags)

```typescript
// app/layout.tsx
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true,
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${syne.variable} ${plusJakarta.variable} font-body antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

---

## STEP 11 — KIOSK MODE (EXPO DEVICE)

On the expo device, set `NEXT_PUBLIC_KIOSK_MODE=true` in Vercel environment
(preview deployment or dedicated kiosk deployment).

Behavior when `KIOSK_MODE=true`:

- Middleware skips the auth redirect
- `StudioShell` skips the login wall
- `sessionId` from `sessionStorage` replaces `user_id` for generation logging
- A pre-warmed garment can be injected via URL param: `?demo=kaftan-red`

---

## STEP 12 — GIT BRANCH STRATEGY

```
main          → production (studio.anaqio.com)
staging       → stage.anaqio.com (Vercel preview)
feat/*        → feature branches, PR into staging
fix/*         → bugfix branches, PR into staging
```

Commit convention (Conventional Commits):

```
feat(studio): add preset model grid
feat(auth): wire Google OAuth callback
fix(realtime): cleanup channel on component unmount
perf(images): migrate to next/image with AVIF
chore(deps): lock next@16.2.0 and @supabase/ssr@0.9.0
```

---

## DONE CRITERIA — MUST ALL PASS BEFORE MARCH 28

**Infrastructure**

- [ ] Schema migration applied on psycholium Supabase
- [ ] RLS active: `profiles`, `generations`, `preset_models`
- [ ] Storage buckets: `garments` (private), `outputs` (private), `presets` (public)
- [ ] Google OAuth configured (redirect: `https://studio.anaqio.com/auth/callback`)
- [ ] Vercel project linked to `studio.anaqio.com`, all env vars set

**Auth**

- [ ] Email/password signup + login + redirect to `/studio`
- [ ] Google OAuth end-to-end with correct PKCE callback
- [ ] Unauthenticated `/studio` → redirects to `/auth/login`
- [ ] Session survives page refresh (SSR cookie via middleware)
- [ ] `NEXT_PUBLIC_KIOSK_MODE=true` bypasses auth, still logs to `generations`

**Studio Core**

- [ ] Garment upload: drag-drop + click, validates type/size, uploads to `garments` bucket
- [ ] Preset grid renders all 5 presets with Supabase public URL previews
- [ ] Generate button POSTs to `/api/generate`, receives `generationId`
- [ ] Realtime subscription shows live status: pending → processing → completed
- [ ] Output image renders via Supabase signed URL on `status='completed'`
- [ ] Download button triggers `<a download>` with signed output URL
- [ ] Error state shows retry on `status='failed'`

**Code Quality**

- [ ] Zero `select('*')` queries
- [ ] Zero inline `createClient()` outside `lib/supabase/`
- [ ] Zero `any` types in inference pipeline
- [ ] `generations` insert only from service role (server-side)
- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] Lighthouse Performance ≥ 85 on mobile (Vercel Speed Insights baseline)
