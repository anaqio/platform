# AGENTS.md

Guidance for AI agents working in this repository.

## Project Overview

**ANAQIO** — Morocco's AI-powered virtual fashion studio. Stack: Next.js 16 (App Router) + React 19 + TypeScript + Framer Motion + Supabase + Brevo + next-intl (i18n).

## Commands

```bash
bun dev              # Dev server at http://localhost:3000
bun run build        # Production build
bun start            # Serve built app
bun run lint         # ESLint
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format with Prettier
bun run format:check # Check formatting (no writes)

# Unit tests (Vitest, files in __spec__/)
bun run test
bun run test -- __spec__/components/ui/button.test.tsx
bun run test:coverage

# E2E tests (Playwright, files in __tests__/*.e2e.test.ts)
bun run test:e2e
bun run test:e2e -- __tests__/performance/landing-page-performance.e2e.test.ts

# AI context indexing
bunx repomix
```

## Environment

Copy `.env.example` → `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`. Never commit secrets.

## Architecture

- `app/` — App Router pages. `[locale]/` for i18n routes, `auth/` for login/signup, `protected/` for authenticated routes.
- `components/sections/` — Landing page sections, dynamically imported for code-splitting.
- `components/ui/` — shadcn/ui (New York style) + custom components.
- `lib/actions/` — Server Actions (`'use server'` + Zod validation).
- `lib/supabase/` — Browser, server, and middleware Supabase clients.
- `lib/content/` — Section text content files.
- `lib/motion.ts` — Animation utilities; all accept `useReducedMotion()` result.
- `hooks/` — Custom React hooks.
- `__spec__/` — Vitest unit tests mirroring source tree.
- `__tests__/` — Playwright E2E tests by category (performance, preservation, waitlist, i18n, analytics).
- `messages/` — i18n namespace JSON files per locale (`en/`, `fr/`, `ar/`).

## i18n (next-intl + Crowdin)

Translations live in `messages/{locale}/{namespace}.json`. 14 namespaces: `common`, `meta`, `landing`, `about`, `waitlist`, `earlyAccess`, `studio`, `startupProfile`, `comingSoon`, `contact`, `auth`, `notFound`, `protected`, `atelierInvitation`.

- Source locale: `en` (English). Target: `fr`, `ar`.
- Use `useTranslations('namespace.subKey')` in client components, `getTranslations()` in server components/RSC.
- `i18n/request.ts` loads all namespace files per locale and nests them under their filename key.
- Crowdin syncs `messages/en/*.json` → `messages/{locale}/*.json` via `crowdin.yml`.
- Never edit `messages/_archive/` — those are legacy monolithic files.

## Code Style

### Files & Naming

- kebab-case filenames (`login-form.tsx`), PascalCase component exports.
- Components in `components/`, hooks prefixed `use-` in `hooks/`, actions in `lib/actions/`.

### Imports (enforced by ESLint)

- Grouped: `builtin` → `external` → `internal` → `parent`/`sibling` → `index` → `type`, separated by blank lines.
- Alphabetized within each group.
- Use `type` imports for type-only: `import type { Foo } from '@/lib/types'`.
- No duplicate imports (`import/no-duplicates`).

### TypeScript

- Strict mode enabled. Prefer `const`. No `var`.
- Unused vars must be prefixed with `_` (e.g., `_unused`).
- `@typescript-eslint/no-explicit-any`: warn (off in test files).
- `eqeqeq: always` (except null checks).
- Use `??` over `||` for nullish coalescing (`prefer-nullish-coalescing`).
- Use optional chaining (`prefer-optional-chain`).

### Formatting (Prettier + EditorConfig)

- Semicolons, single quotes, 2-space indent, trailing commas (`es5`), 80 char width, LF line endings.
- Tailwind classes auto-sorted by `prettier-plugin-tailwindcss`.

### React / Next.js

- Server Components by default; add `'use client'` only when needed.
- Lazy-import heavy components with `dynamic()` + `ssr: false`.
- Framer Motion: check `useReducedMotion()` before animating.
- Images: explicit `width`/`height`, `alt`, `loading="lazy"` (except LCP: `eager` + `fetchpriority="high"`).
- `react/self-closing-comp`: error. `react-hooks/exhaustive-deps`: warn.

### Console & Error Handling

- Only `console.warn` and `console.error` allowed (`no-console` rule).
- Server Actions: use Zod validation, return typed results.
- Never expose or log secrets.

### Git

- Conventional Commits: `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- Husky + lint-staged enforce formatting on commit.
- Run `bun run lint:fix` + `bun run format` before PRs.

## Hard Constraints

- No new npm packages without CTO (Moughamir) approval.
- No Supabase schema changes beyond existing migrations.
- Do not replace Framer Motion with CSS-only animations.
- No auth gate on studio.anaqio.com (kiosk mode is intentional).

## Brand Rules (non-negotiable)

- `--navy` #1B2F52 never lightened. `--gold` #D4AF37 never substituted.
- `--white` is #F8F6F0 — never #FFFFFF.
- Syne for headings only; Plus Jakarta Sans for body. Load via `next/font`.
- Supabase RLS must never be disabled. Brevo trigger must never be removed.
- Pricing always in MAD/DH.

## Performance Targets

- Playwright: FCP < 1.8s, LCP < 2.5s, TBT < 200ms.
- Lighthouse: Performance ≥ 85 mobile / ≥ 92 desktop. CLS < 0.1.
