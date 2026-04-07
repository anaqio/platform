# Cinematic Waitlist Landing Page — Design & Implementation Plan

**Date:** 2026-03-10
**Author:** Design Research
**Status:** Draft

---

## Executive Summary

ANAQIO's current landing page is a well-architected, performance-optimized waitlist site with clean section separation and consistent animation utilities. This document proposes a **cinematic redesign** that elevates the page from a functional waitlist to an immersive brand experience — one that makes fashion brands viscerally feel the product before they've used it.

The redesign targets a single emotional outcome: **"I need access to this, right now."**

---

## 1. Design Direction: "The Atelier"

### Concept

The cinematic direction draws from high-end fashion editorial: **controlled darkness, precise light, textile texture, and silence that commands attention.** Think Bottega Veneta's campaign videos or Maison Margiela's digital experiences — minimal words, maximal atmosphere.

### Mood: Dark Luxury

- **Dominant background:** Near-black (`oklch(8% 0.02 250)`) — not flat black, but deep inky blue-black
- **Surface:** Warm charcoal glass with micro-noise texture
- **Accent:** Aq-blue used sparingly as the single light source — cuts through the dark like a spotlight
- **Text:** Cream/off-white with heavy editorial Cormorant headings
- **Atmosphere:** Subtle grain overlay, frosted glass cards, deep shadow stacking

This is a **departure from the current warm-parchment palette** (`--background: 35° 24.6% 86.5%`). The cinematic redesign uses the existing `secondary` dark tone (`25° 20% 15%`) as the dominant, and inverts the 60-30-10 rule for a **dark-dominant** experience.

> **Note:** The Tailwind design tokens (`aq-blue`, `aq-purple`, glass utilities, brand gradients) remain unchanged. Only the page-level background hierarchy inverts.

---

## 2. Current vs. Target Comparison

| Dimension           | Current                           | Cinematic Target                        |
| ------------------- | --------------------------------- | --------------------------------------- |
| Background          | Warm cream (60%)                  | Deep ink (60%)                          |
| Typography scale    | Balanced h1–h4                    | Oversized editorial (clamp 5rem–12rem)  |
| Hero media          | Perspective grid + abstract blobs | Full-screen video loop with parallax    |
| Section transitions | Opacity/Y fadeUp on scroll        | Clip-path wipe + depth layers           |
| CTA prominence      | Standard button                   | Magnetic, glowing, scroll-tracked       |
| Social proof        | Static incentive bullets          | Live animated join counter              |
| Form experience     | Standard single-step              | Multi-step with cinematic transitions   |
| Scroll mechanic     | Standard scroll                   | Scroll-snapping with scene choreography |
| Audio               | None                              | Ambient atelier sound (opt-in)          |
| Cursor              | Default                           | Custom spotlight cursor                 |

---

## 3. Section Architecture (Redesigned)

### Section 0: Preloader (NEW)

**Purpose:** Set tone before any content is shown.

```
ANAQIO wordmark fades in from nothing (2s)
Thin horizontal rule draws across viewport width (0.8s)
"Studio · AI · Fashion" appears letter by letter (0.6s)
Full screen dissolves → Hero
```

**Implementation:**

- React portal overlay (`position: fixed z-[9999]`)
- `AnimatePresence` exit: opacity 0 + scale 1.02 (3s total)
- `sessionStorage` flag to skip on revisit
- Reduced motion: skip directly to hero

---

### Section 1: Hero — "The Frame"

**Layout:** Full-viewport (`100dvh`). Three depth layers:

```
Layer 0 (z-0):  Slow-playing video loop (desaturated fabric/studio b-roll)
                — Fallback: existing AbstractBackground with dark palette
Layer 1 (z-10): Perspective grid overlay (existing PerspectiveGrid, opacity 0.15)
Layer 2 (z-20): Content column (centered, max-w-3xl)
Layer 3 (z-30): Grain overlay (SVG noise, opacity 0.04, fixed position)
```

**Content:**

```
[Eyebrow] — animated slide-in from left
[H1] ANAQIO            ← Cormorant, ~10rem, letter-spacing -0.02em
[Thin horizontal rule] ← scaleX from 0
[Subheadline]          ← word-by-word reveal (stagger 0.08s/word)
[CTA Block]            ← magnetic buttons
[Scroll indicator]     ← animated chevron pulse + "Scroll to explore"
```

**Hero Animations:**

