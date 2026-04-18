# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

**Anaqio** — AI-powered fashion commerce platform for the Moroccan market. Democratizes professional fashion imagery for Moroccan brands via AI virtual try-on and studio photography. Target: 90% cost reduction vs traditional photoshoots (5,000–20,000 MAD/collection).

This directory is a **Bun workspaces monorepo** orchestrated by Turborepo. Each app has its own git repo and deploys independently, but all share tooling configs and utility packages via `packages/`.

**Team:** 2 founders — Amal (Visionary: strategy, brand, partnerships) and Moughamir (Integrator: technical execution, architecture, shipping).

### Apps (Bun workspace members — under `applications/`)

| Directory                    | What                                            | Stack                                                    | Deploys to                  |
| ---------------------------- | ----------------------------------------------- | -------------------------------------------------------- | --------------------------- |
| `applications/studio/`       | AI Virtual Fashion Studio (virtual try-on MVP)  | Next.js 16, Supabase, Zustand, Vitest, Playwright        | studio.anaqio.com           |
| `applications/landing-page/` | Corporate waitlist + brand site                 | Next.js 16, Framer Motion, next-intl, Remotion, Supabase | anaqio.com                  |
| `applications/backoffice/`   | Internal backoffice (CRM, campaigns, dashboard) | Next.js 16, Supabase, Tailwind v4                        | backoffice.anaqio.com (TBD) |

### Shared Packages (`packages/`)

| Package                 | What                                                  |
| ----------------------- | ----------------------------------------------------- |
| `@anaqio/ui`            | Shared UI components (shadcn/ui New York style)       |
| `@anaqio/schemas`       | Shared Zod validation schemas                         |
| `@anaqio/tsconfig`      | Base tsconfig presets (`base.json`, `nextjs.json`)    |
| `@anaqio/eslint-config` | Shared ESLint flat config (`index.mjs`, `nextjs.mjs`) |
| `@anaqio/utils`         | `cn()` utility (clsx + tailwind-merge)                |
| `@anaqio/supabase`      | Supabase 3-client factories (browser/server/admin)    |

### Other Directories

| Directory         | What                                                             |
| ----------------- | ---------------------------------------------------------------- |
| `supabase/`       | Consolidated DB migrations + config for unified Supabase project |
| `ai-studio-base/` | Google AI Studio prototype (Vite + React, untracked)             |
| `tsx-playground/` | Component playground (Bun + React, untracked)                    |
| `design/`         | Design assets (placeholder)                                      |
| `docs/`           | Documentation + Company OS                                       |
| `legals/`         | Legal documents (placeholder)                                    |

**For app-specific work, `cd` into the sub-project.** Each app has its own CLAUDE.md — defer to those for architecture details. For cross-app tasks (lint all, build all, type-check all), run from root with `turbo`.

### Dev Ports

| Project                      | Default port                               |
| ---------------------------- | ------------------------------------------ |
| `applications/studio/`       | 3000                                       |
| `applications/backoffice/`   | 3001                                       |
| `applications/landing-page/` | 3002 (set via `PORT=3002` in `.env.local`) |

## Common Stack Across Active Projects

- **Runtime:** Bun (use `bun run`, `bunx` — not `npm`/`npx`)
- **Framework:** Next.js 16 (App Router, React 19, React Compiler enabled, Turbopack default)
- **Styling:** Tailwind CSS v4 (CSS-first config via `globals.css @theme`, no `tailwind.config.js`) + shadcn/ui (new-york style)
- **Database/Auth:** Supabase (`@supabase/ssr` for SSR cookie auth, 3-client pattern: browser/server/admin). Env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (not `PUBLISHABLE_KEY`).
- **Formatting:** Prettier + Husky + lint-staged (auto-runs on commit)
- **Testing:** Vitest (unit) + Playwright (e2e)

## Workspace Commands (from root)

```bash
# Run across all apps in parallel (Turbo caches results)
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build
TURBO_TELEMETRY_DISABLED=1 bunx turbo run lint
TURBO_TELEMETRY_DISABLED=1 bunx turbo run type-check
TURBO_TELEMETRY_DISABLED=1 bunx turbo run test

# Filter to a single app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build --filter=studio

# Format all files
bun run format          # prettier --write .
bun run format:check    # prettier --check .

# Install all workspace dependencies
bun install
```

> Set `TURBO_TELEMETRY_DISABLED=1` globally in `~/.exports` to skip the flag.

## Per-App Commands

### applications/studio/

```bash
cd applications/studio
bun run dev           # next dev (Turbopack)
bun run build         # next build
bun run lint          # eslint
bun run type-check    # tsc --noEmit
bun run test          # vitest run
bun run test:e2e      # playwright test
bun run clean         # rm -rf .next
bun run db:types      # regenerate Supabase types
```

### applications/landing-page/

```bash
cd applications/landing-page
bun run dev           # next dev
bun run build         # next build
bun run lint          # eslint
bun run test          # vitest
bun run test:e2e      # playwright test
bun run clean         # rm -rf .next
bun run video:dev     # remotion studio (video compositions)
bun run audit         # full brand/performance/supabase audit
```

### applications/backoffice/

```bash
cd applications/backoffice
bun run dev           # next dev --turbopack on port 3001
bun run build
bun run lint          # eslint (shared @anaqio/eslint-config/nextjs)
bun run type-check
bun run clean         # rm -rf .next
```

### ai-studio-base/ (untracked prototype)

```bash
cd ai-studio-base
npm install && npm run dev   # Vite dev server on :3000
```

Requires `GEMINI_API_KEY` in `.env.local`.

