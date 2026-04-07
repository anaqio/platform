# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ANAQIO** is a high-end AI fashion studio platform for the Moroccan market. It enables fashion brands to upload assets, adjust lighting, swap backgrounds, and generate AI-powered lookbooks and automated luxury fashion videos.

## Commands

```bash
bun dev              # Start local dev server at http://localhost:3000
bun run build        # Production build
bun start            # Serve built app
bun run lint         # Run ESLint
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format all files with Prettier
bun run format:check # Check formatting without writing
bun run test         # Run Vitest unit tests (components, hooks, lib)
bun run test:e2e     # Run Playwright E2E tests (builds app first)
bun run test:coverage # Vitest with coverage report

# Run a single unit test file:
bun run test -- __spec__/components/ui/button.test.tsx

# Run a single E2E test file:
bun run test:e2e -- __tests__/performance/landing-page-performance.e2e.test.ts
```

## Environment Setup

Copy `.env.example` → `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Architecture

**Framework:** Next.js (App Router) + React 19 + TypeScript, with Supabase for auth/DB.

### Key Directories

- `app/` — App Router pages. `app/auth/` for auth routes, `app/protected/` for authenticated routes, `app/playground/` for development/demos.
- `components/sections/` — Landing page sections (Hero, Waitlist, Solution, etc.) loaded via dynamic imports for code-splitting.
- `components/ui/` — shadcn/ui components (New York style) + custom components (`AnaqioLogo`, `AbstractBackground`, `PerspectiveGrid`).
- `lib/actions/` — Server Actions (use `'use server'` + Zod validation). Example: `waitlist.ts`.
- `lib/supabase/` — Supabase clients: `client.ts` (browser), `server.ts` (RSC), `middleware.ts` (session refresh).
- `hooks/` — Custom React hooks (e.g., `use-multi-step-form.ts`).
- `__tests__/` — Playwright E2E tests (`*.e2e.test.ts`) organized by category: `analytics/`, `i18n/`, `performance/`, `preservation/`, `waitlist/`.
- `__spec__/` — Vitest unit tests mirroring source tree: `components/`, `hooks/`, `lib/`, `integration/`.
- `supabase/migrations/` — SQL migrations with timestamped filenames.
- `remotion/` — Video composition components integrated via `@remotion/player`.
- `docs/` — Project docs and feature plans.

### Data Flow

- **Forms** → Server Actions with Zod validation → Supabase DB
- **Auth** → Supabase SSR with cookie-based session; middleware refreshes sessions on every request and redirects unauthenticated users from `/protected/*`
- **Landing page sections** → dynamically imported with SSR for code-splitting performance

### Design System

- **Colors:** 60-30-10 rule — `dominant` (60%, backgrounds), `secondary` (30%, section surfaces), `accent` (10%, CTAs). Brand colors: `aq-blue`, `aq-purple`. See `docs/colors-60-30-10.md`.
- **Typography:** Cormorant (display/editorial), DM Sans (UI/body), Instrument Serif (editorial accents).
- **Pricing:** Always display in **MAD/DH** (Moroccan market).
- Tailwind CSS + shadcn/ui with CSS variable theming. Classes sorted via Prettier Tailwind plugin.

### Performance Targets

Playwright performance tests enforce: FCP < 1.8s, LCP < 2.5s, TBT < 200ms.

## Coding Conventions

- **Files:** kebab-case (`login-form.tsx`); component exports in PascalCase.
- **Imports:** grouped and alphabetized (enforced by ESLint `import` plugin).
- **Console:** only `console.warn` and `console.error` allowed.
- **Database schema changes** must be documented in `supabase/migrations/` with a timestamped filename.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- Husky + lint-staged enforce formatting on commit; run `bun run lint:fix` and `bun run format` before opening a PR.
