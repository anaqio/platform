# skill: nextjs

# load when: routing · RSC · Server Actions · middleware · metadata · API routes

## VERSION: Next.js 16.2.0 (App Router, Turbopack default, React Compiler enabled)

## SERVER vs CLIENT — DECISION TREE

```
Need useState / useEffect / event handlers / browser API?
  YES → 'use client'
  NO  → Server Component (default, no annotation needed)

Need both data + interactivity?
  → Server parent fetches data, passes as props to 'use client' child
```

## FILE CONVENTIONS

```
app/
├── layout.tsx          → shared layout (Server Component)
├── page.tsx            → route UI (Server Component by default)
├── loading.tsx         → Suspense fallback
├── error.tsx           → error boundary ('use client' required)
├── not-found.tsx       → 404
└── route.ts            → API route handler (GET/POST/etc)
```

## ROUTE GROUPS (no URL impact)

```
app/
├── (auth)/             → login, signup — no auth layout
│   └── login/page.tsx
└── (studio)/           → protected routes — auth layout
    ├── layout.tsx      → auth guard here
    └── page.tsx        → main studio
```

## DATA FETCHING PATTERNS

```typescript
// Server Component — fetch directly, no useEffect
export default async function Page() {
  const supabase = await createClient()
  const { data: presets } = await supabase
    .from('preset_models')
    .select('id, label, label_ar, preview_path, gender, style_tags')
    .eq('active', true)
    .order('sort_order')
  return <PresetGrid presets={presets ?? []} />
}

// Parallel fetch (faster)
const [presetsResult, profileResult] = await Promise.all([
  supabase.from('preset_models').select('id, label, preview_path').eq('active', true),
  supabase.from('profiles').select('id, plan, full_name').eq('id', user.id).single(),
])
```

## API ROUTE HANDLERS

```typescript
// app/api/generate/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Always validate auth first
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Validate body
  const body = await request.json()
  if (!body.garmentPath || !body.presetModelId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Business logic here using admin client
  return NextResponse.json({ generationId: '...' })
}

// Export only methods you implement — unused methods return 405 automatically
```

## MIDDLEWARE (session refresh — runs on every request)

```typescript
// middleware.ts — critical: must refresh session on every request
// See .agents/skills/supabase.md for full implementation
// matcher must exclude static files
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|webp)$).*)'],
}
```

## SERVER ACTIONS

```typescript
'use server'

import { revalidatePath } from 'next/cache'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await supabase
    .from('profiles')
    .update({ full_name: formData.get('full_name') as string })
    .eq('id', user.id)

  revalidatePath('/studio')
}
```

## IMAGE OPTIMIZATION

```typescript
// Always use next/image — never <img> for user content
import Image from 'next/image'

// Above-fold hero — priority flag required
<Image src="/hero.webp" alt="..." fill priority sizes="100vw" />

// Preset model thumbnails
<Image
  src={getPresetPublicUrl(preset.preview_path)}
  alt={preset.label}
  width={200}
  height={280}
  className="object-cover rounded-lg"
  sizes="(max-width: 768px) 50vw, 200px"
/>

// AI output (private, use signed URL)
<Image
  src={signedUrl}
  alt="Generated output"
  fill
  className="object-contain"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## METADATA

```typescript
// app/(studio)/layout.tsx — static
export const metadata: Metadata = {
  title: 'Anaqio Studio — Votre Atelier Digital',
  description: "Créez des photos mode professionnelles avec l'IA. 90% moins cher qu'un studio.",
  openGraph: {
    title: 'Anaqio — Your Digital Atelier',
    description: 'AI-powered virtual fashion studio. Create. Style. Launch.',
    url: 'https://studio.anaqio.com',
    siteName: 'Anaqio',
    images: [{ url: '/og-studio.jpg', width: 1200, height: 630 }],
    locale: 'fr_MA',
  },
}
```

## FONTS (next/font — never <link> tags)

```typescript
import { Syne, Plus_Jakarta_Sans } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400','500','600','700','800'],
  display: 'swap',
  preload: true,
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300','400','500','600','700'],
  display: 'swap',
  preload: true,
})

// In layout.tsx body:
<body className={`${syne.variable} ${plusJakarta.variable} font-body antialiased`}>
```

## DYNAMIC IMPORTS (bundle splitting)

```typescript
// Heavy animation — no SSR needed
const MotionDiv = dynamic(() =>
  import('framer-motion').then(m => m.motion.div), { ssr: false }
)

// Heavy dialog — load on demand
const GenerationDialog = dynamic(() =>
  import('@/components/studio/GenerationDialog'), {
    loading: () => <Skeleton className="h-96 w-full" />,
  }
)
```

## NEXT.JS 16 SPECIFICS

```typescript
// next.config.ts
const config: NextConfig = {
  reactCompiler: true, // zero-config memoization
  // Turbopack is DEFAULT — no --turbo flag needed
  // No webpack config unless absolutely necessary
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }],
  },
}
```

## ANTI-PATTERNS

```
❌ 'use client' on layout.tsx or page.tsx
✅ Keep layouts/pages as Server Components, push 'use client' to leaf components

❌ fetch() in useEffect for initial data
✅ Fetch in Server Component, pass as props

❌ cookies() without await in Next.js 16
✅ const cookieStore = await cookies()

❌ import { useRouter } from 'next/navigation' in Server Component
✅ useRouter only in Client Components

❌ Large client bundles — importing heavy libs at top level
✅ dynamic() for Framer Motion, heavy charts, editor components
```
