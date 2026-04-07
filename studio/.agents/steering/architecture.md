# steering: architecture

# authoritative decisions — do not deviate without explicit approval

## FOLDER STRUCTURE (locked)

```
app/
├── (auth)/
│   ├── auth/callback/route.ts      PKCE exchange
│   ├── auth/confirm/route.ts       Email OTP confirm
│   ├── auth/error/page.tsx         Auth error fallback
│   ├── login/page.tsx              Server shell → LoginForm
│   └── signup/page.tsx             Server shell → SignupForm
├── (studio)/
│   ├── layout.tsx                  ← auth guard + profile fetch (Server)
│   └── page.tsx                    ← fetches presets, renders StudioShell (Server)
├── api/
│   ├── generate/route.ts           POST — inference + DB logging
│   └── upload/route.ts             POST — garment to Storage
└── layout.tsx                      Root: fonts + ThemeProvider + Toaster

components/
├── studio/
│   ├── StudioShell.tsx             'use client' orchestrator
│   ├── GarmentUploader.tsx         'use client'
│   ├── ModelPresetGrid.tsx         Pure (no 'use client')
│   ├── GenerateButton.tsx          'use client'
│   ├── GenerationStatus.tsx        'use client' + Realtime
│   ├── GenerationOutput.tsx        'use client' + signed URL
│   └── StatusBadge.tsx             Pure display
├── auth/
│   ├── LoginForm.tsx               'use client'
│   ├── SignupForm.tsx              'use client'
│   └── OAuthButton.tsx             'use client'
└── ui/                             Shadcn only — never modify

hooks/
├── useGeneration.ts                State machine (idle→uploading→generating→done/error)
└── useRealtimeGeneration.ts        Supabase Realtime subscription

lib/
├── supabase/
│   ├── client.ts                   createBrowserClient
│   ├── server.ts                   createServerClient (async)
│   └── admin.ts                    service role (server-only)
├── inference/
│   ├── index.ts                    Provider router
│   ├── hf-spaces.ts                Gradio IDM-VTON (active)
│   ├── fal.ts                      Stub (post-expo)
│   └── types.ts                    InferenceRequest, InferenceResult
└── utils/
    ├── cn.ts                       clsx + tailwind-merge
    ├── upload.ts                   File validation
    └── storage.ts                  Signed URLs, upload helpers

types/
└── supabase.ts                     Generated — npx supabase gen types typescript

e2e/
├── studio-flow.spec.ts             Critical path test
└── fixtures/test-garment.jpg       Test image asset
```

## DATA FLOW DIAGRAM

```
CLIENT                              SERVER
------                              ------
GarmentUploader
  → file validation (client-side)
  → POST /api/upload
                                    upload/route.ts
                                      → Supabase Storage (garments bucket)
                                      ← { garmentPath }

GenerateButton (has garmentPath + presetId)
  → POST /api/generate
                                    generate/route.ts (admin client)
                                      → INSERT generations {status:'pending'}
                                      ← { generationId }     ← returned immediately
                                      → UPDATE {status:'processing'}  ← Realtime fires
                                      → getSignedUrl(garmentPath)
                                      → runInference(garmentUrl, presetId)
                                      → upload output to Storage
                                      → UPDATE {status:'completed', output_path}  ← Realtime fires

GenerationStatus (subscribed to generationId)
  ← Realtime: status='processing'   (shows progress bar)
  ← Realtime: status='completed'    (shows output)

GenerationOutput (outputPath set)
  → supabase.storage.createSignedUrl(outputPath)
  → renders <Image> with signed URL
  → download anchor
```

## AUTHENTICATION FLOW

```
User visits /studio
  → middleware.ts checks session
  → no session + KIOSK_MODE=false → redirect /auth/login

User at /auth/login
  → Email: signInWithPassword → redirect /studio
  → Google: signInWithOAuth → Supabase → /auth/callback → redirect /studio

/auth/callback/route.ts
  → exchangeCodeForSession(code)
  → redirect to /studio (or next param)

Session persists via SSR cookie (httpOnly, managed by @supabase/ssr)
```

## DEPENDENCY DECISION LOG

| Decision                                                  | Reason                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------- |
| `@supabase/ssr@0.9.0` not `@supabase/auth-helpers-nextjs` | auth-helpers deprecated, SSR is official                      |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` not `ANON_KEY`     | New Supabase key format post-2025                             |
| `tw-animate-css` not `tailwindcss-animate`                | tailwindcss-animate incompatible with Tailwind v4             |
| HF Spaces not fal.ai                                      | No payment method available, HF free tier sufficient for demo |
| No `forwardRef`                                           | React 19 ref as prop, forwardRef removed                      |
| `cookies()` with `await`                                  | Next.js 16 made cookies() async                               |
| No `tailwind.config.js`                                   | Tailwind v4 is CSS-first                                      |
| TailAdmin as shell                                        | Saves 2-3 days of sidebar/nav work before freeze              |
| Shadcn new-york style                                     | Consistent with TailAdmin visual language                     |

## INFERENCE MIGRATION PATH (for future reference)

When fal.ai payment is available:

1. Implement `lib/inference/fal.ts` (15-20 lines, see skills/inference.md stub)
2. Set `INFERENCE_PROVIDER=fal_ai` in Vercel env
3. No other files change — provider router in `lib/inference/index.ts` handles it
4. Update `generations.inference_provider` check constraint to include 'fal_ai' (already done)
