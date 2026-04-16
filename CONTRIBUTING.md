# Contributing to Anaqio Platform

This is a private monorepo. These guidelines are for the Anaqio core team.

## Prerequisites

- [Bun](https://bun.sh) v1.3.10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) for local DB work
- Access to the `anaqio/platform` GitHub repo

## Setup

```bash
git clone git@github.com:anaqio/platform.git com.anaqio
cd com.anaqio
bun install
```

Copy `.env.example` → `.env.local` in each app you're working on:

```bash
cp applications/studio/.env.example applications/studio/.env.local
cp applications/landing-page/.env.example applications/landing-page/.env.local
cp applications/backoffice/.env.example applications/backoffice/.env.local
```

## Branching

```
main              Production-ready. Protected. Merges deploy automatically via Vercel.
feat/<ticket>     New features
fix/<ticket>      Bug fixes
chore/<ticket>    Dependency updates, config changes, CI
refactor/<scope>  Code restructuring without behavior change
```

Create branches from `main`. Open PRs against `main`.

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(studio): add batch generation support
fix(auth): handle expired refresh token
chore(deps): update @supabase/ssr to 0.10.0
db(migration): add landing.atelier_invitations table
docs: update CONTRIBUTING with new dev port
```

Scope is optional but recommended. Commitlint enforces the format on commit.

## Development Workflow

```bash
# Start all apps (or filter with --filter=studio)
TURBO_TELEMETRY_DISABLED=1 bunx turbo run dev

# Before pushing:
TURBO_TELEMETRY_DISABLED=1 bunx turbo run lint type-check
```

Prettier runs automatically on commit via lint-staged. You don't need to format manually.

## Database Changes

All schema changes must go through `supabase/migrations/`. Never edit tables directly in the dashboard.

```bash
# Create a new migration
supabase migration new <description>

# Apply locally
supabase db reset

# Push to remote (after review)
supabase db push
```

Migration filename format: `YYYYMMDDHHMMSS_<description>.sql`

Schema ownership:

- `studio.*` tables → only touch if working on studio features
- `landing.*` tables → only touch if working on landing-page/backoffice features
- `public.*` views → update when cross-schema queries change

## Shared Packages

Changes to `packages/` affect all apps — test all three before merging:

```bash
TURBO_TELEMETRY_DISABLED=1 bunx turbo run build type-check
```

## Pull Request Checklist

- [ ] `bun run type-check` passes in all affected apps
- [ ] `bun run lint` passes
- [ ] No `.env` files committed
- [ ] No `console.log` left in production code
- [ ] Migration added for any schema change
- [ ] PR description explains the **why**, not just the **what**

## App-Specific Guides

Each app has its own `CLAUDE.md` with architecture details, absolute rules, and scope constraints. Read it before making changes to that app.

| App          | Guide                                 |
| ------------ | ------------------------------------- |
| studio       | `applications/studio/CLAUDE.md`       |
| landing-page | `applications/landing-page/CLAUDE.md` |
| backoffice   | `applications/backoffice/CLAUDE.md`   |
