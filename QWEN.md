# Anaqio Platform — QWEN Context

> AI-powered fashion commerce for the Moroccan market. Democratizes professional fashion imagery via AI virtual try-on and studio photography — targeting a 90% cost reduction vs traditional photoshoots.

## Project Overview

This is a **Bun workspaces monorepo** orchestrated by **Turborepo**, containing three Next.js 16 applications and four shared packages. All apps share tooling configs, utility packages, and a single Supabase database project with multi-schema isolation.

**Team:** 2 founders — Amal (Visionary: strategy, brand, partnerships) and Moughamir (Integrator: technical execution, architecture, shipping).

### Monorepo Structure

```
com.anaqio/
├── applications/
│   ├── studio/          # AI Virtual Fashion Studio  →  studio.anaqio.com
│   ├── landing-page/    # Brand site + waitlist      →  anaqio.com
│   └── backoffice/      # Internal CRM + dashboard   →  backoffice.anaqio.com
├── packages/
│   ├── @anaqio/ui          # Shared UI components (shadcn/ui New York style)
│   ├── @anaqio/schemas     # Shared Zod validation schemas
│   ├── @anaqio/supabase    # Supabase client factories (browser / server / admin)
│   ├── @anaqio/utils       # cn() utility (clsx + tailwind-merge)
│   ├── @anaqio/tsconfig    # Shared TypeScript config presets
│   └── @anaqio/eslint-config  # Shared ESLint flat config
├── supabase/            # Consolidated DB migrations + config
├── docs/                # Company OS, ADRs, strategy docs
├── ai-studio-base/      # Google AI Studio prototype (untracked)
├── tsx-playground/      # Component playground (untracked)
├── design/              # Design assets
└── legals/              # Legal documents
```

**Runtime:** Bun · **Orchestration:** Turborepo · **Framework:** Next.js 16 (App Router) · **Database:** Supabase (single project, multi-schema)

---

## Building and Running

### Quick Start

```bash
# Install all workspace dependencies
bun install

# Run all apps in parallel
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev

# Or run a single app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev --filter=studio
```

### Default Ports

| App          | Port |
| ------------ | ---- |
| studio       | 3000 |
| backoffice   | 3001 |
| landing-page | 3002 |

### Workspace Commands

```bash
# Quality checks across all apps
TURBO_TELEMETRY_DISABLED=1 bunx turbo run lint
TURBO_TELEMETRY_DISABLED=1 bunx turbo run type-check
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build
TURBO_TELEMETRY_DISABLED=1 bunx turbo run test

# Filter to one app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build --filter=studio

# Format everything
bun run format

# Full clean
bun run clean
```

### Per-App Commands

**studio:**

```bash
cd applications/studio
bun run dev           # next dev (Turbopack)
bun run build         # next build
bun run lint          # eslint
bun run type-check    # tsc --noEmit
bun run test          # vitest run
bun run test:e2e      # playwright test
bun run db:types      # regenerate Supabase types
bun run clean         # rm -rf .next
```

**landing-page:**

```bash
cd applications/landing-page
bun run dev           # next dev
bun run build         # next build
bun run lint          # eslint
bun run test          # vitest
bun run test:e2e      # playwright test
bun run video:dev     # remotion studio
bun run audit         # full brand/performance/supabase audit
```

**backoffice:**

```bash
cd applications/backoffice
bun run dev           # next dev --turbopack -p 3001
bun run build
bun run lint
bun run type-check
bun run clean
```

---

## Environment Setup

Each app has a `.env.example` — copy to `.env.local` and fill in secrets.

### studio

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
HF_SPACE_URL
HF_API_TOKEN
GOOGLE_AI_API_KEY
FAL_KEY
```

### landing-page

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://anaqio.com
BREVO_API_KEY
BREVO_LIST_ID
```

