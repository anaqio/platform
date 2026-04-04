# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

**Anaqio** — AI-powered fashion commerce platform for the Moroccan market. Democratizes professional fashion imagery for Moroccan brands via AI virtual try-on and studio photography. Target: 90% cost reduction vs traditional photoshoots (5,000–20,000 MAD/collection).

This directory is a multi-project workspace (not a monorepo). Each sub-project has its own git repo, dependencies, and deployment pipeline. There is no shared `package.json` or Turborepo config.

**Team:** 2 founders — Amal (Visionary: strategy, brand, partnerships) and Moughamir (Integrator: technical execution, architecture, shipping).

### Projects

| Directory | What | Stack | Deploys to | Git |
|-----------|------|-------|------------|-----|
| `studio/` | AI Virtual Fashion Studio (virtual try-on MVP) | Next.js 16, Supabase, Zustand, Vitest, Playwright | studio.anaqio.com | own repo |
| `landing-page/` | Corporate waitlist + brand site | Next.js 16, Framer Motion, next-intl, Remotion, Supabase | anaqio.com | own repo |
| `ai-studio-base/` | Google AI Studio prototype (exported app) | Vite + React, Gemini API | n/a (local dev) | untracked |
| `backoffice/` | Internal backoffice (CRM, campaigns, dashboard) | Next.js 16, Supabase, Tailwind v4 | backoffice.anaqio.com (TBD) | own repo |
| `tsx-playground/` | Bun + React component playground | Bun, React, TypeScript | n/a (local dev) | untracked |
| `design/` | Design assets (placeholder) | — | — | — |
| `docs/` | Documentation + Company OS | — | — | — |
| `legals/` | Legal documents (placeholder) | — | — | — |

**Always `cd` into the specific sub-project before running commands.** Each project has its own CLAUDE.md with architecture details, commands, and rules — defer to those.

### Dev Ports

| Project | Default port |
|---------|-------------|
| `studio/` | 3000 |
| `backoffice/` | 3001 |
| `landing-page/` | 3002 (set via `PORT=3002` in `.env.local`) |

## Common Stack Across Active Projects

- **Runtime:** Bun (use `bun run`, `bunx` — not `npm`/`npx`)
- **Framework:** Next.js 16 (App Router, React 19, React Compiler enabled, Turbopack default)
- **Styling:** Tailwind CSS v4 (CSS-first config via `globals.css @theme`, no `tailwind.config.js`) + shadcn/ui (new-york style)
- **Database/Auth:** Supabase (`@supabase/ssr` for SSR cookie auth, 3-client pattern: browser/server/admin). Env var is `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (not `PUBLISHABLE_KEY`).
- **Formatting:** Prettier + Husky + lint-staged (auto-runs on commit)
- **Testing:** Vitest (unit) + Playwright (e2e)

## Quick Reference — Per-Project Commands

### studio/

```bash
cd studio
bun run dev           # next dev (Turbopack)
bun run build         # next build
bun run lint          # eslint
bun run type-check    # tsc --noEmit
bun run test          # vitest run
bun run test:e2e      # playwright test
bun run db:types      # regenerate Supabase types
```

### landing-page/

```bash
cd landing-page
bun dev               # next dev
bun run build         # next build
bun run lint          # eslint
bun run test          # vitest
bun run test:e2e      # playwright test
bun run video:dev     # remotion studio (video compositions)
bun run audit         # full brand/performance/supabase audit
```

### backoffice/

```bash
cd backoffice
bun dev           # next dev on port 3001
bun run build
bun run lint
bun run type-check
```

### ai-studio-base/

```bash
cd ai-studio-base
npm install && npm run dev   # Vite dev server on :3000
```

Requires `GEMINI_API_KEY` in `.env.local`.

## Cross-Project Conventions

- **Supabase client separation is strict:** browser client (`lib/supabase/client.ts`), server client (`lib/supabase/server.ts`), admin/service-role client (`lib/supabase/admin.ts`). Never inline `createClient()`. Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- **No `forwardRef`** — React 19 removed it; use ref-as-prop.
- **Async request APIs** — Next.js 16: `await cookies()`, `await headers()`, `await params`, `await searchParams`.
- **`tw-animate-css`** not `tailwindcss-animate` — the latter is incompatible with Tailwind v4.
- **`cn()` utility** lives at `lib/utils/cn.ts` (clsx + tailwind-merge) in each project.
- **Conventional Commits:** `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:` with optional scope (e.g., `feat(studio): ...`).
- **No `select('*')`** in Supabase queries — always name columns explicitly.
- **Env vars never hardcoded** — copy `.env.example` → `.env.local`, never commit `.env*.local`.

## Key Architectural Differences

| Concern | studio/ | landing-page/ | backoffice/ |
|---------|---------|---------------|-------------|
| State management | Zustand stores | Framer Motion + React state | React state + server components |
| Auth | Supabase email + Google OAuth, kiosk mode bypass | Supabase SSR session refresh | Supabase SSR (read-only, no public auth) |
| i18n | None | next-intl + Crowdin (FR primary, EN, AR planned) — 14 namespaces | None |
| Email | None | Brevo (waitlist automation) | None |
| Video | None | Remotion compositions | None |
| Inference | 3 providers (HF Spaces, fal.ai, Gemini) via `lib/inference/` router | None | None |
| Realtime | Supabase Realtime (generation status) | None | None |
| Vercel config | `vercel.json` (300s maxDuration on `/api/generate`) | Security headers in `next.config.ts` | — |
| Design system | shadcn/ui defaults | Omnizya free-atom composition (see AGENTS.md) | shadcn/ui defaults |
| Fonts | System/shadcn defaults | Syne (display) + Plus Jakarta Sans (body) | System/shadcn defaults |
| Brand colors | Standard shadcn theming | Navy #1B2F52, Blue #2C5F8A, Gold #D4AF37 (strict) | Standard shadcn theming |

## AI Agent Context

Both `studio/` and `landing-page/` have `.agents/` directories consumed by AI agents (Claude, Gemini, Qwen):

- `skills/` — domain context files (supabase.md, inference.md, brand.md, testing.md, etc.)
- `steering/` — architecture and schema context loaded at session start
- `hooks/` — pre-task and post-task instructions
- `workflows/` *(landing-page only)* — automation scripts (brand-audit, supabase-validate, playwright-shots)

Root-level session context files: `review.prompt.md` (code review prompt), `resume.claude.md` (session resume context).

## Company Operations

See `docs/COMPANY-OS.md` for the full operating system (V/TO, Rocks, Scorecard, L10, ADRs, Build vs Buy).

### Current Quarter (Q1 2026 — ends Mar 31)

- **Expo deadline: March 28, 2026** — feature freeze, bug fixes and polish only after that date
- Studio MVP must be feature-complete (upload → generate → download)
- Landing page live at anaqio.com with waitlist capture + Brevo automation
- Kiosk mode working at 1920×1080 landscape for expo demo

### Key Decisions (ADRs)

Architecture decisions are documented in `docs/COMPANY-OS.md § ADRs`. Major settled decisions:
- HF Spaces over fal.ai (no payment method yet)
- Supabase over Firebase (SSR cookie auth, Postgres, Realtime)
- Zustand over Redux for studio state (minimal boilerplate)
- Tailwind v4 CSS-first (brand tokens via `@theme` in globals.css)

### Scope Control

**Refuse** features not in current quarter Rocks: batch generation, lookbook editor, billing/paywall, Shopify integration, admin dashboard, social sharing, multi-language toggle (studio), A/B testing. See each project's CLAUDE.md for project-specific scope rules.