1. On load: Eyebrow slides in from left (`x: -20 → 0`, 0.8s, delay 0.2s)
2. Headline: Each letter of "ANAQIO" animates in with `rotateX: 90 → 0` (stagger 0.05s/char)
3. Rule: `scaleX: 0 → 1` from center (1s, delay 0.8s)
4. Subheadline: word-by-word `y: 20 → 0, opacity: 0 → 1` (0.08s stagger)
5. Buttons: `y: 20 → 0` fade (0.6s, delay 1.4s)
6. Video: fades in AFTER wordmark (starts at 20% opacity, reaches 60% at 3s)

**Parallax:**

- Video drifts `y: 0 → -15%` on scroll (using existing `useScroll` + `useTransform`)
- Grain stays fixed (`position: fixed`)

---

### Section 2: Problem — "The Industry's Silent Failure"

**Layout change:** From 2-col grid → full-width cinematic text reveal

**Pattern: "Scroll-driven typewriter"**

```
As user scrolls down, a large-format statement appears word by word:

"Fashion moves fast.    [pause]
 Production doesn't."  [pause]

           — white text, Cormorant, 6rem
```

Below the statement, **pain points appear as horizontal list items** with:

- Thin left border (aq-blue/40)
- Animated width underline on scroll entry
- Numbered labels (`01` – `04`) in mono font

**Micro-interaction:** Each pain point reveals with `clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)` — a right-wipe reveal.

---

### Section 3: Solution — "The Transformation"

**Layout change:** Before/after comparison slider (NEW)

**Left panel:** Traditional production workflow (greyed out, desaturated)

- Labels: "Shoot days: 14", "Cost: 28,000 DH", "Revisions: 3+ weeks"

**Right panel:** ANAQIO workflow (vibrant, illuminated)

- Labels: "Delivery: 2 hours", "Cost: 590 DH/month", "Revisions: Instant"

**Interaction:** Draggable vertical divider reveals the "after" state. On mobile: auto-animates from 50% to 80% ANAQIO side.

**Below the slider:** Existing 3-card pipeline cards, unchanged but with enhanced entry:

- Cards appear with `rotateY: 15deg → 0` (3D flip) staggered

---

### Section 4: How It Works — "The Process"

**Layout:** Retained as 4-step grid BUT enhanced with:

**Step reveal mechanic:** Each step card is "locked" visually (dim, blurred) until scroll reaches its threshold. As the user scrolls, cards "activate" sequentially with a blue pulse from the number label.

```
[01] → blur(8px) opacity(0.3)  [not yet reached]
[01] → blur(0) opacity(1) + pulse ring on "01" label  [active]
```

**Implementation:**

- `useInView` per card with different `margin` offsets
- `motion.div` with conditional animation state
- Blue ring: `box-shadow: 0 0 0 0px aq-blue → 0 0 0 8px aq-blue/0` (pulse keyframe)

---

### Section 5: Why ANAQIO — "The Proof"

**Layout change:** 5-card grid → **horizontal scroll track** on desktop, vertical stack on mobile

**Scroll track design:**

```
[sticky header: "Why ANAQIO"]

[card 1] [card 2] [card 3] [card 4] [card 5]
                 ← horizontal scroll on sticky viewport →
```

**Implementation:**

- `position: sticky; top: 0` on section header
- Horizontal `translateX` driven by vertical scroll (`useTransform`)
- `overflowX: hidden` on container; cards translate into view as user scrolls vertically

**Cards:** Keep existing `FeatureCard` with `glass` variant. Add:

- Hover glow: `box-shadow: 0 0 40px aq-blue/10`
- Hover icon scale: `scale: 1 → 1.15` (0.3s ease)

---

### Section 6: Who It's For — "The Audience"

**Layout change:** 4-card grid → **Tab switcher with animated panel transitions**

```
[Brands] [Designers] [Studios] [Marketplaces]
                 ↕ (active underline slides)
[Animated panel — full-width, dark surface]
  Large icon (left, 30% width)
  Title + body copy + "designed for you" list items (right, 70% width)
```

**Transition:** Active panel slides in from right (`x: 40 → 0`) with `AnimatePresence` mode `wait`.

**Auto-cycle:** Rotates every 4s if user doesn't interact. Stops on first hover.

---

### Section 7: Philosophy — "The Belief"

**Layout:** Retained single-column BUT with **scroll-tracked text highlight**:

```
As user scrolls through the section, words in the paragraph
progressively change from `text-white/30` → `text-white`
based on scroll position (like Apple's product pages).
```

