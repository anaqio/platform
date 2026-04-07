# ANAQIO Feature Roadmap & Implementation Plan

**Goal:** Bridge the gap between the current landing page and a functional, interactive AI fashion studio, while tailoring the brand for the Moroccan market.

**Architecture:** A multi-phase rollout focusing on client-side interactivity (Interactive Preview), core AI features (Editor & Lookbook), and brand localization (Moroccan MAD/DH pricing and high-end Moroccan fashion aesthetic).

**Tech Stack:** Next.js (App Router), Supabase (Auth/DB), Remotion (Video Production), Framer Motion (UI Interactivity), Zod (Validation).

---

## Missing Features Definition

- **Feature A: AI Studio Workspace (The Editor)**
  - **Description:** A browser-based professional workspace where users can upload fashion assets, adjust lighting, swap backgrounds, and apply AI-driven "style transfer" to garments.
  - **Status:** In Development (Alpha scheduled for Q2 2026).

- **Feature B: AI Lookbook Generator**
  - **Description:** An automated tool that takes a collection of product shots and generates a cohesive, editorial-style lookbook with AI-generated models and Moroccan settings.
  - **Status:** Phase 3.

---

## Current Status (as of February 26, 2026)

The project codebase has undergone a comprehensive review and several critical issues have been resolved, enhancing stability, type safety, and adherence to modern Next.js practices.

**Resolved Issues:**

- **Linting & Type Safety:** Addressed various `react/no-unescaped-entities`, `react/jsx-no-comment-textnodes` errors in `app/brand/brand-content.tsx` and unused variable/import warnings across components. Replaced `any[]` with specific types where possible.
- **Image Optimization:** Replaced direct `<img>` tags with `next/image` in `components/sections/interactive-preview.tsx` for optimized image delivery.
- **Zod Validation:** Corrected `ZodError` access from `error.errors` to `error.issues` in `lib/actions/waitlist.ts` for compatibility with current Zod versions.
- **Supabase Middleware:** Fixed cookie handling in `lib/supabase/middleware.ts` (now `proxy.ts`) to align with `NextRequest` and `NextResponse` cookie API.
- **Remotion Integration:** Resolved font loading (`weight` vs `weights`, `style` property) and composition registration (`registerComposition` vs `<Composition>`) issues in Remotion files. Ensured correct JSX processing by renaming `remotion/index.ts` to `remotion/index.tsx`.
- **Tailwind CSS Configuration:** Imported `Config` type in `tailwind.config.ts` to resolve TypeScript errors.
- **Next.js Middleware Migration:** Successfully migrated the deprecated `middleware.ts` file to the new `proxy.ts` convention using the `@next/codemod` tool, aligning with Next.js 16+ best practices.

## Interactive Preview

- **Scope:** A "try-before-you-buy" component embedded in the landing page allowing users to toggle backgrounds and lighting styles on high-end garments.
- **User Flow:**
  1. **Select Environment:** User chooses between "Sahara Sunset", "Marrakech Riad", or "Atlas Morning".
  2. **AI Simulation:** Visual feedback shows "AI Relighting" process.
  3. **Result:** Background and garment lighting update to match the selected vibe.
- **Implementation:** Done via `components/sections/interactive-preview.tsx`.

---

## Scope Definition

- **In Scope:**
  - Moroccan MAD/DH pricing localization.
  - Interactive Preview component.
  - Introduction video built with Remotion.
  - Consistent branding with Syne and Cormorant fonts.
  - Next.js `proxy.ts` for Edge runtime logic.
- **Out Scope:**
  - Real-time AI backend processing (simulated for now).
  - Moroccan payment gateway integration (Stripe/Payzone).

---

## User Stories

- **US1:** As a Moroccan fashion brand owner, I want to see pricing in DH, so that I can immediately calculate ROI in local currency.
- **US2:** As a creative director, I want to see the introduction video, so that I can understand the brand's aesthetic quality instantly.

---

## Acceptance Criteria

- **AC1:** Pricing sections must display "DH" or "MAD" exclusively.
- **AC2:** The introduction video must be 9:16 format and reflect high-end luxury fashion.
- **AC3:** Interactive Preview must complete "transformation" in under 2 seconds.

---

## Implementation Timeline

### Phase 1: Brand Localization & Scaffolding (Completed)

- [x] Refactor pricing to MAD/DH.
- [x] Standardize Syne/Cormorant typography.
- [x] Install Remotion and scaffold Intro Video.
- [x] Deploy enhanced "Coming Soon" section.

### Phase 2: Interactive Preview (Completed)

- [x] Build `InteractivePreview` component with Framer Motion.
- [x] Integrate high-quality Moroccan environment placeholders.
- [x] Implement "AI Relighting" simulation.

### Phase 3: Video & Lookbook Alpha (Upcoming)

- [ ] Refine Remotion animation sequence with actual fashion assets.
- [ ] Implement early-access dashboard for waitlisted users.
- [x] Add `preferences` field to the waitlist table (migration).
- [ ] Update the form to collect "Desired Aesthetic" (Modern, Traditional, Streetwear).

---

## Task List for Phase 3

### Task 1: Refine Remotion Intro Video

**Files:**

- Modify: `remotion/IntroVideo.tsx`
- Modify: `components/sections/ComingSoonSection.tsx`

**Step 1:** Add more scenes to the Intro video showing "Before/After" comparisons.
**Step 2:** Optimize video loading performance in the Player.

### Task 2: Style Preference Integration

**Files:**

- Modify: `lib/actions/waitlist.ts`
- Modify: `components/sections/waitlist-form.tsx`

**Step 1:** Add a `preferences` field to the waitlist table (migration).
**Step 2:** Update the form to collect "Desired Aesthetic" (Modern, Traditional, Streetwear).
