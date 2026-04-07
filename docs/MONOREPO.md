# Anaqio Platform — Monorepo Architecture

> Living document. Update when structure changes. Last updated: 2026-04-08.

---

## Overview

The `com.anaqio` repository is a **Bun workspaces monorepo** orchestrated by **Turborepo**. Three Next.js apps and four shared packages are developed, linted, type-checked, and built together from a single git history with a single lockfile.

```
com.anaqio/
├── applications/         # Next.js apps (Bun workspace members)
│   ├── studio/           # AI Virtual Fashion Studio — studio.anaqio.com
│   ├── landing-page/     # Corporate site + waitlist — anaqio.com
│   └── backoffice/       # Internal ops dashboard — backoffice.anaqio.com
├── packages/             # Shared packages (workspace members)
│   ├── @anaqio/supabase  # Supabase client factories
│   ├── @anaqio/utils     # cn() utility
│   ├── @anaqio/tsconfig  # TypeScript preset configs
│   └── @anaqio/eslint-config  # Shared ESLint flat config
├── supabase/             # Consolidated DB migrations + config.toml
│   └── migrations/       # All schema migrations, chronological
├── docs/                 # This file and COMPANY-OS.md, JIRA-SYNC.md
└── [tooling]             # turbo.json, commitlint, lint-staged, husky, prettier
```

---

## Workspace Graph

Turborepo builds the dependency graph from `package.json` `"workspaces"` and task `"dependsOn"` declarations. The dependency flow is strictly one-way:

```
@anaqio/tsconfig
    └── @anaqio/eslint-config  (peerDep)
    └── @anaqio/utils
    └── @anaqio/supabase
            └── applications/studio
            └── applications/landing-page
            └── applications/backoffice
```

Apps depend on packages; packages never depend on apps.

### Turborepo task pipeline

```jsonc
// turbo.json (summary)
build      → dependsOn ["^build"]   // packages built before apps
lint       → dependsOn ["^build"]   // needs compiled package types
type-check → dependsOn ["^build"]   // same
test       → dependsOn ["^build"]
dev        → cache: false, persistent: true
```

`^` prefix means "build my dependencies first." This ensures `@anaqio/supabase` is compiled before `studio` tries to import it.

---

## Shared Packages

### `@anaqio/tsconfig`

Two presets, both private (no publishing):

| Export                    | File          | Extends                     |
| ------------------------- | ------------- | --------------------------- |
| `@anaqio/tsconfig/base`   | `base.json`   | strict TypeScript baseline  |
| `@anaqio/tsconfig/nextjs` | `nextjs.json` | base + Next.js plugin + JSX |

Each app's `tsconfig.json` extends `@anaqio/tsconfig/nextjs` and adds local `paths` (`@/*`).

### `@anaqio/eslint-config`

Two flat-config presets:

| Export                                        | Use case           |
| --------------------------------------------- | ------------------ |
| `@anaqio/eslint-config` (`index.mjs`)         | Generic TypeScript |
| `@anaqio/eslint-config/nextjs` (`nextjs.mjs`) | Next.js apps       |

Peer dependencies (eslint, typescript-eslint, next plugin, react plugins) are installed per-app to allow version flexibility across apps.

### `@anaqio/utils`

| Export             | What                                    |
| ------------------ | --------------------------------------- |
| `@anaqio/utils`    | Re-exports `cn()`                       |
| `@anaqio/utils/cn` | `cn(...inputs)` — clsx + tailwind-merge |

Import as `import { cn } from '@anaqio/utils/cn'` or via each app's `lib/utils/cn.ts` re-export.

### `@anaqio/supabase`

Three factory functions — each wraps the official Supabase SDK with optional `schema` routing:

| Export                    | Factory                         | SDK base                | Use when                                    |
| ------------------------- | ------------------------------- | ----------------------- | ------------------------------------------- |
| `@anaqio/supabase/client` | `createBrowserSupabaseClient()` | `@supabase/ssr` browser | Client components needing real-time or auth |
| `@anaqio/supabase/server` | `createServerSupabaseClient()`  | `@supabase/ssr` server  | SSR cookie auth, Server Components          |
| `@anaqio/supabase/admin`  | `createAdminSupabaseClient()`   | `@supabase/supabase-js` | Service role — bypasses RLS                 |