## Cross-Project Conventions

### Shared packages

- **`cn()`** — import from `@anaqio/utils/cn` (re-exported at `lib/utils/cn.ts` in each app)
- **Supabase clients** — thin wrappers in `lib/supabase/{client,server,admin}.ts` call factory functions from `@anaqio/supabase`. Never inline `createClient()`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- **ESLint** — all apps extend `@anaqio/eslint-config/nextjs`; app-level overrides added locally
- **TypeScript** — all apps extend `@anaqio/tsconfig/nextjs`; paths (`@/*`) defined locally per app
- **Prettier** — root `.prettierrc` is canonical (semi: false, width: 100); no per-app overrides needed

### React / Next.js

- **No `forwardRef`** — React 19 removed it; use ref-as-prop.
- **Async request APIs** — Next.js 16: `await cookies()`, `await headers()`, `await params`, `await searchParams`.
- **`tw-animate-css`** not `tailwindcss-animate` — the latter is incompatible with Tailwind v4.

### Database

- **No `select('*')`** in Supabase queries — always name columns explicitly.
- **Env vars never hardcoded** — copy `.env.example` → `.env.local`, never commit `.env*.local`.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (landing-page, backoffice) vs `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (studio) — each app uses its own key name.

### Database

- **Single Supabase project**, multi-schema: `studio` (virtual try-on), `landing` (marketing), `public` (shared views).
- App clients declare their schema: `studio` uses `schema: 'studio'`, landing-page uses `schema: 'landing'`.
- Backoffice admin client queries `public.*` cross-schema views (`user_overview`, `generation_stats`, `campaign_signup_stats`).
- All migrations live in root `supabase/migrations/` — never edit the dashboard directly.

### Git

- **Root git** (`com.anaqio/.git`) is the single source of truth — all apps and packages tracked here.
- **Conventional Commits:** `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`, `db:` with optional scope (e.g., `feat(studio): ...`).

## Key Architectural Differences

| Concern          | applications/studio/                                                | applications/landing-page/                                       | applications/backoffice/                 |
| ---------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| State management | Zustand stores                                                      | Framer Motion + React state                                      | React state + server components          |
| Auth             | Supabase email + Google OAuth, kiosk mode bypass                    | Supabase SSR session refresh                                     | Supabase SSR (read-only, no public auth) |
| i18n             | None                                                                | next-intl + Crowdin (FR primary, EN, AR planned) — 14 namespaces | None                                     |
| Email            | None                                                                | Brevo (waitlist automation)                                      | None                                     |
| Video            | None                                                                | Remotion compositions                                            | None                                     |
| Inference        | 3 providers (HF Spaces, fal.ai, Gemini) via `lib/inference/` router | None                                                             | None                                     |
| Realtime         | Supabase Realtime (generation status)                               | None                                                             | None                                     |
| Vercel config    | `vercel.json` (300s maxDuration on `/api/generate`)                 | Security headers in `next.config.ts`                             | —                                        |
| Design system    | shadcn/ui defaults                                                  | Omnizya free-atom composition (see AGENTS.md)                    | shadcn/ui defaults                       |
| Fonts            | System/shadcn defaults                                              | Syne (display) + Plus Jakarta Sans (body)                        | System/shadcn defaults                   |
| Brand colors     | Standard shadcn theming                                             | Navy #1B2F52, Blue #2C5F8A, Gold #D4AF37 (strict)                | Standard shadcn theming                  |

## AI Agent Context

Both `applications/studio/` and `applications/landing-page/` have `.agents/` directories consumed by AI agents (Claude, Gemini, Qwen):

- `skills/` — domain context files (supabase.md, inference.md, brand.md, testing.md, etc.)
- `steering/` — architecture and schema context loaded at session start
- `hooks/` — pre-task and post-task instructions
- `workflows/` _(landing-page only)_ — automation scripts (brand-audit, supabase-validate, playwright-shots)

Root-level session context files: `review.prompt.md` (code review prompt), `resume.claude.md` (session resume context).

## Pending Setup (manual dashboard steps)

These two actions are required before the multi-schema Supabase setup and `applications/` structure are fully live in production.

### 1. Supabase → expose schemas to PostgREST

> Settings → API → Exposed schemas → add `studio` and `landing`

The default list only includes `public` and `graphql_public`. Without this, app queries to non-`public` schemas return 404 from the REST API.

### 2. Vercel → update Root Directory per project

Each project's build root must be updated:

| Vercel project | Old root       | New root                    |
| -------------- | -------------- | --------------------------- |
| studio         | `studio`       | `applications/studio`       |
| landing-page   | `landing-page` | `applications/landing-page` |
| backoffice     | `backoffice`   | `applications/backoffice`   |

> Project → Settings → General → Root Directory

---

## Company Operations

See `docs/COMPANY-OS.md` for the full operating system (V/TO, Rocks, Scorecard, L10, ADRs, Build vs Buy).

### Key Decisions (ADRs)

Architecture decisions are documented in `docs/COMPANY-OS.md § ADRs`. Major settled decisions:

- HF Spaces over fal.ai (no payment method yet)
- Supabase over Firebase (SSR cookie auth, Postgres, Realtime)
- Zustand over Redux for studio state (minimal boilerplate)
- Tailwind v4 CSS-first (brand tokens via `@theme` in globals.css)

### Scope Control

**Refuse** features not in current quarter Rocks: batch generation, lookbook editor, billing/paywall, Shopify integration, admin dashboard, social sharing, multi-language toggle (studio), A/B testing. See each project's CLAUDE.md for project-specific scope rules.