**Implementation:**

- Break each word into `<span>` with index
- Map scroll progress (`0 → 1`) to word highlight range
- `useTransform` + `useMotionValue` for scroll tracking
- Intersection-based chunking for performance

---

### Section 8: Vision — "The Future"

**Layout change:** Center-aligned fullscreen with **large background number counter**:

```
            2027
[headline text centered]
[3 vision points as centered list]
[italic quote, large, Cormorant]
```

The `2027` is typeset at `20rem`, blurred (`blur(80px)`), colored `aq-blue/8` — atmosphere only.

**Animation:** On section enter, `2027` fades in from `opacity(0) scale(0.95)` as a background element.

---

### Section 9: Social Proof Counter (NEW)

**Purpose:** Build FOMO before the final CTA. This section doesn't exist currently.

**Layout:** Full-viewport, centered

```
           [animated counter: 847]
     brands have already requested access

     [bar chart animation: requests per week]
     Week 1 ████░░  Week 2 ████████ Week 3 ██████████░

     [3 avatar clusters with "Casablanca · Marrakech · Rabat"]
```

**Implementation:**

- `useCountUp` hook (count from 0 → 847 over 2s with easing)
- Bar chart: CSS width animations staggered on scroll entry
- Avatars: gradient circles + city labels (mock/design data)

---

### Section 10: Final CTA — "The Door"

**Design change:** Current has two standard buttons. Redesign to:

```
              RESERVED ACCESS
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     [Large glowing primary button: "Request My Spot"]
        — magnetic hover (x/y movement toward cursor)
        — gradient glow ring animates on hover
        — loading state → success animation built-in

     Below: ghost text "or scroll to learn more about priority access"
```

**Magnetic button implementation:**

```tsx
const ref = useRef<HTMLButtonElement>(null);
const [position, setPosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (e) => {
  const rect = ref.current.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  setPosition({ x: x * 0.3, y: y * 0.3 });
};

// motion.button animate={{ x: position.x, y: position.y }}
```

---

### Section 11: Waitlist Form — "The Stage"

**Layout change:** Full-screen takeover feel (dark, spotlight from above)

```
Layer 0: Video loop or slow grain texture (full-bleed)
Layer 1: Dark overlay (gradient from top)
Layer 2: Centered form card (glass-strong, max-w-lg)
```

**Form redesign: Multi-step with cinematic transitions**

```
Step 1: "What's your brand name?"
        [Input: large, minimal border, Cormorant placeholder]
        [Next →]

Step 2: "Your role?"
        [3 card choices: Brand Owner / Designer / Studio]
        [Each card animates on hover: scale 1.02, blue border]

Step 3: "Where can we reach you?"
        [Email input]
        [Submit: "Secure My Access"]

Step 4 (Success): Confetti + wordmark + "You're on the list"
        [Share to move up: Twitter/WhatsApp links]
```

**Transition between steps:** `AnimatePresence` with `x: 60 → 0` slide from right, old step exits `x: 0 → -60`.

**Progress indicator:** 3-dot progress (dots fill blue on complete).

---

## 4. Animation Choreography System

### Global Timing Hierarchy

```
Preloader     → 0ms     (starts immediately)
Hero load     → 2800ms  (after preloader exits)
Hero content  → staggered (see Section 1)
Section entry → whileInView with -100px margin
```

### New Animation Primitives (to add to `lib/motion.ts`)

```typescript
// Clip-path wipe reveal (right-to-left sweep)
export const clipReveal = (reduced: boolean, delay = 0) => ({
  initial: reduced ? {} : { clipPath: 'inset(0 100% 0 0)' },
  whileInView: { clipPath: 'inset(0 0% 0 0)' },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, margin: '-60px' },
});

// 3D card flip (perspective reveal)
export const flipReveal = (reduced: boolean, index = 0) => ({
  initial: reduced ? {} : { rotateY: 15, opacity: 0 },
  whileInView: { rotateY: 0, opacity: 1 },
  transition: { duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] },
  viewport: { once: true, margin: '-60px' },
  style: { perspective: 1000 },
});

// Character stagger (for letter-by-letter reveals)
export const charReveal = (reduced: boolean, index = 0) => ({
  initial: reduced ? {} : { rotateX: 90, opacity: 0 },
  animate: { rotateX: 0, opacity: 1 },
  transition: { duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] },
});

// Scroll-linked word highlight (returns a MotionValue transform)
// Used in Philosophy section — see implementation below

// Magnetic button offset (not in lib/motion.ts — inline in component)
```