**All three accept an optional `schema` parameter**, enabling per-app schema targeting without changing the project URL.

Each app wraps these factories in thin `lib/supabase/` files (e.g., `server.ts`, `admin.ts`, `landing.ts`) that inject the correct env vars and schema, so callers never deal with raw SDK imports.

---

## Applications

### `applications/studio/` — AI Virtual Fashion Studio

| Concern         | Detail                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------- |
| URL             | studio.anaqio.com                                                                               |
| Port (dev)      | 3000                                                                                            |
| Supabase schema | `studio`                                                                                        |
| Auth            | Email + Google OAuth, kiosk bypass mode                                                         |
| State           | Zustand stores                                                                                  |
| Inference       | 3-provider router: HF Spaces / fal.ai / Gemini                                                  |
| Realtime        | Supabase Realtime (generation status)                                                           |
| Testing         | Vitest (unit) + Playwright (e2e)                                                                |
| Key env vars    | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Supabase client wiring for studio:

```
lib/supabase/client.ts  → createBrowserSupabaseClient(url, key, { schema: 'studio' })
lib/supabase/server.ts  → createServerSupabaseClient(url, key, cookies, { schema: 'studio' })
lib/supabase/admin.ts   → createAdminSupabaseClient(url, svcKey, { schema: 'studio' })
```

### `applications/landing-page/` — Corporate Site + Waitlist

