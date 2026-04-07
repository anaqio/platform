# Brand Page Redesign + Design System Token Centralization

**Date:** 2026-03-12
**Project:** ANAQIO
**Jira Project:** SCRUM (`https://omnizya.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog`)
**Branch:** `feature/brand-page-tokens`
**Status:** Approved for implementation
**Approach:** A — Token-First, Then Brand Page

---

## 1. Problem Statement

The current brand page (`app/[locale]/brand/brand-content.tsx`) has three critical issues:

1. **Token fragmentation** — design tokens are scattered across `tailwind.config.ts`, `app/globals.css`, and an inline `<style>` block inside `brand-content.tsx` that uses raw hex values (`#c9a96e`, `#0a0a08`) inconsistent with the official brand palette.
2. **Visual identity mismatch** — the current brand page uses a "luxury gold" aesthetic that contradicts the actual registered brand colors (aq-blue `#2563EB`, aq-purple `#7C3AED`).
3. **No centralized reference** — future developers have no single file to consult for design tokens; they must reconcile three separate sources of truth.

---

## 2. Goals

1. Create a **single source of truth** for all design tokens in `lib/tokens.ts` — typed TypeScript constants that feed both CSS variables (`globals.css`) and Tailwind config.
2. Rebuild the brand page as a **living style guide** that reflects the actual ANAQIO visual identity using those tokens exclusively — no raw hex values anywhere.
3. Remove the **password gate** — the page is publicly accessible brand documentation.
4. Deliver **7 sections** covering the full brand identity system.
5. All work tracked as **Jira stories** under the SCRUM project.

---

## 3. Non-Goals

- No new brand identity assets (SVG logos, typography fonts) — existing assets in `public/brand/` are used as-is.
- No dark/light mode toggle on the brand page — dark mode only (matches app theme).
- No backend authentication — password gate removed entirely.
- No Remotion integration in this sprint.

---

## 4. Architecture

### 4.1 Design Token System

**Source of truth:** `lib/tokens.ts`

```
lib/
  tokens.ts          ← single source of truth (exported typed constants)
  tokens.css.ts      ← generates CSS custom property strings from tokens.ts
```

`lib/tokens.ts` exports typed namespaces:

```ts
export const colors = { ... }       // brand palette + semantic roles
export const typography = { ... }   // font families, size scale, letter spacing
export const spacing = { ... }      // t-shirt size spacing scale
export const motion = { ... }       // duration, easing curves
export const radius = { ... }       // border radius tokens
export const shadows = { ... }      // elevation tokens
export const gradients = { ... }    // brand gradient definitions
```

**Consumption chain:**

```
lib/tokens.ts
  ↓ imported by
tailwind.config.ts          ← colors, fontFamily, borderRadius, letterSpacing
  ↓ compiled to
CSS utility classes          ← used in all components

lib/tokens.ts
  ↓ generates string block in
app/globals.css :root {}    ← CSS custom properties for runtime cascade

lib/tokens.ts
  ↓ imported directly by
Remotion compositions        ← runtime color/font access without CSS
```

**Token naming convention** (CSS vars generated from token keys):

| Token key                    | CSS var           | Tailwind class                    |
| ---------------------------- | ----------------- | --------------------------------- |
| `colors.brand.blue`          | `--aq-blue`       | `text-aq-blue` / `bg-aq-blue`     |
| `colors.brand.purple`        | `--aq-purple`     | `text-aq-purple` / `bg-aq-purple` |
| `colors.semantic.background` | `--background`    | `bg-background`                   |
| `typography.family.display`  | `--font-display`  | `font-display`                    |
| `motion.duration.base`       | `--duration-base` | — (JS only)                       |

### 4.2 Brand Page Structure

**Route:** `app/[locale]/brand/page.tsx` (existing, no changes needed)
**Client component:** `app/[locale]/brand/brand-content.tsx` (full rewrite)

The brand page is decomposed into 7 standalone section components, each in `app/[locale]/brand/sections/`:

```
app/[locale]/brand/
  page.tsx                     ← RSC shell + metadata (unchanged)
  brand-content.tsx            ← client orchestrator (rewrite: remove gate, compose sections)
  sections/
    BrandHero.tsx              ← page header, logo lockup, tagline
    LogoShowcase.tsx           ← graphic mark + wordmark on dark/light/gradient bg
    ColorPalette.tsx           ← brand colors + 60-30-10 swatches + gradient spectrum
    TypographySpecimen.tsx     ← Cormorant / DM Sans / Instrument Serif specimens
    MotionPrinciples.tsx       ← easing curve visualizations, duration tokens
    ComponentGallery.tsx       ← live buttons, badges, cards, inputs
    UsageRules.tsx             ← do / don't logo usage, color combination warnings
    DownloadAssets.tsx         ← SVG download links for graphic mark + wordmark
```

### 4.3 Multi-Agent Work Distribution