### Animation Taxonomy

| Component             | Animation                 | Trigger          | Duration       |
| --------------------- | ------------------------- | ---------------- | -------------- |
| Preloader wordmark    | fadeIn                    | mount            | 1.2s           |
| Preloader line        | scaleX                    | delay 1s         | 0.8s           |
| Preloader exit        | opacity + scale           | delay 2.5s       | 0.5s           |
| Hero letters          | rotateX stagger           | mount            | 0.5s × 6 chars |
| Hero video            | opacity fade              | mount            | 3s             |
| Hero scroll indicator | pulse (infinite)          | mount            | 2s loop        |
| Section heading       | fadeUp (existing)         | inView           | 0.6s           |
| Pain points           | clipReveal stagger        | inView           | 0.8s stagger   |
| Pipeline cards        | flipReveal stagger        | inView           | 0.7s stagger   |
| HowItWorks cards      | sequential unlock         | scroll threshold | 0.4s each      |
| Why cards             | translateX (H-scroll)     | scroll progress  | continuous     |
| Who tab panels        | slide x (AnimatePresence) | click/auto       | 0.4s           |
| Philosophy words      | opacity scroll-linked     | scroll progress  | continuous     |
| Counter               | countUp                   | inView           | 2s ease-out    |
| Magnetic CTA          | translateXY               | mousemove        | spring         |
| Form steps            | slide x (AnimatePresence) | click            | 0.35s          |
| Success confetti      | burst                     | form submit      | 1.5s           |

---

## 5. Technical Implementation Plan

### Phase 1: Foundation (Dark Theme + Preloader)

**Effort:** ~1 day

1. Add dark variant CSS custom properties to `app/globals.css` (invert the 60-30-10 for dark-dominant)
2. Create `app/page.tsx` dark-mode wrapper (add `.dark` class to root or use data attribute)
3. Build `components/sections/Preloader.tsx`:
   - Fixed overlay with AnimatePresence
   - sessionStorage skip logic
   - Wordmark + line + dissolve
4. Wire preloader into `app/page.tsx` with state gate (hero renders after preloader exits)

### Phase 2: Hero Cinematic Upgrade

**Effort:** ~1.5 days

1. Add video layer to `HeroSection.tsx`:
   - `<video autoPlay muted loop playsInline>` with Tailwind `object-cover absolute inset-0`
   - Fallback: existing `AbstractBackground`
   - Lazy load via `useEffect` after component mount (avoid LCP penalty)
2. Implement letter-by-letter headline animation using `charReveal` variant
3. Add word-by-word subheadline reveal
4. Wire scroll indicator (animated chevron)

### Phase 3: Problem & Solution Section Upgrade

**Effort:** ~1.5 days

1. Replace 2-col grid in `ProblemSection.tsx` with full-width scroll text
2. Add `clipReveal` animation to pain points
3. Build `BeforeAfterSlider.tsx` component for Solution section:
   - Draggable divider with `useDrag` (from `@use-gesture/react` — check if installed, else use pointer events)
   - Mobile auto-animation on section entry
4. Wrap existing pipeline cards with `flipReveal` variant

### Phase 4: HowItWorks Sequential Unlock

**Effort:** ~0.5 days

1. Refactor `HowItWorksSection.tsx` to use per-card `useInView` with staggered `margin` thresholds
2. Add pulse ring CSS animation to number labels

### Phase 5: Why/Who Section Redesign

**Effort:** ~1.5 days

1. Build horizontal scroll track for `WhyAnaqioSection.tsx`:
   - `useScroll` on parent section + `useTransform` to drive `x` on cards container
   - Respect mobile breakpoint (vertical stack on `< lg`)
2. Rebuild `WhoItsForSection.tsx` as tab switcher:
   - Tab nav with animated underline using `layoutId` (Framer Motion shared layout)
   - `AnimatePresence` for panel transitions
   - Auto-cycle with `useInterval` (pause on hover)

### Phase 6: Philosophy Scroll Text Highlight

**Effort:** ~1 day

1. Create `components/ui/ScrollHighlightText.tsx`:
   - Splits text into word spans
   - Uses `useScroll` + `useTransform` to map scroll position to word opacity range
   - Each word: `opacity: 0.2 → 1` based on its index position in the scroll range
2. Replace existing philosophy paragraphs with `ScrollHighlightText`

