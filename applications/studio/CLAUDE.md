# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Product

**studio.anaqio.com** — AI Virtual Fashion Studio (virtual try-on).
Stack: Next.js 16.2 · Tailwind CSS v4 (CSS-first, no tailwind.config.js) · Shadcn/ui (new-york) · Supabase · Vercel.
Team: 2 founders. CEO = Amal. Feature freeze: March 28, 2026.

---

## Development Commands

```bash
bun run dev              # next dev (Turbopack, default in Next.js 16)
bun run build            # next build
bun run start            # next start (production server)
bun run lint             # eslint
bun run type-check       # tsc --noEmit
bun run test             # vitest run (unit tests)
bun run test:watch       # vitest (watch mode)
bun run test:coverage    # vitest --coverage
bun run test:e2e         # playwright test
bun run db:types         # supabase gen types typescript → types/supabase.ts
bun run db:push          # supabase db push
bun run db:reset         # supabase db reset
```

Single test file: `bunx vitest run path/to/file.test.ts`
Single e2e spec: `bunx playwright test e2e/studio-flow.spec.ts`

---

## Architecture

### Core Flow: Upload → Generate → Preview

```
CLIENT                              SERVER
──────                              ──────
GarmentUploader
  → client-side file validation
  → POST /api/upload
                                    upload/route.ts
                                      → Supabase Storage (garments bucket)
                                      ← { garmentPath }

GenerateButton (has garmentPath + presetId)
  → POST /api/generate
                                    generate/route.ts (admin/service-role client)
                                      → INSERT generations {status:'pending'}
                                      ← { generationId }       ← returned immediately
                                      → UPDATE {status:'processing'}  ← Realtime fires
                                      → getSignedUrl(garmentPath)
                                      → runInference(garmentUrl)      ← HF Spaces ~30-60s
                                      → upload output to Storage
                                      → UPDATE {status:'completed'}   ← Realtime fires

GenerationStatus (subscribed via Realtime to generationId)
  ← postgres_changes: status='processing'  → shows progress
  ← postgres_changes: status='completed'   → shows output

GenerationOutput
  → createSignedUrl(outputPath) → renders <Image> → download button
```

### Auth Flow

```
User visits /studio → middleware.ts checks session
  → no session + KIOSK_MODE=false → redirect /auth/login
  → KIOSK_MODE=true → bypass auth, use sessionId for generation tracking

Login: email signInWithPassword or Google OAuth → /auth/callback (PKCE exchange) → /studio
Session persists via SSR httpOnly cookie managed by @supabase/ssr middleware.
```

### Server vs Client Component Boundary

Server Components (default, no `'use client'`): layouts, pages, `ModelPresetGrid` — fetch data, pass as props.
Client Components (`'use client'`): `StudioShell` (orchestrator), `GarmentUploader`, `GenerateButton`, `GenerationStatus`, `GenerationOutput`, auth forms — need state/effects/events.
Pattern: Server parent fetches → passes props → Client child handles interactivity.

### Supabase Client Architecture (3 clients, strict separation)

