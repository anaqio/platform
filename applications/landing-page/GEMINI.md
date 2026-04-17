# GEMINI.md

This file provides guidance to Gemini CLI when working with code in this repository.

## Project Overview

**ANAQIO** — Morocco's first AI-powered virtual fashion studio.

- **Tagline:** "Your Digital Atelier — Create. Style. Launch."
- **Position:** Sovereign Moroccan AI infrastructure for fashion commerce.
- **Pain:** Traditional photoshoots cost 5,000-20,000 MAD/collection.
- **Promise:** 90% cost reduction via AI-generated studio imagery.

### URLs

- **Production waitlist:** anaqio.com
- **Staging:** stage.anaqio.com
- **MVP studio:** studio.anaqio.com (single-page app, in build)

## Commands

```bash
bun dev              # Start local dev server at http://localhost:3000
bun run build        # Production build
bun start            # Serve built app
bun run lint         # Run ESLint
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format all files with Prettier
bun run format:check # Check formatting without writing
bun run test         # Run all Playwright E2E tests (builds app first)

# Run a single test file:
bun run test -- __tests__/performance/landing-page-performance.test.ts

# Index codebase for AI context:
bunx repomix
```

## Environment Setup

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Host Environment

- **OS:** Arch Linux, Hyprland (Wayland compositor), no Xorg
- **Local Chromium flags:** `chromium --ozone-platform=wayland --enable-features=UseOzonePlatform`
- **XWayland fallback:** `chromium --ozone-platform=x11`
- **Remote debug:** add `--remote-debugging-port=9222`

### Sandbox / CI

Ubuntu 24 container — headless, no display, no Wayland socket. `computer_use` is NOT available. All visual QA uses headless Playwright via bash.

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Framer Motion (animation) + Supabase (DB + auth) + Brevo (email automation).

### Key Directories

- `app/` — App Router pages. `app/auth/` for auth routes, `app/protected/` for authenticated routes, `app/playground/` for development/demos.
- `components/sections/` — Landing page sections (Hero, Waitlist, Solution, etc.) loaded via dynamic imports for code-splitting.
- `components/ui/` — shadcn/ui components (New York style) + custom components (`AnaqioLogo`, `AbstractBackground`, `PerspectiveGrid`, `MagneticButton`, `GrainOverlay`).
- `lib/actions/` — Server Actions (use `'use server'` + Zod validation). Example: `waitlist.ts`.
- `lib/supabase/` — Supabase clients: `client.ts` (browser), `server.ts` (RSC), `middleware.ts` (session refresh).
- `lib/content/` — All section text content (hero.ts, problem.ts, solution.ts, how-it-works.ts, why-anaqio.ts, who-its-for.ts, vision.ts, waitlist.ts, final-cta.ts, types.ts).
- `lib/motion.ts` — Animation utilities (fadeUp, fadeUpCard, fadeIn, slideInLeft, clipReveal, flipReveal, charReveal, scatterIn). All accept `useReducedMotion()` result.
- `hooks/` — Custom React hooks (`use-multi-step-form.ts`, `use-device-tier.ts`).
- `__tests__/` — Playwright tests organized by category: `performance/` and `preservation/`.
- `supabase/migrations/` — Live migrations: `init_waitlist`, `add_campaigns_marketing`. Table in scope: `generations` (usage logging).
- `remotion/` — Video composition components integrated via `@remotion/player`.
- `docs/` — Project docs and feature plans.

### Data Flow

- **Waitlist form** -> Server Action (Zod validation) -> Supabase `waitlist` table (RLS: insert only) -> Brevo welcome sequence triggered
- **Auth** -> Supabase SSR with cookie-based session; middleware refreshes sessions on every request
- **Landing page sections** -> dynamically imported with SSR for code-splitting
- **Studio MVP** -> Garment upload -> preset model selection -> HuggingFace IDM-VTON via Gradio client -> download. Each request logged to `generations` table.

### Design System — Brand Tokens

```
--navy:    #1B2F52   (dominant dark background)
--blue:    #2C5F8A   (primary interactive / CTA)
--gold:    #D4AF37   (accent — used sparingly, high signal)
--ink:     #0F172A   (deepest bg, body text on light)
--elblue:  #2563EB   (UI highlights, links)
--violet:  #7C3AED   (AI / generative feature tags)
--white:   #F8F6F0   (warm off-white, not #FFFFFF)
```

- **Display font:** Syne (bold, geometric — headings only). Load via `next/font`, subset: latin + latin-ext.
- **Body font:** Plus Jakarta Sans (readable at all sizes). Load via `next/font`.
- **Color rule:** 60-30-10 — `--navy` (60%, backgrounds), section surfaces (30%), `--gold` (10%, CTAs/accents).
- **Pricing:** Always display in **MAD/DH** (Moroccan market).
- Tailwind CSS + shadcn/ui with CSS variable theming. Classes sorted via Prettier Tailwind plugin.

### Waitlist Page — Desired State

- **Hero:** Full-bleed `--navy` background, Syne display heading. Tagline: "Your Digital Atelier" dominant, "Create. Style. Launch." secondary. Pain-point subheading in Plus Jakarta Sans. CTA button: `--gold` fill, `--navy` label, Framer Motion `scale(1.04)` hover. Email capture form POSTs to Supabase waitlist table.
- **Social proof band:** "90% cost savings vs. traditional studio" — `--gold` accent stat. Moroccan fashion language (kaftan/jellaba). Dior 62% purchase intent stat.
- **Features teaser (3 cards):** AI Virtual Studio, Virtual Try-On, AI Lookbook Generator. `--navy` bg, `--blue` border, `--gold` icon accent, Framer Motion stagger on scroll.
- **Footer:** Arabic/French/English language hint (Darija-first community signal).