### backoffice

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://backoffice.anaqio.com
```

> **Never commit secrets.** `.env*.local` files are gitignored.

---

## Tech Stack

| Concern    | Tool                             | Notes                                                             |
| ---------- | -------------------------------- | ----------------------------------------------------------------- |
| Runtime    | Bun v1.3.10+                     | Use `bun run` / `bunx` — never `npm`/`npx`                        |
| Framework  | Next.js 16                       | App Router, React 19, React Compiler, Turbopack                   |
| Styling    | Tailwind CSS v4                  | CSS-first via `@theme` in `globals.css` — no `tailwind.config.js` |
| Components | shadcn/ui (new-york)             | `tw-animate-css` not `tailwindcss-animate`                        |
| DB/Auth    | Supabase + `@supabase/ssr`       | SSR cookie auth; 3-client pattern                                 |
| Formatting | Prettier                         | Runs on commit via lint-staged                                    |
| Commits    | Conventional Commits             | Enforced by commitlint + Husky                                    |
| CI         | GitHub Actions                   | `ci.yml` on PRs, `main.yml` on merge                              |
| Testing    | Vitest (unit) + Playwright (e2e) | Per-app test directories                                          |

---

## Database Architecture

Single Supabase project with isolated schemas:

| Schema    | Owned by     | Key tables                                     |
| --------- | ------------ | ---------------------------------------------- |
| `studio`  | studio app   | `profiles`, `preset_models`, `generations`     |
| `landing` | landing-page | `waitlist`, `campaigns`, `contact_submissions` |
| `public`  | shared       | Cross-schema views for backoffice              |

### Supabase Client Pattern

Three factory functions in `@anaqio/supabase`:

| Export                    | Factory                         | Use when                           |
| ------------------------- | ------------------------------- | ---------------------------------- |
| `@anaqio/supabase/client` | `createBrowserSupabaseClient()` | Client components, real-time, auth |
| `@anaqio/supabase/server` | `createServerSupabaseClient()`  | SSR cookie auth, Server Components |
| `@anaqio/supabase/admin`  | `createAdminSupabaseClient()`   | Service role — bypasses RLS        |

Each app wraps these in thin `lib/supabase/` files that inject correct env vars and schema.

### Migration Convention

All migrations live in `supabase/migrations/`. Filename format: `YYYYMMDDHHMMSS_<description>.sql`.

```bash
supabase migration new <description>   # creates timestamped file
supabase db reset                      # apply all locally
supabase db push                       # push to remote (after review)
```

---

## Hard Constraints (Absolute Rules)

| Rule | Description                                                         |
| ---- | ------------------------------------------------------------------- |
| R-01 | Never `createClient()` inline — use factory from `@anaqio/supabase` |
| R-02 | Never expose `SUPABASE_SERVICE_ROLE_KEY` to client                  |
| R-03 | Never `select('*')` in Supabase queries — name columns explicitly   |
| R-04 | Never disable RLS                                                   |
| R-05 | Never use `tailwindcss-animate` — use `tw-animate-css`              |
| R-06 | Never use `forwardRef` — React 19 ref-as-prop                       |
| R-07 | Never hardcode env vars — use `.env.local`                          |
| R-08 | Never commit secrets                                                |

---

## Code Style

### Files & Naming

- **kebab-case:** `login-form.tsx`, `use-auth.ts`
- **PascalCase:** component exports, type exports
- **Hooks:** `use-*` prefix in `hooks/` directory
- **Server Actions:** `*-action.ts` in `lib/actions/`

### Imports (ESLint enforced order)

1. Built-in (`path`, `fs`, `crypto`)
2. External (`@/*`, `next/*`, `react`, `supabase`)
3. Internal packages (`@anaqio/*`)
4. Parent/sibling (`../`, `./`)
5. Index (`./index` or `./`)
6. Types (`import type`)

### TypeScript

- Strict mode enabled
- Prefer `const`, never `var`
- Unused vars: prefix with `_`
- No `any` (warn rule, off in test files)
- Use `??` over `||` (nullish coalescing)
- Use optional chaining (`?.`)
- Use `eqeqeq` (strict equality)

### Formatting (Prettier)

- No semicolons, single quotes, 2-space indent
- Trailing commas (es5), 100 char width, LF endings
- Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`

### React / Next.js

- Server Components by default; add `'use client'` only when needed
- No `forwardRef` (React 19 uses ref-as-prop)
- Lazy-import heavy components: `dynamic(() => ..., { ssr: false })`
- Images: explicit `width`/`height`, `alt`, `loading="lazy"`
- Async request APIs: `await cookies()`, `await headers()`, `await params`, `await searchParams`

### Console & Error Handling

- `console.warn` and `console.error` only (no `console.log`)
- Supabase errors: `throw new Error(\`[table.operation] ${error.message}\`)`
- Server Actions: use Zod validation, return typed results
- Never expose or log secrets

---

## Git Workflow

### Branching

```
main              Production-ready. Protected. Merges deploy automatically.
feat/<ticket>     New features
fix/<ticket>      Bug fixes
chore/<ticket>    Dependency updates, config changes, CI
refactor/<scope>  Code restructuring without behavior change
```

### Commit Messages (Conventional Commits)

```
feat(studio): add batch generation support
fix(auth): handle expired refresh token
chore(deps): update @supabase/ssr to 0.10.0
db(migration): add landing.atelier_invitations table
docs: update CONTRIBUTING with new dev port
```

### PR Checklist

- [ ] `bun run type-check` passes in all affected apps
- [ ] `bun run lint` passes
- [ ] No `.env` files committed
- [ ] No `console.log` left in production code
- [ ] Migration added for any schema change
- [ ] PR description explains the **why**, not just the **what**

---

## Brand Rules (Non-Negotiable)

- **Navy:** `#1B2F52` — never lightened
- **Blue:** `#2C5F8A`
- **Gold:** `#D4AF37` — never substituted
- **White:** `#F8F6F0` (not `#FFFFFF`)
- **Fonts:** Syne (headings), Plus Jakarta Sans (body)
- **Pricing:** always in MAD/DH

---

## Out of Scope (Current Quarter)

Refuse these features in code review:

- Batch generation · lookbook editor · billing/paywall
- Shopify integration · admin dashboard (studio)
- Social sharing · A/B testing
- Multi-language toggle (studio)
- Custom model UI (studio)

---

## Key Architectural Differences

| Concern          | studio                                  | landing-page                     | backoffice                      |
| ---------------- | --------------------------------------- | -------------------------------- | ------------------------------- |
| State management | Zustand stores                          | Framer Motion + React state      | React state + server components |
| Auth             | Supabase email + Google OAuth           | SSR session refresh              | None (internal tool)            |
| i18n             | None                                    | next-intl + Crowdin (FR primary) | None                            |
| Email            | None                                    | Brevo (waitlist automation)      | None                            |
| Video            | None                                    | Remotion compositions            | None                            |
| Inference        | 3 providers (HF Spaces, fal.ai, Gemini) | None                             | None                            |
| Realtime         | Supabase Realtime (generation status)   | None                             | None                            |
| Design system    | shadcn/ui defaults                      | Omnizya free-atom composition    | shadcn/ui defaults              |
| Brand colors     | Standard shadcn theming                 | Navy/Blue/Gold (strict)          | Standard shadcn theming         |

---

## AI Agent Context

Both `studio` and `landing-page` have `.agents/` directories with:

- `skills/` — domain context files (supabase, inference, brand, testing)
- `steering/` — architecture and schema context
- `hooks/` — pre-task and post-task instructions
- `workflows/` — automation scripts (landing-page only)

Load skill files on demand for domain context:
| Task | File |
|------|------|
| Database/RLS | `.agents/skills/supabase.md` |
| Next.js/RSC | `.agents/skills/nextjs.md` |
| Inference | `.agents/skills/inference.md` |
| Components | `.agents/skills/components.md` |
| Realtime | `.agents/skills/realtime.md` |
| Brand/Tailwind | `.agents/skills/brand.md` |
| Testing | `.agents/skills/testing.md` |

---

## Deployment

Each app deploys independently to Vercel. Merges to `main` trigger automatic deployments.

| App          | Vercel project | Root Directory              |
| ------------ | -------------- | --------------------------- |
| studio       | studio         | `applications/studio`       |
| landing-page | landing-page   | `applications/landing-page` |
| backoffice   | backoffice     | `applications/backoffice`   |

### Studio Function Timeout

The AI generation endpoint requires 300s maxDuration. `applications/studio/vercel.json` sets this — verify it remains committed after any restructuring.

---

## Company Operations

See `docs/COMPANY-OS.md` for the full operating system (V/TO, Rocks, Scorecard, L10, ADRs, Build vs Buy).

### Key Decisions (ADRs)

- HF Spaces over fal.ai (no payment method yet)
- Supabase over Firebase (SSR cookie auth, Postgres, Realtime)
- Zustand over Redux for studio state (minimal boilerplate)
- Tailwind v4 CSS-first (brand tokens via `@theme` in globals.css)