| Client  | File                     | Where                               | Key                                                             |
| ------- | ------------------------ | ----------------------------------- | --------------------------------------------------------------- |
| Browser | `lib/supabase/client.ts` | Client Components                   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`                          |
| Server  | `lib/supabase/server.ts` | RSC, Server Actions, Route Handlers | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (with cookie forwarding) |
| Admin   | `lib/supabase/admin.ts`  | Server-only (API routes)            | `SUPABASE_SERVICE_ROLE_KEY`                                     |

### Inference Provider Pattern

3 providers behind `lib/inference/index.ts` router. User selects at step 1 of studio flow.

| Provider   | File                         | Model                                       | Env var                        |
| ---------- | ---------------------------- | ------------------------------------------- | ------------------------------ |
| IDM-VTON   | `lib/inference/hf-spaces.ts` | Gradio IDM-VTON (HF Spaces)                 | `HF_SPACE_URL`, `HF_API_TOKEN` |
| Leffa VTON | `lib/inference/fal.ts`       | `fal-ai/leffa/virtual-tryon`                | `FAL_KEY`                      |
| Gemini     | `lib/inference/gemini.ts`    | `gemini-2.5-flash-preview-image-generation` | `GOOGLE_AI_API_KEY`            |

### Database

3 tables: `profiles`, `preset_models`, `generations`. Full schema in `.agents/steering/schema.md`.
Status flow: `pending → processing → completed | failed`.
Realtime: `generations` table on `supabase_realtime` publication.
Storage buckets: `garments` (private), `outputs` (private), `presets` (public).

---

## Absolute Rules

```
RULE-01  createClient()         → lib/supabase/client.ts only (never inline)
RULE-02  createServerClient()   → lib/supabase/server.ts only (never inline)
RULE-03  service_role key       → lib/supabase/admin.ts only, never NEXT_PUBLIC_
RULE-04  select()               → never select('*'), always name columns
RULE-05  cn()                   → lib/utils/cn.ts only (clsx + tailwind-merge)
RULE-06  tailwind config        → globals.css @theme only, no tailwind.config.js
RULE-07  generations INSERT     → server-side via service role only
RULE-08  'use client'           → only when useState/useEffect/events needed
RULE-09  types                  → types/supabase.ts (generated), no `any`
RULE-10  forwardRef             → never (React 19 removed it)
RULE-11  tailwindcss-animate    → never (use tw-animate-css)
RULE-12  scope creep            → refuse features not in SCOPE section
```

---

## Scope (MVP)

**IN:** upload garment → select preset → generate → preview → download.
Supabase Auth (email + Google OAuth). `generations` logging. Realtime status. Kiosk mode.

**OUT (refuse):** batch generation · lookbook editor · billing/paywall ·
Shopify · custom model UI · admin dashboard · social sharing ·
multi-language toggle · A/B testing.

---

## Key Dependency Decisions

| Choice                                                | Reason                                                  |
| ----------------------------------------------------- | ------------------------------------------------------- |
| `@supabase/ssr@0.9.0` not `auth-helpers-nextjs`       | auth-helpers deprecated                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` not `ANON_KEY` | New Supabase key format post-2025                       |
| `tw-animate-css` not `tailwindcss-animate`            | tailwindcss-animate incompatible with Tailwind v4       |
| HF Spaces not fal.ai                                  | No payment method yet; HF free tier sufficient for demo |
| No `forwardRef`                                       | React 19 ref-as-prop                                    |
| `await cookies()`                                     | Next.js 16 made all request APIs async                  |

---

## Env Vars (never hardcode)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY   # sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY              # server-only
HF_SPACE_URL                           # https://yisol-idm-vton.hf.space
HF_API_TOKEN
GOOGLE_AI_API_KEY                      # Gemini Imagen
FAL_KEY                                # fal.ai Leffa VTON
NEXT_PUBLIC_KIOSK_MODE                 # 'true' on expo device
```

---

## Error Handling Pattern

```typescript
const { data, error } = await supabase.from('table').select('col1, col2')
if (error) throw new Error(`[table.select] ${error.message}`)
```

---

## Commit Convention

```
feat(studio): description     fix(realtime): description
feat(auth): description       perf(images): description
db(migration): description    chore(deps): description
```

---

## Agent Skills (load on demand)

> Load only what the current task requires. `Read .agents/skills/<name>.md`

| Task                                   | Skill file      |
| -------------------------------------- | --------------- |
| Database · RLS · migrations            | `supabase.md`   |
| Next.js routing · RSC · Server Actions | `nextjs.md`     |
| HF Spaces · inference                  | `inference.md`  |
| Components · cva · cn                  | `components.md` |
| Realtime · subscriptions               | `realtime.md`   |
| Brand tokens · Tailwind v4             | `brand.md`      |
| Testing · Vitest · Playwright          | `testing.md`    |

Detailed schema: `.agents/steering/schema.md`
Architecture/file tree: `.agents/steering/architecture.md`
Project constants: `.agents/context/project-constants.md`
MCP config: `.agents/mcp/.mcp.json`

---

## Hooks

Before any task: read `.agents/hooks/pre-task.md`
After any task: read `.agents/hooks/post-task.md`
