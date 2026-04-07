# Tasks

## Data Structures (COMPLETE)
- [x] Task 1: Create Marquee Content Data Structure
- [x] Task 2: Create Features Section Data Structure
- [x] Task 3: Create Results Section Data Structure
- [x] Task 4: Create Segments Section Data Structure
- [x] Task 5: Create Pricing Section Data Structure
- [x] Task 6: Add Motion Animation Helpers

## Atom Components (COMPLETE)
- [x] Task 7: Create Marquee Ticker Atom Component
- [x] Task 8: Create Feature Card Atom Component
  - FeatureCardAtom.tsx + unit tests
  - Framer Motion stagger animation + hover effects
- [x] Task 9: Create Result Card Atom Component
  - ResultCardAtom.tsx + unit tests
  - Animated comparison layout with arrow animation
- [x] Task 10: Create Segment Card Atom Component
  - SegmentCardAtom.tsx + unit tests
  - Hover-reveal problem/solution with color-coded borders
- [x] Task 11: Create Pricing Tier Atom Component
  - PricingTierAtom.tsx + unit tests
  - Popular badge, feature list with checkmarks, custom pricing support

## Section Wrapper Components (COMPLETE)
- [x] Task 12: Create Section Wrapper Components
  - FeaturesSection.tsx — wraps FeatureCardAtom with grid layout
  - ResultsSection.tsx — wraps ResultCardAtom with comparison cards
  - SegmentsSection.tsx — wraps SegmentCardAtom with vertical stack
  - PricingSection.tsx — wraps PricingTierAtom with 3-column grid
  - MarqueeSection.tsx — wraps MarqueeTickerAtom with variant background support

## Integration & Testing (COMPLETE)
- [x] Task 13: Integrate Sections into NewLandingPage
  - All sections dynamically imported with SSR for code-splitting
  - MarqueeSection inserted after VideoHeroSection and after SolutionSection
  - Page layout verified and flowing correctly
- [x] Task 14: Run Full Test Suite and Performance Verification
  - `bun run test` — ALL 167 TESTS PASSING (29 test files)
  - Fixed IntersectionObserver mock in vitest.setup.ts (class-based, constructor-safe)
  - Bumped testTimeout to 10s to prevent timing flakes under full-suite CPU load
  - All atom and section components verified
  - E2E tests ready with `bun run test:e2e`

## Phase 2 — Visual Polish & Vooban Fidelity (COMPLETE)
- [x] Task 15: Fix MarqueeTickerAtom theme-awareness
  - Replace hardcoded `text-white` with `text-foreground`
  - Add separator dots between items (·) for Vooban ticker style
  - Added `textColor` prop for variant support
- [x] Task 16: Improve FeatureCardAtom design
  - Replaced `bg-white dark:bg-slate-800` with `bg-card` CSS variable token
  - Added icon container with `bg-aq-blue/10` accent ring
  - All borders use `border-border` token
- [x] Task 17: Add alternating section backgrounds
  - Features + Segments: `bg-muted/30` (subtle offset)
  - Results + Pricing: `bg-background` (default)
  - Background prop pattern for all 4 new sections
- [x] Task 18: Typography pass on all new sections
  - All section headings: `font-display` with `clamp(2.5rem,5vw,6rem)`
  - All section eyebrows: `font-label uppercase tracking-label`
  - Consistent with Omnizya design system
- [x] Task 19: PricingSection dark-mode accent fix
  - `border-aq-blue` + gradient ring for highlighted tier
  - Popular badge with `from-aq-blue to-aq-purple` gradient
  - Non-highlighted cards use `border-border bg-card`
- [x] Task 20: Add ScrollTriggered entrance to ResultsSection metrics
  - ResultCardAtom migrated to `fadeUpCard()` from motion.ts
  - Staggered y:24 fade-up with `useReducedMotion` support

## Post-Expo Status (as of 2026-03-31)
- Expo deadline (2026-03-28) has passed
- Phase 1 complete: all data, atoms, sections, integration, and tests committed
- Test suite healthy: 167 unit tests passing, E2E tests ready
- Phase 2 focus: visual polish and Vooban design fidelity