| Agent      | Owns                                  | Files                                                                                       |
| ---------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Qwen**   | Token system                          | `lib/tokens.ts`, update `tailwind.config.ts`, update `globals.css :root {}`                 |
| **Gemini** | Brand page sections A–D               | `BrandHero`, `LogoShowcase`, `ColorPalette`, `TypographySpecimen`                           |
| **Claude** | Brand page sections E–H + integration | `MotionPrinciples`, `ComponentGallery`, `UsageRules`, `DownloadAssets`, `brand-content.tsx` |

Each agent receives a focused system prompt covering only their file boundary. No shared state — agents communicate through the token imports only.

### 4.4 Agent System Prompts

**Qwen system prompt (Token System):**

> You are implementing the Design System Token centralization for ANAQIO. Your ONLY job is: (1) Create `lib/tokens.ts` exporting typed color, typography, spacing, motion, radius, shadow, and gradient constants using the exact values from `tailwind.config.ts` and `app/globals.css`. (2) Update `tailwind.config.ts` to import and consume `lib/tokens.ts` instead of hardcoded values. (3) Update the `:root {}` block in `app/globals.css` to reference token values. Do NOT touch any component files. Run `bun run lint` before finishing.

**Gemini system prompt (Brand Sections A–D):**

> You are implementing the first 4 sections of the ANAQIO brand page. Import all colors/typography from `lib/tokens.ts`. Use only Tailwind classes — no inline styles, no raw hex. Use the `AnaqioLogo` component from `components/ui/AnaqioLogo.tsx`. Sections to build: `BrandHero.tsx` (hero lockup), `LogoShowcase.tsx` (logo on 3 backgrounds), `ColorPalette.tsx` (color swatches grid), `TypographySpecimen.tsx` (font family specimens). Each section is a named export. Run `bun run lint` before finishing.

**Claude system prompt (Brand Sections E–H + integration):**

> You are implementing the final 4 sections and the orchestrator for the ANAQIO brand page. Import from `lib/tokens.ts`. Use Framer Motion for `MotionPrinciples.tsx` (easing visualizations). Build `ComponentGallery.tsx` using existing shadcn/ui components. Build `UsageRules.tsx` with do/don't grids. Build `DownloadAssets.tsx` with `<a href="/brand/...svg" download>` links. Finally rewrite `brand-content.tsx` to compose all 8 sections — remove the password gate entirely.

---

## 5. Section Designs

### 5.1 BrandHero

Full-width dark section. AnaqioLogo at 64px. Tagline in Cormorant Italic. Animated gradient orb background using `AbstractBackground` component. Scroll-down caret.

### 5.2 LogoShowcase

Three side-by-side panels: (1) graphic mark on `bg-background` (dark ink), (2) wordmark on `bg-aq-purple` gradient, (3) graphic mark on `bg-white` with `theme="light"`. Each panel has a copy-to-clipboard hex color button. Downloads for SVG and PNG variants.

### 5.3 ColorPalette

Grid of swatches using the `aq.*` token namespace. Four groups: Primary (blue, purple), Neutral (ink, slate, muted, border, surface, white), Gradient Spectrum (4 stops), Semantic (background, foreground, card, primary, secondary). Each swatch shows token name, hex value, CSS var name, and Tailwind class.

### 5.4 TypographySpecimen

Three stacked rows, one per font family. Each row: font family name in `font-label tracking-label` uppercase, a large display specimen in the font, and a metadata row showing use cases (Display / Editorial / UI Body).

### 5.5 MotionPrinciples

Duration token table (`fast: 150ms`, `base: 250ms`, `slow: 400ms`, `cinematic: 800ms`). Four animated Framer Motion boxes demonstrating each easing curve (`easeOut`, `easeInOut`, spring). Reduced-motion note.

### 5.6 ComponentGallery

Live renders: primary button, secondary button, ghost button, badge variants, feature card, input field, gradient text span. Caption beneath each showing the Tailwind classes used.

### 5.7 UsageRules

Two-column grid: ✅ Correct use / ❌ Incorrect use. Cases: logo on correct backgrounds, minimum size, gradient misuse, font substitution, color ratio violations.

### 5.8 DownloadAssets

Minimal table: asset name, format, dimensions, `<a download>` button. Assets: `anaqio-graphic-logo.svg`, `anaqio-typography-logo.svg`, `logo.svg` (combined mark).

---

## 6. Design Token Reference (Canonical Values)

### Colors

| Token                   | Value     | CSS Var           |
| ----------------------- | --------- | ----------------- |
| `colors.brand.blue`     | `#2563EB` | `--aq-blue`       |
| `colors.brand.purple`   | `#7C3AED` | `--aq-purple`     |
| `colors.brand.white`    | `#F8FAFC` | `--aq-white`      |
| `colors.brand.ink`      | `#0F172A` | `--aq-ink`        |
| `colors.brand.slate`    | `#334155` | `--aq-slate`      |
| `colors.brand.muted`    | `#94A3B8` | `--aq-muted`      |
| `colors.brand.border`   | `#E2E8F0` | `--aq-border`     |
| `colors.brand.surface`  | `#F1F5F9` | `--aq-surface`    |
| `colors.gradient.start` | `#3F57AF` | `--aq-grad-start` |
| `colors.gradient.mid1`  | `#484DA9` | `--aq-grad-mid1`  |
| `colors.gradient.mid2`  | `#6049A8` | `--aq-grad-mid2`  |
| `colors.gradient.end`   | `#6F47A7` | `--aq-grad-end`   |

