# AGENTS.md

Guidance for AI agents working in this monorepo.

## Project Structure

Bun workspaces monorepo with 3 Next.js apps under `applications/` and shared packages under `packages/`.

| App          | Path                         | Port | Stack                                             |
| ------------ | ---------------------------- | ---- | ------------------------------------------------- |
| studio       | `applications/studio/`       | 3000 | Next.js 16, Supabase, Zustand, Vitest, Playwright |
| landing-page | `applications/landing-page/` | 3002 | Next.js 16, Framer Motion, next-intl, Remotion    |
| backoffice   | `applications/backoffice/`   | 3001 | Next.js 16, Supabase, Tailwind v4                 |

## Commands

### Workspace (root)

```bash
# Run all apps in parallel
bun run dev              # turbo run dev
bun run build           # turbo run build
bun run lint            # turbo run lint
bun run type-check     # turbo run type-check
bun run test           # turbo run test
bun run format         # prettier --write .
bun run format:check  # prettier --check .
```

### applications/studio/

```bash
cd applications/studio
bun run dev              # next dev (Turbopack)
bun run build           # next build
bun run lint            # eslint
bun run type-check     # tsc --noEmit
bun run test           # vitest run
bun run test:watch     # vitest (watch mode)
bun run test -- path/to/file.test.ts  # single test file
bun run test:coverage # vitest --coverage
bun run test:e2e       # playwright test
bun run test:e2e -- path/to/spec.spec.ts  # single e2e spec
bun run db:types       # supabase gen types → types/supabase.ts
bun run db:push       # supabase db push
bun run db:reset     # supabase db reset
bun run clean        # rm -rf .next
```

### applications/landing-page/

```bash
cd applications/landing-page
bun run dev
bun run build
bun run lint
bun run lint:fix        # eslint --fix
bun run type-check
bun run test           # vitest
bun run test -- path/to/file.test.ts
bun run test:coverage  # vitest run --coverage
bun run test:e2e      # playwright
bun run test:e2e -- path/to/spec.spec.ts
bun run format        # prettier --write .
bun run format:check
bun run video:dev    # remotion studio
bun run clean
```

### applications/backoffice/

```bash
cd applications/backoffice
bun run dev           # next dev --turbopack -p 3001
bun run build
bun run lint
bun run type-check
bun run clean
```

## Environment

Each app requires `.env.local`. Copy from `.env.example`:

