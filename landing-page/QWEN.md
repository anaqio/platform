# QWEN.md — ANAQIO Project Context

**ANAQIO** is a high-end AI fashion studio platform for the Moroccan market. It enables fashion brands to upload assets, adjust lighting, swap backgrounds, and generate AI-powered lookbooks and automated luxury fashion videos.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Building and Running](#building-and-running)
- [Environment Setup](#environment-setup)
- [Coding Conventions](#coding-conventions)
- [Design System](#design-system)
- [Testing Guidelines](#testing-guidelines)
- [Security Configuration](#security-configuration)
- [AI Skills & Agents](#ai-skills--agents)
- [Performance Targets](#performance-targets)
- [Commit & PR Guidelines](#commit--pr-guidelines)
- [Roadmap](#roadmap)

---

## Tech Stack

| Category          | Technology                       | Version |
| ----------------- | -------------------------------- | ------- |
| **Framework**     | Next.js (App Router)             | 16.1.6+ |
| **Runtime**       | Bun                              | 1.3.10+ |
| **Language**      | TypeScript                       | 5.x     |
| **React**         | React                            | 19.0.0  |
| **Backend/Auth**  | Supabase (DB, Auth, SSR)         | latest  |
| **Video**         | Remotion                         | latest  |
| **Styling**       | Tailwind CSS                     | 3.4+    |
| **UI Components** | shadcn/ui (New York style)       | latest  |
| **Animations**    | Framer Motion                    | 12.34+  |
| **Validation**    | Zod                              | 4.3+    |
| **Icons**         | Lucide React                     | 0.511.0 |
| **i18n**          | next-intl                        | 4.8.3   |
| **Analytics**     | Vercel Analytics, Speed Insights | 2.0.0   |
| **Testing**       | Playwright                       | 1.58.2  |
| **Linting**       | ESLint                           | 9.x     |
| **Formatting**    | Prettier                         | 3.8.1   |
| **Git Hooks**     | Husky + lint-staged              | 9.1.7+  |

---

## Architecture

### Key Patterns

- **Server Components First**: App Router with RSC by default, Client Components only when needed
- **Server Actions**: All form submissions use `'use server'` with Zod validation
- **Supabase SSR**: Cookie-based authentication with session refresh on every request
- **Dynamic Imports**: Landing page sections loaded via dynamic imports for code-splitting
- **CSS Variable Theming**: Design tokens defined in `globals.css` for runtime theming

### Data Flow

```
Forms → Server Actions (Zod validated) → Supabase DB
Auth → Supabase SSR cookies → Middleware session refresh
Landing Sections → Dynamic imports with SSR → Code-split delivery
Video → Remotion compositions → @remotion/player integration
```

### Middleware

- Refreshes Supabase sessions on every request
- Redirects unauthenticated users from `/protected/*` routes
- Handles locale routing via `next-intl`

---

## Directory Structure

```
justwaitit/
├── app/                          # Next.js App Router pages & layouts
│   ├── [locale]/                 # i18n routed pages (en-US, fr-FR, ar-MA)
│   │   ├── auth/                 # Auth routes (login, signup, forgot-password)
│   │   ├── protected/            # Authenticated routes
│   │   ├── playground/           # Development/demos
│   │   └── legal-mentions/       # Static legal pages
│   └── globals.css               # Global styles & CSS variables
├── components/
│   ├── brand/                    # Brand-specific components (AnaqioLogo, etc.)
│   ├── layout/                   # Header, Footer, global layout
│   ├── sections/                 # Landing page sections (Hero, Waitlist, Solution)
│   ├── tutorial/                 # Tutorial/step components
│   ├── typography/               # Typography primitives
│   └── ui/                       # shadcn/ui components + custom (Section, FeatureCard)
├── lib/
│   ├── actions/                  # Server Actions (waitlist.ts, notify.ts)
│   ├── app/                      # App-level utilities
│   ├── content/                  # Content management
│   ├── supabase/                 # Supabase clients (client.ts, server.ts, middleware.ts)
│   ├── types/                    # TypeScript type definitions
│   └── utils/                    # Shared utilities (cn(), hasEnvVars)
├── hooks/                        # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-device-tier.ts
│   ├── use-intersection-observer.ts
│   ├── use-lazy-video.ts
│   ├── use-multi-step-form.ts
│   └── use-section-observer.ts
├── i18n/                         # Internationalization config
│   ├── config.ts                 # Locale definitions (en-US, fr-FR, ar-MA)
│   ├── request.ts                # i18n request handling
│   └── translations.csv          # Translation strings
├── __tests__/                    # Playwright E2E tests
│   ├── performance/              # Performance tests (FCP, LCP, TBT)
│   └── preservation/             # Visual regression tests
├── remotion/                     # Video composition components
├── design-system/                # Design system documentation
├── docs/                         # Project docs & feature plans
│   ├── components/               # Component documentation
│   ├── guides/                   # Development guides
│   ├── plans/                    # Feature roadmaps
│   └── colors-60-30-10.md        # Color system documentation
├── supabase/
│   └── migrations/               # SQL migrations with timestamps
├── public/                       # Static assets
└── scripts/                      # Build/deployment scripts
```

---

## Building and Running

### Prerequisites

- Node.js 20+ or Bun 1.3.10+
- Supabase project (create at [database.new](https://database.new))

### Commands

```bash
# Development
bun dev                    # Start dev server at http://localhost:3000
bun dev --turbo            # Turbopack mode (faster HMR)

# Production
bun run build              # Production build
bun start                  # Serve built app

# Code Quality
bun run lint               # Run ESLint
bun run lint:fix           # Auto-fix with ESLint
bun run format             # Format with Prettier
bun run format:check       # Check formatting (write-protected)

# Testing
bun run test                          # Run all Playwright E2E tests
bun run test -- <test-file>           # Run specific test file
bun run test -- --headed              # Run tests with visible browser
bun run test -- --debug               # Debug mode with Playwright Inspector

# Tooling
bunx repomix             # Index codebase for AI context (outputs index.json)
bun run export:i18n      # Export i18n translations
```

### npm Alternative

Replace `bun run` with `npm run` for all commands.

---

## Environment Setup

Copy `.env.example` → `.env.local` and configure:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-or-anon-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XYZ4321
```

> **Note**: Both `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` and legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` work. Find these in your Supabase dashboard under **Project Settings > API**.

---

## Coding Conventions

### File Naming

- **Files**: kebab-case (`login-form.tsx`, `use-multi-step-form.ts`)
- **Components**: Export in PascalCase, filename in kebab-case
- **Tests**: `*.test.ts` or `*.test.tsx` in `__tests__/` by feature

### TypeScript

- **Strict mode** enabled in `tsconfig.json`
- **Type imports**: Use `import type` for type-only imports (enforced by ESLint)
- **No `any`**: Avoid `any` type; use `unknown` with type guards if needed
- **Nullish coalescing**: Prefer `??` over `||` for null checks

### Imports

Grouped and alphabetized (enforced by `eslint-plugin-import`):

```ts
// 1. Built-in modules
import fs from 'fs';

// 2. External packages
import { useState } from 'react';
import { clsx } from 'clsx';

// 3. Internal modules
import { cn } from '@/lib/utils';
import { Section } from '@/components/ui/section';

// 4. Relative imports (parent, sibling)
import { Button } from './button';

// 5. Type imports (inline)
import type { FC } from 'react';
import type { SectionProps } from '@/types';
```

### Console Usage

Only allowed:

- `console.warn()` — Warnings
- `console.error()` — Errors

Not allowed:

- `console.log()` — Use debugging tools instead
- `console.info()` — Use structured logging if needed

### React Patterns

- **Functional components** only (no class components)
- **Hooks**: Follow Rules of Hooks (no conditional hooks)
- **Server Components**: Default to RSC; use `'use client'` only for interactivity
- **Self-closing tags**: `<Component />` not `<Component></Component>`

### Database Migrations

All schema changes must be documented in `supabase/migrations/` with timestamped filenames:

```
supabase/migrations/
├── 20250101120000_create_waitlist_table.sql
├── 20250115143000_add_user_profiles.sql
```

---

## Design System

### 60-30-10 Color Rule

| Ratio   | Token              | Usage                    | Example         |
| ------- | ------------------ | ------------------------ | --------------- |
| **60%** | `--tone-dominant`  | Backgrounds, main canvas | Page wrapper    |
| **30%** | `--tone-secondary` | Supporting surfaces      | Section blocks  |
| **10%** | `--tone-accent`    | CTAs, highlights         | Buttons, badges |

### Brand Colors (Tailwind Config)

```ts
aq: {
  blue: '#2563EB',        // Primary accent
  purple: '#7C3AED',      // Secondary accent
  white: '#F8FAFC',       // Light surfaces
  ink: '#0F172A',         // Dark text
  slate: '#334155',       // Muted text
  muted: '#94A3B8',       // Subtle elements
  border: '#E2E8F0',      // Borders
  surface: '#F1F5F9',     // Light backgrounds
  grad: {
    start: '#3F57AF',     // Gradient start
    mid1: '#484DA9',      // Gradient mid 1
    mid2: '#6049A8',      // Gradient mid 2
    end: '#6F47A7',       // Gradient end
  }
}
```

### Typography

| Role          | Font             | Usage                      |
| ------------- | ---------------- | -------------------------- |
| **Display**   | Cormorant        | Hero headings, editorial   |
| **UI**        | DM Sans          | Buttons, labels, body text |
| **Body**      | DM Sans          | Paragraphs, content        |
| **Editorial** | Instrument Serif | Accent headings            |
| **Mono**      | ui-monospace     | Code blocks                |

### Pricing Display

Always display prices in **MAD/DH** (Moroccan Dirham) for the target market.

---

## Testing Guidelines

### Framework

- **Playwright** (`@playwright/test`) for E2E testing
- Tests in `__tests__/` organized by category

### Test Organization

```
__tests__/
├── performance/              # Performance benchmarks
│   └── landing-page-performance.test.ts
├── preservation/             # Visual regression
│   └── hero-visual-regression.test.ts
└── i18n/                     # Localization tests
```

### Performance Targets

Playwright tests enforce:

- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TBT** (Total Blocking Time): < 200ms

### Running Tests

```bash
# All tests (builds app first)
bun run test

# Single test file
bun run test -- __tests__/performance/landing-page-performance.test.ts

# With visible browser (debug)
bun run test -- --headed

# Debug mode
bun run test -- --debug
```

### Test Writing Tips

- Use stable selectors (data-testid, role queries)
- Keep tests focused and fast
- Avoid flaky timing; use `waitFor` instead of `setTimeout`
- Tests should be parallel-safe (no shared state)

---

## Security Configuration

### Environment Variables

- Never commit `.env.local` — use `.env.example` as template
- Vercel/Supabase integrations auto-assign env vars on deployment
- Use `NEXT_PUBLIC_` prefix only for client-exposed vars

### Security Headers (next.config.ts)

```ts
headers: [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; ...",
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
];
```

### Legal Pages Protection

`/legal-mentions/*` routes use `X-Robots-Tag` header to prevent indexing:

```
X-Robots-Tag: noindex, nofollow, noimageindex, noarchive
```

### Supabase Auth

- Cookie-based sessions (Supabase SSR)
- Middleware refreshes sessions on every request
- Protected routes under `/protected/*` redirect unauthenticated users

---

## AI Skills & Agents

### Skills (`.agents/skills/`)

Specialized AI skills for codebase tasks:

| Skill                  | Purpose                             |
| ---------------------- | ----------------------------------- |
| `react-refactor`       | Architectural refactoring for React |
| `nextjs-performance`   | Next.js optimization patterns       |
| `tailwind-ui-refactor` | UI polish with Tailwind CSS         |
| `typescript-refactor`  | Modern TypeScript patterns          |
| `clean-code`           | Best practices & maintainability    |

### Sub-Agents (`.claude/agents/`)

| Agent                | Specialty                          |
| -------------------- | ---------------------------------- |
| `anaqio-ui-designer` | High-end luxury fashion aesthetics |
| `code-improver`      | Batch refactoring & optimization   |

### Using AI Agents

Use **Kiro CLI** to dispatch tasks:

```bash
kiro chat "Refactor the Hero section to use Framer Motion variants"
kiro chat "Optimize LCP for the landing page"
```

---

## Performance Targets

### Core Web Vitals

| Metric  | Target  | Measurement                  |
| ------- | ------- | ---------------------------- |
| **FCP** | < 1.8s  | Playwright performance tests |
| **LCP** | < 2.5s  | Playwright performance tests |
| **TBT** | < 200ms | Playwright performance tests |
| **CLS** | < 0.1   | Vercel Speed Insights        |

### Optimization Strategies

- **Code Splitting**: Dynamic imports for landing page sections
- **Image Optimization**: Next.js Image component with remote patterns
- **CSS Chunking**: `experimental.cssChunking` enabled
- **Inline CSS**: `experimental.inlineCss` for critical styles
- **View Transitions**: `experimental.viewTransition` enabled

---

## Commit & PR Guidelines

### Conventional Commits

Format: `<type>: <description>`

| Type        | Usage                                 |
| ----------- | ------------------------------------- |
| `feat:`     | New feature                           |
| `fix:`      | Bug fix                               |
| `refactor:` | Code refactoring (no behavior change) |
| `test:`     | Test additions/changes                |
| `chore:`    | Maintenance tasks                     |
| `docs:`     | Documentation updates                 |
| `perf:`     | Performance improvements              |
| `style:`    | Formatting, no code logic change      |

### Examples

```
feat: add waitlist form with multi-step validation
fix: resolve session refresh race condition in middleware
refactor: extract SectionHeader from Hero component
test: add E2E tests for waitlist submission flow
docs: update color system documentation
```

### Pull Request Checklist

- [ ] Lint passes: `bun run lint`
- [ ] Tests pass: `bun run test`
- [ ] No console.log statements (warn/error only)
- [ ] Updated docs if needed
- [ ] Screenshots for UI changes
- [ ] Linked issues/PRs

### Pre-Commit Hooks

Husky + lint-staged auto-run on `git commit`:

- TypeScript/JSX files: ESLint + Prettier
- JSON/Markdown/CSS: Prettier only
- Ignores: `.agents/**`, `.agent/**`, `test-results/**`

---

## Roadmap

### Phase 1 (Done)

- Brand localization (typography, colors)
- Landing page scaffolding
- Waitlist form with Server Actions

### Phase 2 (Done)

- Interactive Preview component
- AI Relighting simulation
- Performance test suite

### Phase 3 (Upcoming)

- Dashboard for waitlisted users
- Remotion video sequence refinement
- Style Preference integration
- Multi-language support (en-US, fr-FR, ar-MA)

### Future Features

- AI Lookbook Generator
- AI Studio Workspace (professional editor)
- Automated luxury fashion video generation
- Payment integration (MAD/DH)

---

## Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Playwright**: https://playwright.dev
- **Framer Motion**: https://framer.com/motion

---

_Last updated: March 2026_