### Typography

| Token                           | Value                          |
| ------------------------------- | ------------------------------ |
| `typography.family.display`     | `var(--font-cormorant)`        |
| `typography.family.ui`          | `var(--font-dm-sans)`          |
| `typography.family.editorial`   | `var(--font-instrument-serif)` |
| `typography.tracking.display`   | `0.01em`                       |
| `typography.tracking.editorial` | `0.04em`                       |
| `typography.tracking.label`     | `0.3em`                        |

### Motion

| Token                       | Value                                             |
| --------------------------- | ------------------------------------------------- |
| `motion.duration.fast`      | `150` (ms)                                        |
| `motion.duration.base`      | `250` (ms)                                        |
| `motion.duration.slow`      | `400` (ms)                                        |
| `motion.duration.cinematic` | `800` (ms)                                        |
| `motion.easing.out`         | `[0.22, 1, 0.36, 1]`                              |
| `motion.easing.inOut`       | `[0.4, 0, 0.2, 1]`                                |
| `motion.easing.spring`      | `{ type: 'spring', stiffness: 300, damping: 30 }` |

---

## 7. Jira Story Map

**Epic:** `BRAND-001 — Brand Page & Design System Token Centralization`

| Story    | Title                                                                | Agent  | Points |
| -------- | -------------------------------------------------------------------- | ------ | ------ |
| SCRUM-B1 | Create `lib/tokens.ts` — single source of truth                      | Qwen   | 3      |
| SCRUM-B2 | Wire `tailwind.config.ts` + `globals.css` to consume `lib/tokens.ts` | Qwen   | 2      |
| SCRUM-B3 | Build `BrandHero` + `LogoShowcase` sections                          | Gemini | 3      |
| SCRUM-B4 | Build `ColorPalette` + `TypographySpecimen` sections                 | Gemini | 3      |
| SCRUM-B5 | Build `MotionPrinciples` + `ComponentGallery` sections               | Claude | 3      |
| SCRUM-B6 | Build `UsageRules` + `DownloadAssets` sections                       | Claude | 2      |
| SCRUM-B7 | Rewrite `brand-content.tsx` — remove gate, compose all sections      | Claude | 2      |
| SCRUM-B8 | Write `docs/design-tokens.md` reference for developers               | Claude | 1      |
| SCRUM-B9 | Playwright tests — brand page renders all 8 sections, downloads work | Claude | 2      |

**Sprint order:** B1 → B2 → (B3, B4, B5, B6 in parallel) → B7 → B8 → B9

---

## 8. Acceptance Criteria

- [ ] `lib/tokens.ts` exports all brand tokens with TypeScript types; no raw hex values exist outside this file
- [ ] `tailwind.config.ts` imports from `lib/tokens.ts` — zero hardcoded color values
- [ ] `globals.css :root {}` references token constants — no raw hex in CSS vars
- [ ] Brand page renders all 7 content sections + hero (8 total) without a password gate
- [ ] Zero inline `<style>` blocks in any brand page component
- [ ] All components use only Tailwind classes derived from the token system
- [ ] `AnaqioLogo` component used in hero and logo showcase (no `<img src>` direct usage)
- [ ] SVG download links work (`/brand/anaqio-graphic-logo.svg`, `/brand/anaqio-typography-logo.svg`)
- [ ] `bun run lint` passes with zero errors
- [ ] Playwright test covers page load + section visibility + download link presence
- [ ] `docs/design-tokens.md` exists as a developer reference

---

## 9. File Change Summary

| File                                                 | Action                                             |
| ---------------------------------------------------- | -------------------------------------------------- |
| `lib/tokens.ts`                                      | **Create**                                         |
| `tailwind.config.ts`                                 | **Update** — import from `lib/tokens.ts`           |
| `app/globals.css`                                    | **Update** — `:root {}` references token constants |
| `app/[locale]/brand/brand-content.tsx`               | **Rewrite** — remove gate, compose sections        |
| `app/[locale]/brand/sections/BrandHero.tsx`          | **Create**                                         |
| `app/[locale]/brand/sections/LogoShowcase.tsx`       | **Create**                                         |
| `app/[locale]/brand/sections/ColorPalette.tsx`       | **Create**                                         |
| `app/[locale]/brand/sections/TypographySpecimen.tsx` | **Create**                                         |
| `app/[locale]/brand/sections/MotionPrinciples.tsx`   | **Create**                                         |
| `app/[locale]/brand/sections/ComponentGallery.tsx`   | **Create**                                         |
| `app/[locale]/brand/sections/UsageRules.tsx`         | **Create**                                         |
| `app/[locale]/brand/sections/DownloadAssets.tsx`     | **Create**                                         |
| `docs/design-tokens.md`                              | **Create**                                         |
| `__tests__/brand/brand-page.test.ts`                 | **Create**                                         |