| Concern         | Detail                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| URL             | anaqio.com                                                                                                               |
| Port (dev)      | 3002 (set via `PORT=3002`)                                                                                               |
| Supabase schema | `landing`                                                                                                                |
| Auth            | SSR session refresh only (no login gate)                                                                                 |
| i18n            | next-intl + Crowdin (FR primary, EN/AR planned) — 14 namespaces                                                          |
| Video           | Remotion compositions                                                                                                    |
| Email           | Brevo (waitlist automation)                                                                                              |
| Design system   | Omnizya free-atom composition (Navy #1B2F52, Gold #D4AF37, Syne + Plus Jakarta Sans)                                     |
| Key env vars    | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `BREVO_API_KEY` |

### `applications/backoffice/` — Internal Operations Dashboard

| Concern          | Detail                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| URL              | backoffice.anaqio.com (TBD)                                                                             |
| Port (dev)       | 3001                                                                                                    |
| Supabase schemas | `landing` (waitlist, campaigns) + `public` (views, events)                                              |
| Auth             | None (internal tool, no login gate currently)                                                           |
| Design           | shadcn/ui new-york style                                                                                |
| Key env vars     | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

Supabase client routing for backoffice (most nuanced):

```
lib/supabase/server.ts   → SSR client (public schema, used only for auth cookies if added later)
lib/supabase/admin.ts    → createAdminSupabaseClient — public.* reads (campaign_signup_stats, events)
lib/supabase/landing.ts  → createAdminSupabaseClient({ schema: 'landing' }) — waitlist, campaigns
```

**Rule:** always pick the client scoped to the target schema. Querying `landing.waitlist` via the default admin client (public schema) returns a 404.

---

## Database Architecture

Single Supabase project: `afspusrgrqpgxqhqfepy` ("platform").

### Schema map

```
public/                     ← default schema; only views + events table
  campaign_signup_stats      view — aggregates landing.campaigns + landing.waitlist_campaign_attribution
  user_overview              view — cross-schema user + generation stats
  generation_stats           view — studio generation counts
  events                     table — marketing events (fashion_show, expo, launch…)

landing/                    ← waitlist + marketing data
  waitlist                   22 cols, RLS enabled. Status: pending → invited → active | unsubscribed
  campaigns                  14 cols, RLS enabled. Types: email, social, influencer, paid, organic…
  waitlist_campaign_attribution  junction table
  contact_submissions
  atelier_invitations

studio/                     ← virtual try-on data
  generations                AI generation jobs
  profiles                   user profiles
  preset_models              model images for try-on
```

### Migration convention

All migrations live in `supabase/migrations/`. Filename format: `YYYYMMDDHHMMSS_<description>.sql`.

```bash
supabase migration new <description>   # creates timestamped file
supabase db reset                      # apply all migrations locally
supabase db push                       # push to remote (after review)
```

Never edit tables directly in the Supabase dashboard. Never write migrations for another team's schema without coordination.

### Required dashboard steps (not yet applied)

Two manual steps are needed before PostgREST serves non-public schemas:

1. **Settings → API → Exposed schemas** — add `studio` and `landing` (default only has `public` + `graphql_public`)
2. **Vercel → Root Directory** — update each project's build root to `applications/<app>`

---

## Common Stack

| Concern     | Tool                       | Notes                                                             |
| ----------- | -------------------------- | ----------------------------------------------------------------- |
| Runtime     | Bun v1.3.10                | Use `bun run` / `bunx`, never `npm` / `npx`                       |
| Framework   | Next.js 16                 | App Router, React 19, React Compiler, Turbopack                   |
| Styling     | Tailwind CSS v4            | CSS-first via `@theme` in `globals.css` — no `tailwind.config.js` |
| Components  | shadcn/ui (new-york)       | `tw-animate-css` not `tailwindcss-animate` (v4 incompatible)      |
| DB/Auth     | Supabase + `@supabase/ssr` | SSR cookie auth; 3-client pattern per app                         |
| Formatting  | Prettier                   | Runs on commit via lint-staged; root `.prettierrc` is canonical   |
| Commits     | Conventional Commits       | Enforced by commitlint + Husky                                    |
| CI          | GitHub Actions             | `ci.yml` on PRs, `main.yml` on merge                              |
| Build cache | Turborepo Remote Cache     | Linked to Vercel (`psycholium` scope)                             |

### React / Next.js rules

- **No `forwardRef`** — React 19 removed it; pass `ref` as a prop.
- **Async request APIs** — `await cookies()`, `await headers()`, `await params`, `await searchParams` (Next.js 16).
- **No `select('*')`** in Supabase queries — always name columns explicitly.
- **No env vars hardcoded** — copy `.env.example` → `.env.local`, never commit `.env*.local`.

---

## Dev Workflow

### First-time setup

```bash
git clone git@github.com:anaqio/platform.git com.anaqio
cd com.anaqio
bun install

# Copy env files for each app you'll run
cp applications/studio/.env.example        applications/studio/.env.local
cp applications/landing-page/.env.example  applications/landing-page/.env.local
cp applications/backoffice/.env.example    applications/backoffice/.env.local
```

### Daily commands

```bash
# Run all apps in parallel (Turbopack + HMR)
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev

# Run a single app
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev --filter=backoffice

# Before pushing
TURBO_TELEMETRY_DISABLED=1 bunx turbo run lint type-check

# Format everything
bun run format

# Full build (packages → apps)
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build
```

> Set `TURBO_TELEMETRY_DISABLED=1` in `~/.exports` to skip the flag everywhere.

### Per-app dev ports

| App          | Port                               |
| ------------ | ---------------------------------- |
| studio       | 3000                               |
| backoffice   | 3001                               |
| landing-page | 3002 (`PORT=3002` in `.env.local`) |

---

## Deployment

Each app deploys independently to Vercel. Merges to `main` trigger automatic deployments.

| App          | Vercel project | Root Directory              |
| ------------ | -------------- | --------------------------- |
| studio       | studio         | `applications/studio`       |
| landing-page | landing-page   | `applications/landing-page` |
| backoffice   | backoffice     | `applications/backoffice`   |

> Root Directory must be updated in each Vercel project's Settings → General. The old paths (`studio/`, `landing-page/`) no longer exist.

---

## Branching & PRs

```
main              Protected. Merges auto-deploy via Vercel.
feat/<ticket>     New features
fix/<ticket>      Bug fixes
chore/<ticket>    Deps, config, CI
refactor/<scope>  Restructuring without behavior change
```

PR checklist (enforced by `ci.yml`):

- `bun run type-check` passes in all affected apps
- `bun run lint` passes
- No `.env` files committed
- No `console.log` in production code
- Migration added for any schema change

---

## Out of Scope (current quarter)

These features are explicitly deferred — refuse them in code review:

- Billing / paywall (Stripe or local)
- Shopify integration
- Public API
- Multi-tenant architecture
- i18n for studio or backoffice
- A/B testing infrastructure
- Batch generation / lookbook editor
- Social sharing flows

See `docs/COMPANY-OS.md` for quarterly Rocks and the full V/TO.