### Studio MVP — Expo Kiosk Mode (studio.anaqio.com)

- Single-page, no auth, no batch generation.
- Garment upload -> preset model selection -> generate -> download.
- Kiosk mode: large touch targets >= 64px, no scroll, fits 1920x1080 landscape.
- Supabase `generations` table logs each request (model, timestamp, status).
- HuggingFace IDM-VTON via Gradio client (primary). fal.ai upgrade deferred until payment capability available.

### Performance Targets

Playwright performance tests enforce: FCP < 1.8s, LCP < 2.5s, TBT < 200ms.
Lighthouse targets: Performance >= 85 mobile / >= 92 desktop. CLS < 0.1.

### Playwright Headless QA

```typescript
import { chromium } from 'playwright'
const vps = [375, 768, 1024, 1440, 1920]
const br = await chromium.launch({
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
  ],
})
for (const w of vps) {
  const pg = await br.newPage()
  await pg.setViewportSize({ width: w, height: Math.round(w * 0.6) })
  await pg.goto('http://localhost:3000')
  await pg.waitForTimeout(1500) // Framer Motion settle
  await pg.screenshot({ path: `anaqio_${w}.png`, fullPage: true })
  await pg.close()
}
await br.close()
```

## Next.js Configuration

- `next.config.js`: confirm no conflicting image domains.
- Fonts: load Syne + Plus Jakarta Sans via `next/font` (subset: latin + latin-ext).
- Framer Motion: lazy-import heavy components (`dynamic` import + `ssr: false`).

## Coding Conventions

- **Files:** kebab-case (`login-form.tsx`); component exports in PascalCase.
- **Imports:** grouped and alphabetized (enforced by ESLint `import` plugin).
- **Console:** only `console.warn` and `console.error` allowed.
- **Database:** No new schema changes — only the two live migrations. Changes must be documented in `supabase/migrations/` with a timestamped filename.
- **Commits:** Conventional Commits — `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`.
- Husky + lint-staged enforce formatting on commit; run `bun run lint:fix` and `bun run format` before opening a PR.

## Hard Constraints — Scope Freeze March 28

- No new features after March 28 — bug fixes and polish only.
- No new npm packages without CTO (Moughamir) approval.
- No Supabase schema changes — only the two live migrations.
- Do not enable batch generation — out of scope for expo MVP.
- No auth gate on studio.anaqio.com — kiosk mode is intentionally public.
- Do not replace Framer Motion with CSS-only for "simplicity".
- fal.ai upgrade: out of scope until payment capability available.
- `--navy` #1B2F52 must never be lightened "for readability".
- Syne must never be replaced with Inter, Space Grotesk, or system fonts.
- `--gold` #D4AF37 must never be substituted with generic yellow or amber.
- Supabase RLS must never be disabled or bypassed.
- Brevo trigger must never be removed — waitlist signup = Brevo event.
- Expo kiosk mode IS in scope — 1920x1080 landscape, large touch targets.
- Darija / Arabic copy IS in scope for social authenticity sections.

## Audit Report Template

```
## Brand Audit Findings
| # | File | Line | Issue | Token | Severity |

## Patches Applied
  FILE:     components/Hero.tsx
  SELECTOR: .hero-cta
  BEFORE:   background: #FFD700; color: #000;
  AFTER:    background: var(--gold); color: var(--navy);
  REASON:   Gold must pair with navy — brand token enforcement

## Supabase / Brevo Validation
  Waitlist insert: PASS / FAIL
  RLS policy:      insert-only confirmed / gap found
  Brevo trigger:   fired / not fired / misconfigured
  campaign_id:     populated / null

## Lighthouse
  Performance: ___   Accessibility: ___   SEO: ___
  CLS: ___  LCP: ___  INP: ___

## QA Checklist
  - [ ] No horizontal scroll 375 -> 1920 px
  - [ ] Syne used only for headings; Plus Jakarta Sans for body
  - [ ] --gold #D4AF37 CTA renders correctly (not #FFD700 / amber)
  - [ ] --navy #1B2F52 dominant — no white/grey bg sections
  - [ ] Waitlist form inserts to Supabase + Brevo fires
  - [ ] Framer Motion stagger on features cards visible at 768 px+
  - [ ] studio.anaqio.com: 4-tap kiosk flow works at 1920x1080
  - [ ] Generations table row created per generation attempt
  - [ ] Lighthouse Performance >= 85 mobile / >= 92 desktop
  - [ ] All copy in FR primary (EN secondary) — no placeholder text

## Notion Log
  POST findings to Anaqio issue tracker via Notion MCP
  Parent page: 321e345f-841c-8110-80e9-c681ce8a56b3
```

## External References

- **Notion issue tracker:** Parent page `321e345f-841c-8110-80e9-c681ce8a56b3` — log audit findings via Notion MCP.
- **Supabase:** psycholium account (production waitlist).
- **Brevo:** Email automation for waitlist welcome sequence.
- **HuggingFace:** IDM-VTON via Gradio client for virtual try-on.