### Phase 7: Social Proof Counter Section (NEW)

**Effort:** ~0.5 days

1. Create `components/sections/SocialProofCounter.tsx`
2. Build `useCountUp` hook (`hooks/use-count-up.ts`)
3. Add animated bar chart with CSS transitions
4. Add city avatar cluster (pure CSS, no library)
5. Wire into `app/page.tsx` between VisionSection and FinalCTA

### Phase 8: CTA & Form Upgrade

**Effort:** ~1.5 days

1. Build `MagneticButton.tsx` wrapper component (mousemove → spring translate)
2. Add glow ring animation to primary CTA
3. Redesign `WaitlistForm.tsx` as multi-step:
   - Step 1: Brand name
   - Step 2: Role card picker
   - Step 3: Email + submit
   - Step 4: Success (confetti + share links)
   - Install `canvas-confetti` or build CSS particle burst
4. Progress dots component

### Phase 9: Global Polish

**Effort:** ~1 day

1. Custom cursor (`components/ui/Cursor.tsx`) — spotlight circle following mouse
2. Scroll progress bar (top of viewport, thin aq-blue line)
3. Grain overlay (`components/ui/GrainOverlay.tsx`) — fixed SVG noise layer
4. Performance audit + Playwright test updates for new FCP/LCP targets

---

## 6. New Files to Create

```
components/
  sections/
    Preloader.tsx            # Preloader overlay
    SocialProofCounter.tsx   # Counter + bar chart + avatars
  ui/
    Cursor.tsx               # Custom cursor spotlight
    GrainOverlay.tsx         # Fixed grain texture
    ScrollHighlightText.tsx  # Scroll-linked word highlight
    BeforeAfterSlider.tsx    # Draggable comparison slider
    MagneticButton.tsx       # Cursor-magnetic button wrapper
    TabSwitcher.tsx           # Animated tab with shared layout

hooks/
  use-count-up.ts            # Animated number counter hook
  use-magnetic.ts            # Magnetic button offset hook (optional)

lib/
  content/
    social-proof.ts          # Counter stats, city data (mock until real data)
```

---

## 7. Files to Modify

```
app/page.tsx                    # Add Preloader, SocialProofCounter, dark theme
app/globals.css                 # Dark-dominant CSS vars, grain overlay, new keyframes
lib/motion.ts                   # Add clipReveal, flipReveal, charReveal utilities
components/sections/
  HeroSection.tsx               # Video layer, char animation, scroll indicator
  ProblemSection.tsx            # Scroll text, clipReveal pain points
  SolutionSection.tsx           # BeforeAfterSlider, flipReveal pipeline
  HowItWorksSection.tsx         # Sequential unlock per-card inView
  WhyAnaqioSection.tsx          # Horizontal scroll track
  WhoItsForSection.tsx          # Tab switcher
  PhilosophySection.tsx         # ScrollHighlightText
  VisionSection.tsx             # Background number watermark
  WaitlistSection.tsx           # Multi-step form layout
components/sections/WaitlistForm.tsx  # Multi-step form logic
```

---

## 8. Dependencies to Evaluate

| Package              | Purpose                                     | Status              |
| -------------------- | ------------------------------------------- | ------------------- |
| `framer-motion`      | Core animation (already installed v12.34.3) | ✅ Installed        |
| `@use-gesture/react` | Drag gestures for BeforeAfterSlider         | ❓ Check            |
| `canvas-confetti`    | Success confetti burst                      | ❓ Evaluate vs. CSS |
| `next/font`          | Font loading (already configured)           | ✅ Active           |

> Prefer zero new dependencies where CSS or Framer Motion can do the job.

---

## 9. Performance Considerations

### Protecting Core Web Vitals

The cinematic additions carry real performance risk. These guardrails preserve the current targets (FCP < 1.8s, LCP < 2.5s, TBT < 200ms):

| Addition          | Risk          | Mitigation                                                          |
| ----------------- | ------------- | ------------------------------------------------------------------- |
| Background video  | LCP increase  | Lazy load via useEffect, `preload="none"`, poster image             |
| Preloader         | FCP delay     | sessionStorage skip, mount immediately (0ms delay)                  |
| Letter animations | TBT increase  | Use CSS `will-change: transform` sparingly, batch with RAF          |
| Horizontal scroll | Layout shift  | `contain: layout style` on track container                          |
| Custom cursor     | JS paint cost | `position: fixed`, GPU-composited only (transform, opacity)         |
| Grain overlay     | Repaints      | `position: fixed`, `pointer-events: none`, `will-change: transform` |
| Confetti          | JS execution  | Lightweight CSS particle burst or load `canvas-confetti` async      |
| Multi-step form   | Hydration     | Keep `ssr: false` on WaitlistForm, skeleton unchanged               |

