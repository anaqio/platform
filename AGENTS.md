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
bun run dev           # turbo run dev (all apps in parallel)
bun run build        # turbo run build
bun run lint         # turbo run lint
bun run type-check   # turbo run type-check
bun run test         # turbo run test
bun run format       # prettier --write .
bun run format:check # prettier --check .
```

### applications/studio/

```bash
bun run dev              # next dev (Turbopack)
bun run build           # next build
bun run lint            # eslint
bun run type-check     # tsc --noEmit
bun run test           # vitest run
bun run test:watch     # vitest (watch mode)
bun run test -- __tests__/file.test.ts  # single test
bun run test:coverage # vitest --coverage
bun run test:e2e       # playwright test
bun run test:e2e -- e2e/spec.spec.ts    # single e2e
bun run db:types       # supabase gen types
bun run db:push       # supabase db push
bun run db:reset     # supabase db reset
bun run clean        # rm -rf .next
```

### applications/landing-page/

```bash
bun run dev
bun run build
bun run lint
bun run lint:fix
bun run type-check
bun run test           # vitest
bun run test -- __spec__/file.test.ts   # single test
bun run test:coverage  # vitest run --coverage
bun run test:e2e      # playwright
bun run test:e2e -- __tests__/file.e2e.test.ts  # single e2e
bun run format
bun run format:check
bun run video:dev    # remotion studio
bun run clean
```

### applications/backoffice/

```bash
bun run dev           # next dev --turbopack -p 3001
bun run build
bun run lint
bun run type-check
bun run clean
```

## Environment

Each app requires `.env.local` (copy from `.env.example`). Never commit secrets.

- **studio:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `HF_SPACE_URL`, `HF_API_TOKEN`, `GOOGLE_AI_API_KEY`, `FAL_KEY`
- **landing-page:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **backoffice:** `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

## Shared Packages

| Package                 | Path                      | Export             |
| ----------------------- | ------------------------- | ------------------ |
| `@anaqio/ui`            | `packages/ui/`            | Shared UI components|
| `@anaqio/schemas`       | `packages/schemas/`       | Shared Zod schemas |
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

- No semicolons, single quotes, 2-space indent
- Trailing commas (es5), 100 char width, LF endings
- Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`

### React / Next.js

- Server Components by default; add `'use client'` only when needed
- No `forwardRef` (React 19 uses ref-as-prop)
- Lazy-import heavy components: `dynamic(() => ..., { ssr: false })`
- Images: explicit `width`/`height`, `alt`, `loading="lazy"` (except LCP: `eager`)

### Supabase

- Browser: `lib/supabase/client.ts` (publishable key)
- Server: `lib/supabase/server.ts` (publishable key + cookie forwarding)
- Admin: `lib/supabase/admin.ts` (service role key, server-only)
- Never inline `createClient()` — use factory from `@anaqio/supabase`
- Never `select('*')` — name columns explicitly
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

## Brand Rules (non-negotiable)

- Navy: `#1B2F52` never lightened
- Blue: `#2C5F8A`
- Gold: `#D4AF37` never substituted
- White: `#F8F6F0` (not `#FFFFFF`)
- Fonts: Syne (headings), Plus Jakarta Sans (body)
- Pricing: always in MAD/DH

## Testing

- **Vitest:** Studio (`__tests__/` or `*.test.ts`), Landing-page (`__spec__/`)
- **Playwright:** Studio (`e2e/*.spec.ts`), Landing-page (`__tests__/*.e2e.test.ts`)
- Performance targets: FCP < 1.8s, LCP < 2.5s, TBT < 200ms

## Skill Files

Load on demand: `.agents/skills/supabase.md`, `.agents/skills/nextjs.md`, `.agents/skills/inference.md`, `.agents/skills/components.md`, `.agents/skills/realtime.md`, `.agents/skills/brand.md`, `.agents/skills/testing.md`