- **studio:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HF_SPACE_URL`, `HF_API_TOKEN`, `GOOGLE_AI_API_KEY`, `FAL_KEY`
- **landing-page:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **backoffice:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

Never commit secrets.

## Shared Packages

| Package                 | Path                      | Export             |
| ----------------------- | ------------------------- | ------------------ |
| `@anaqio/tsconfig`      | `packages/tsconfig/`      | TypeScript presets |
| `@anaqio/eslint-config` | `packages/eslint-config/` | ESLint flat config |
| `@anaqio/utils`         | `packages/utils/`         | `cn()` utility     |
| `@anaqio/supabase`      | `packages/supabase/`      | Client factories   |

## Code Style

### Files & Naming

- kebab-case: `login-form.tsx`, `use-auth.ts`
- PascalCase: component exports, type exports
- Hooks: `use-*` prefix in `hooks/` directory
- Server Actions: `*-action.ts` in `lib/actions/`

### Imports (ESLint enforced)

Order groups separated by blank lines:

1. Built-in (`path`, `fs`, `crypto`)
2. External (`@/*`, `next/*`, `react`, `supabase`)
3. Internal packages (`@anaqio/*`)
4. Parent/sibling (`../`, `./`)
5. Index (`./index` or `./`)
6. Types (`import type`)

Alphabetized within groups. Use `import type` for type-only.

### TypeScript

- Strict mode enabled
- Prefer `const`, never `var`
- Unused vars: prefix with `_` (e.g., `_unused`)
- No `any` (warn rule, off in test files)
- Use `??` over `||` (prefer-nullish-coalescing)
- Use optional chaining (`?.`)
- Use `eqeqeq` (strict equality)

### Formatting (Prettier)

- Semicolons, single quotes, 2-space indent
- Trailing commas (es5), 80 char width, LF endings
- Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`

### React / Next.js

- Server Components by default; add `'use client'` only when needed
- No `forwardRef` (React 19 uses ref-as-prop)
- Lazy-import heavy components: `dynamic(() => ..., { ssr: false })`
- Images: explicit `width`/`height`, `alt`, `loading="lazy"` (except LCP: `eager`)
- Self-closing components required

### State Management

- **studio:** Zustand stores (`lib/stores/`)
- **landing-page:** Framer Motion + React state
- **backoffice:** React state + server components

### Supabase

- Browser client: `lib/supabase/client.ts` — uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Server client: `lib/supabase/server.ts` — uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` + cookie forwarding
- Admin client: `lib/supabase/admin.ts` — uses `SUPABASE_SERVICE_ROLE_KEY` (server-only)
- Never inline `createClient()`
- Never `select('*')` — always name columns explicitly
- RLS must never be disabled

### Console & Error Handling

- `console.warn` and `console.error` only (no `console.log`)
- Supabase errors: `throw new Error(\`[table.operation] ${error.message}\`)`
- Server Actions: use Zod validation, return typed results
- Never expose or log secrets

### Git

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`, `db:`
- Scope format: `feat(studio):`, `fix(landing-page):`
- Husky + lint-staged run on commit
- Run `bun run lint` + `bun run format` before PRs

## App-Specific Architecture

### studio/

```
lib/
├── supabase/       # client.ts, server.ts, admin.ts
├── inference/      # hf-spaces.ts, fal.ts, gemini.ts (router)
└── stores/        # Zustand stores
api/
├── upload/         # garment upload to Storage
└── generate/       # inference + Realtime status
```

### landing-page/

```
app/[locale]/          # i18n routes
components/sections/   # dynamically imported
components/ui/         # shadcn/ui + custom
lib/actions/           # Server Actions
lib/supabase/          # 3-client pattern
messages/{locale}/     # next-intl JSON files
__spec__/              # Vitest tests
__tests__/             # Playwright E2E
```

### backoffice/

```
lib/data/           # waitlist.ts, campaigns.ts (server fetching)
app/(app)/         # Dashboard, CRM, Campaigns, Settings
types/             # database.ts (manual types)
```

## Brand Rules (non-negotiable)

- Navy: `#1B2F52` never lightened
- Blue: `#2C5F8A`
- Gold: `#D4AF37` never substituted
- White: `#F8F6F0` (not `#FFFFFF`)
- Fonts: Syne (headings), Plus Jakarta Sans (body)
- Pricing: always in MAD/DH

## Constraints

### Refuse (not in scope)

- Batch generation · lookbook editor · billing/paywall
- Shopify integration · admin dashboard (studio)
- Social sharing · A/B testing
- Multi-language toggle (studio)
- Custom model UI (studio)

### Approvals Required

- New npm packages → CTO approval
- Supabase schema changes → existing migrations only

## Testing

### Vitest (unit)

- Studio: `__tests__/` or `*.test.ts` files
- Landing-page: `__spec__/` directory mirroring source

### Playwright (e2e)

- Studio: `e2e/*.spec.ts`
- Landing-page: `__tests__/*.e2e.test.ts`

### Performance Targets

- FCP < 1.8s, LCP < 2.5s, TBT < 200ms
- Lighthouse: Performance ≥ 85 mobile / ≥ 92 desktop

## Hard Constraints (Absolute)

| Rule | Description                                                         |
| ---- | ------------------------------------------------------------------- |
| R-01 | Never `createClient()` inline — use factory from `@anaqio/supabase` |
| R-02 | Never expose `SUPABASE_SERVICE_ROLE_KEY` to client                  |
| R-03 | Never `select('*')` — name columns explicitly                       |
| R-04 | Never disable RLS                                                   |
| R-05 | Never use `tailwindcss-animate` — use `tw-animate-css`              |
| R-06 | Never use `forwardRef` — React 19 ref-as-prop                       |
| R-07 | Never hardcode env vars — use `.env.local`                          |
| R-08 | Never commit secrets                                                |

## Skill Files

Load on demand for domain context:

| Task           | File                           |
| -------------- | ------------------------------ |
| Database/RLS   | `.agents/skills/supabase.md`   |
| Next.js/RSC    | `.agents/skills/nextjs.md`     |
| Inference      | `.agents/skills/inference.md`  |
| Components     | `.agents/skills/components.md` |
| Realtime       | `.agents/skills/realtime.md`   |
| Brand/Tailwind | `.agents/skills/brand.md`      |
| Testing        | `.agents/skills/testing.md`    |

See `.agents/steering/schema.md` for database schema.