### Code-Splitting Strategy (unchanged)

All new sections/components use `dynamic()` with `ssr: true` unless client-only (ssr: false for WaitlistForm, Cursor).

```tsx
const Preloader = dynamic(() => import('@/components/sections/Preloader'), {
  ssr: false,
});
const SocialProofCounter = dynamic(
  () => import('@/components/sections/SocialProofCounter'),
  { ssr: true }
);
const Cursor = dynamic(() => import('@/components/ui/Cursor'), { ssr: false });
```

---

## 10. Accessibility Commitments

All new interactions must respect:

- `prefers-reduced-motion`: Preloader, video, char animations, magnetic button, confetti — all check `useReducedMotion()` and degrade gracefully
- `prefers-color-scheme`: Dark theme is the _design intent_, not a system preference response — the page is always dark (dark-only design)
- Keyboard navigation: Tab switcher (Who section) fully keyboard-operable with `role="tablist"` / `role="tab"` / `aria-selected`
- Custom cursor: Fallback to native cursor on touch devices (`@media (pointer: coarse)`)
- Video: `autoPlay muted loop playsInline` — muted prevents autoplay block, aria-hidden on video element
- Form multi-step: Focus moves to first input of each step on transition; announce step changes with `aria-live="polite"`
- Counter: `aria-label` with the full static number for screen readers

---

## 11. Content Updates Needed

The redesign requires minor content additions to `lib/content/`:

1. **`lib/content/social-proof.ts`** (new) — mock counter data until real analytics available
2. **`lib/content/hero.ts`** — add video source URL (or placeholder) once video asset is sourced
3. **`lib/content/solution.ts`** — add "before" stats (cost/time) for the comparison slider

---

## 12. Visual Reference Benchmarks

These sites exemplify the target aesthetic and interaction level:

| Site                   | What to Reference                                             |
| ---------------------- | ------------------------------------------------------------- |
| Bottega Veneta digital | Dark luxury, extreme whitespace, editorial typography         |
| Linear.app             | Scroll-triggered text animation, HowItWorks sequential reveal |
| Basement Studio        | Grain overlay, dark atmosphere, precision motion              |
| Apple iPhone pages     | Scroll-linked text highlight (Philosophy section)             |
| Vercel homepage        | Horizontal card track, magnetic CTAs                          |
| Stripe Radar           | Before/after comparison slider                                |
| Loom landing (2023)    | Multi-step form with cinematic transitions                    |

---

## 13. Implementation Priority (Phased Rollout)

### Sprint 1 — Maximum Impact, Minimum Risk (2–3 days)

1. ~~Preloader~~ → Dark palette + preloader (sets tone immediately)
2. Hero video layer + char animation (above-fold cinema)
3. Magnetic CTA button (conversion micro-interaction)
4. Philosophy scroll highlight (mid-funnel engagement)

### Sprint 2 — Social Proof & Conversion Lift (2 days)

5. Multi-step waitlist form (form UX)
6. Social proof counter section (FOMO)
7. Before/After solution slider

### Sprint 3 — Immersion Layer (2 days)

8. Horizontal Why scroll track
9. Who tab switcher with auto-cycle
10. HowItWorks sequential unlock

### Sprint 4 — Polish & Details (1 day)

11. Custom cursor
12. Grain overlay
13. Scroll progress bar
14. Playwright test updates

---

## 14. Open Questions

1. **Video asset:** Does a brand video exist, or do we need to source stock fabric/studio footage? (Pexels, Coverr for interim)
2. **Real waitlist numbers:** Is the "847 brands" counter a real number from Supabase, or design data?
3. **Moroccan city filtering:** Should the social proof counter show geographic breakdown (Casablanca / Marrakech / Rabat)?
4. **WhatsApp share:** Is WhatsApp the primary share vector for the Moroccan market (likely yes)?
5. **Dark-only vs. system preference:** Confirm decision to make this a dark-only design (not toggle based on prefers-color-scheme).
6. **Form fields:** Should multi-step form capture brand name and role, or keep current email-only?

---

_End of plan. Ready for Sprint 1 implementation on approval._
