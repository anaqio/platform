# Omnizya × ANAQIO — Antigravity Implementation Prompt

> Copy everything between the `---PROMPT START---` and `---PROMPT END---` delimiters
> verbatim into Gemini. No preamble needed.

---PROMPT START---

## Context: Who You Are Working For

You are implementing a cinematic landing page for **ANAQIO** — a high-end AI fashion studio platform for the Moroccan market. ANAQIO lets fashion brands generate photorealistic campaign visuals, lookbooks, and luxury videos from garment uploads in minutes instead of weeks.

This is a **waitlist / whitelisting page**. The single conversion goal is: a user submits their email to join the waitlist.

The page lives at `app/page.tsx` in a **Next.js 15 App Router** project using **React 19**, **TypeScript**, **Tailwind CSS**, **shadcn/ui (New York style)**, and **Framer Motion v12**. The package manager is `bun`. All commands run as `bun dev`, `bun run lint`, etc.

---

## The Design System You Must Respect (Never Override These)

### Brand Colors — use Tailwind class names only, never hex values

```
aq-blue     #2563EB   → text-aq-blue / bg-aq-blue
aq-purple   #7C3AED   → text-aq-purple / bg-aq-purple
aq-white    #F8FAFC
aq-ink      #0F172A
aq-slate    #334155
Gradient:   from-[#3F57AF] via-[#6049A8] to-[#6F47A7]
```

Semantic tokens (CSS variables, use these for all layout surfaces):

```
background / foreground
card / card-foreground
border / muted / muted-foreground
primary / secondary / accent
```

Utility classes that already exist in `app/globals.css`:

```
.text-brand-gradient   — gradient text (blue → purple)
.bg-brand-gradient     — same as background
.glass                 — frosted glass, backdrop-blur-xl, bg-card/60
.glass-strong          — backdrop-blur-2xl, bg-card/80
.glass-card            — backdrop-blur-lg, bg-card/40
.perspective-grid      — 3D animated grid (uses CSS @keyframe grid-pan)
.animated-grid         — SVG grid background, 18s drift loop
.abstract-blob         — blob element with --blob-x/y/size/color/parallax CSS vars
.gravitate             — uses --grav-x/y custom props for mouse parallax
```

### Typography — font families

```
font-display    → Cormorant (display headings, editorial)
font-editorial  → Instrument Serif (quotes, italic accents)
font-ui         → DM Sans (UI, buttons)
font-body       → DM Sans (body copy)
font-label      → DM Sans (labels, eyebrows)
```

Letter-spacing tokens: `tracking-display` (0.01em), `tracking-editorial` (0.04em), `tracking-label` (0.3em), `tracking-wide-xl` (0.4em)

### The 60-30-10 Color Rule

The page is **dark-dominant** for the cinematic redesign:

- **60% dominant** — deep background (`hsl(220 25% 7%)` approximately, near-black blue-black)
- **30% surface** — warm charcoal glass surfaces for cards and containers
- **10% accent** — `aq-blue` only, used as the single light source (CTAs, highlights, ruled lines)

> Note: The existing `--background` CSS variable is a warm cream/parchment. For the cinematic redesign, the page root gets `class="dark"` on `<html>` or a data attribute, enabling a dark variant. The existing `.dark` shadcn variables already define darker surfaces. Use those.

---

## The Design Principle You Are Implementing: Omnizya

Omnizya is a **free-atom composition** philosophy. Its core rule:

> Every visual element — a headline, a number, a line, an image, a label — is an independent atom, positioned freely in the viewport canvas, animated individually relative to scroll. Nothing is grouped inside a "card" or "flex row" by default. Visual freedom lives in CSS. Semantic integrity lives in the DOM.

### The Four Layers (never collapse them)

| Layer          | Purpose                               | Technology                                        |
| -------------- | ------------------------------------- | ------------------------------------------------- |
| **Semantic**   | HTML hierarchy, SEO, accessibility    | Correct HTML elements, ARIA, `sr-only`            |
| **Visual**     | Composition, free spatial positioning | `position: absolute`, `transform`, Tailwind       |
| **Kinetic**    | Scroll choreography per atom          | Framer Motion `useScroll` + `useTransform`        |
| **Resilience** | Graceful degradation                  | `useReducedMotion`, `useDeviceTier`, CSS `@media` |

### Atom Positioning Modes

Every atom uses one of these four modes. Choose per element:

```
PINNED    — position: absolute, fixed in section canvas, no JS needed
DRIFTING  — position: absolute + scroll-driven transform via useTransform
ANCHORED  — position: relative in normal flow + transform offset (use for primary content to preserve height)
FIXED     — position: fixed, viewport-relative (grain, cursor, progress bar only)
```

### Z-axis vocabulary (strict — never invent new z values)

```
z-0    atmosphere (gradients, grain, video bg)
z-10   secondary visual atoms (decorative text, lines, shapes)
z-20   primary content atoms (headlines, body, images)
z-30   interactive atoms (buttons, links, inputs)
z-40   floating overlays (tooltips)
z-50   global fixed (cursor, preloader, progress bar)
```

### Choreography rules

1. Each atom gets its own `useTransform` with a **unique scroll input range** — NOT a JS `delay`.
2. Stagger = offset start points in the scroll timeline (e.g. `[0, 0.3]`, `[0.05, 0.35]`, `[0.1, 0.4]`)
3. **Only `transform` and `opacity` are scroll-driven.** Never animate `width`, `height`, `top`, `left`, or `background` via scroll.
4. Primary atoms rise `60px`. Secondary atoms rise `30px`. Atmospheric atoms drift `120px+` or parallax.
5. Fast scrollers get compressed stagger. Slow scrollers get luxurious sequencing. This is automatic with range-based stagger.

### The 60px Rule

```typescript
// Primary atoms (h1, h2, primary CTA)
y: useTransform(scrollYProgress, [0.0, 0.35], ['60px', '0px']);

// Secondary atoms (body copy, sub-labels)
y: useTransform(scrollYProgress, [0.05, 0.4], ['30px', '0px']);

// Atmospheric atoms (large decorative numbers, bg images)
y: useTransform(scrollYProgress, [0, 1], ['0%', '-20%']); // continuous parallax
```

### Semantic rules (non-negotiable for SEO)

- DOM source order = logical reading order always.
- Visual position is CSS-only. A visually right-positioned image is `position: absolute; right: 0` but appears after its caption in the DOM.
- Every section has `aria-labelledby` pointing to its heading.
- If a heading is visually displayed as a decorative atom (aria-hidden), a duplicate `sr-only` heading exists in normal flow as the semantic anchor.
- Decorative atoms: `aria-hidden="true"` + `data-decorative` attribute.
- All content atoms: `data-atom` attribute (for noscript CSS fallback).

### Resilience tiers

```typescript
// hooks/use-device-tier.ts  ← you must create this
export function useDeviceTier(): 'high' | 'mid' | 'low' {
  const [tier, setTier] = useState<'high' | 'mid' | 'low'>('high');
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as any).deviceMemory ?? 4;
    const conn = (navigator as any).connection?.effectiveType ?? '4g';
    if (cores <= 2 || memory <= 1 || conn === '2g' || conn === 'slow-2g')
      setTier('low');
    else if (cores <= 4 || memory <= 2 || conn === '3g') setTier('mid');
  }, []);
  return tier;
}
```

- `tier === 'high'` + `!reduced` → full choreography
- `tier === 'mid'` OR `reduced` → opacity-only `whileInView`, no parallax, no clip-path
- `tier === 'low'` → static layout, `position: static` on all atoms, normal flow

Every choreography hook must check:

```typescript
const reduced = useReducedMotion();
const tier = useDeviceTier();
const animated = !reduced && tier !== 'low';
```

### `will-change` discipline

Apply `will-change: transform` ONLY to atoms that are **continuously scroll-driven and currently in the viewport**. Remove it after animation completes. Never apply statically to all atoms. Budget: max 8 `will-change` elements simultaneously.

### Performance constraints (Playwright tests enforce these)

- FCP < 1.8s
- LCP < 2.5s
- TBT < 200ms

All new sections use `dynamic()` import with `ssr: true`. Client-only components use `ssr: false`.

---

## Current Architecture to Respect

### File structure (key paths)

```
app/
  page.tsx                    ← orchestrates sections, uses dynamic imports
  globals.css                 ← custom animations, CSS vars, glass utilities
  layout.tsx                  ← sets <html> fonts, metadata

components/
  sections/
    HeroSection.tsx            ← 'use client', has useScroll parallax image
    ScrollTriggered.tsx        ← wraps all sections in ParallaxSection (useScroll y/opacity)
    ProblemSection.tsx
    SolutionSection.tsx
    HowItWorksSection.tsx
    WhyAnaqioSection.tsx
    WhoItsForSection.tsx
    PhilosophySection.tsx
    VisionSection.tsx
    FinalCTA.tsx
    WaitlistSection.tsx
    WaitlistForm.tsx           ← ssr: false, client-only form
  ui/
    section.tsx                ← <Section> (min-h-screen flex flex-col justify-center px-4 py-24)
    section-header.tsx         ← <SectionHeader>, <GradientText>
    feature-card.tsx           ← <FeatureCard> with icon/number label variants
    button.tsx                 ← shadcn Button, variants: brand / ghost / hero / heroOutline
    scroll-link.tsx            ← smooth scroll anchor
  layout/
    Header.tsx
    Footer.tsx

lib/
  motion.ts                   ← fadeUp / fadeUpCard / fadeIn / slideInLeft + ease constant
  content/
    hero.ts / problem.ts / solution.ts / how-it-works.ts /
    why-anaqio.ts / who-its-for.ts / vision.ts / waitlist.ts /
    final-cta.ts / types.ts

hooks/
  use-multi-step-form.ts

tailwind.config.ts            ← brand colors, font families, letter-spacing tokens
```

### Current `app/page.tsx` (read-only reference)

```tsx
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { ScrollTriggered } from '@/components/sections/ScrollTriggered';

const ProblemSection = dynamic(..., { ssr: true });
// ... all other sections dynamically imported

export default function Home() {
  return (
    <main id="main-content" className="relative">
      <Header />
      <ScrollTriggered />
    </main>
  );
}
```

### Current `ScrollTriggered.tsx` — the section orchestrator

Wraps every section in `<ParallaxSection>` which applies a **section-level** `y: -5%→5%` + `opacity: 0.6→1→0.6` via `useScroll`. This is the existing "scroll awareness" layer.

**You will keep this wrapper** but add atom-level choreography INSIDE each section component. The section-level parallax and atom-level choreography are additive — they compose.

### Current `lib/motion.ts`

```typescript
export const ease = [0.16, 1, 0.3, 1] as const;  // custom cubic-bezier

export const fadeUp = (reduced, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, delay, ease },
});

export const fadeUpCard = (reduced, index = 0) => ({...});  // stagger cards
export const fadeIn = (reduced, delay = 0) => ({...});       // opacity only
export const slideInLeft = (reduced, index = 0) => ({...});  // x: -16 → 0
```

**You must extend `lib/motion.ts`** with these new primitives:

```typescript
// Clip-path wipe from right to left
export const clipReveal = (reduced: Reduced, delay = 0) => ({
  initial: reduced ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  whileInView: { clipPath: 'inset(0 0% 0 0)', opacity: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.9, delay, ease },
});

// 3D card flip on Y axis
export const flipReveal = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { rotateY: 20, opacity: 0, scale: 0.97 },
  whileInView: { rotateY: 0, opacity: 1, scale: 1 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, delay: index * 0.12, ease },
  style: { perspective: '1200px', transformStyle: 'preserve-3d' as const },
});

// Character-level rotate-X reveal (for headline letters)
export const charReveal = (reduced: Reduced, index = 0) => ({
  initial: reduced ? false : { rotateX: 80, opacity: 0, y: 12 },
  animate: { rotateX: 0, opacity: 1, y: 0 },
  transition: { duration: 0.55, delay: index * 0.045, ease },
  style: {
    display: 'inline-block',
    transformOrigin: 'bottom center',
    perspective: '600px',
  },
});

// Scatter converge — atom starts offset from multiple axes
export const scatterIn = (reduced: Reduced, x = 0, y = 60, delay = 0) => ({
  initial: reduced ? false : { x, y, opacity: 0 },
  whileInView: { x: 0, y: 0, opacity: 1 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.8, delay, ease },
});
```

---

## Section-by-Section Implementation Specification

Implement each section as an **Omnizya atom canvas**. For each section:

- `<section>` is `position: relative` and `min-height: 100dvh`
- A `<h2 className="sr-only">` exists for semantic SEO backbone
- Each visible atom is positioned with `position: absolute` (PINNED/DRIFTING) or `position: relative` (ANCHORED)
- Each atom has `data-atom` attribute
- Decorative atoms have `aria-hidden="true"` + `data-decorative`
- Choreography uses `useScroll({ target: sectionRef, offset: ['start end', 'end start'] })`

---

### SECTION: Hero — "The Frame"

**File:** `components/sections/HeroSection.tsx`

**Canvas:** `h-[100dvh]` relative container. Four depth layers:

```
z-0  → video loop (or AbstractBackground fallback if no video)
z-10 → perspective-grid overlay (opacity-15)
z-20 → content atoms (headline, subheadline, cta, eyebrow)
z-30 → interactive atoms (buttons)
z-50 → grain (handled globally in layout)
```

**Atom choreography (all using `animate` not `whileInView` — mount-driven, not scroll):**

```
Eyebrow label:     x: -24→0, opacity: 0→1   (0.6s, delay 0.15s)
"ANAQIO" wordmark: charReveal per letter     (delay 0.2s + i*0.04s)
Horizontal rule:   scaleX: 0→1 from left     (0.9s, delay 0.65s)
Subheadline:       word-by-word y: 20→0      (delay 0.7s + w*0.06s per word)
CTA buttons:       y: 20→0, opacity: 0→1     (0.6s, delay 1.0s)
Support line:      opacity: 0→1              (0.5s, delay 1.3s)
Model image:       y: 30→0, opacity: 0→1     (1.2s, delay 0.4s)
```

**Scroll parallax (existing, keep):**

- Image: `y = useTransform(scrollYProgress, [0,1], ['0%','14%'])`
- Add: headline atoms slowly drift UP as hero scrolls away: `y = useTransform(scrollYProgress, [0,1], ['0px', '-40px'])`

**Headline atom implementation:**

```tsx
// Split "ANAQIO" into chars, animate each
{
  'ANAQIO'.split('').map((char, i) => (
    <motion.span
      key={i}
      data-atom
      aria-hidden="true"
      {...(animated ? charReveal(reduced, i) : {})}
      className="inline-block font-display font-light"
      style={{ fontSize: 'clamp(4rem, 10vw, 11rem)', letterSpacing: '-0.02em' }}
    >
      {char}
    </motion.span>
  ));
}
// Semantic duplicate for screen readers / SEO:
<h1 className="sr-only">
  ANAQIO — Visual Infrastructure for Fashion Commerce
</h1>;
```

**Subheadline word-by-word:**

```tsx
const words =
  'Transform garments into photorealistic campaign visuals in minutes.'.split(
    ' '
  );
{
  words.map((word, i) => (
    <motion.span
      key={i}
      data-atom
      initial={animated ? { y: 20, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.7 + i * 0.06, ease }}
      className="mr-[0.3em] inline-block"
    >
      {word}
    </motion.span>
  ));
}
```

**Scroll indicator atom:**

```tsx
// Animated chevron, absolute positioned bottom-8 left-1/2 -translate-x-1/2
<motion.div
  data-atom
  aria-hidden="true"
  animate={{ y: [0, 6, 0] }}
  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
>
  <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
</motion.div>
```

---

### SECTION: Problem — "The Industry's Silent Failure"

**File:** `components/sections/ProblemSection.tsx`

**Layout:** Full-width atom canvas. Remove the 2-col grid wrapper. Place each element as an atom.

**Composition:**

```
[Eyebrow]         — PINNED, top-[10%] left-[8.33%]
[Large statement] — ANCHORED at top-[18%] left-[8.33%], Cormorant clamp(3rem,6vw,7rem)
[Accent line]     — PINNED horizontal rule, top-[42%] left-[8.33%] w-1/4 h-px
[Pain points]     — 4 atoms, each DRIFTING, staggered clip-path reveals
[Atmospheric "?"] — PINNED, right-[5%] top-[15%], Cormorant 18rem, opacity-[0.03], aria-hidden
```

**Pain point atoms** (replace card grid — each is a standalone atom):

```tsx
{
  ProblemSectionText.painPoints.map((point, i) => (
    <motion.div
      key={i}
      data-atom
      {...(animated ? clipReveal(reduced, i * 0.12) : {})}
      className="flex items-start gap-4 border-l border-aq-blue/30 pl-4"
      style={{
        position: 'absolute',
        top: `${48 + i * 13}%`,
        left: '8.33%',
        maxWidth: '38ch',
      }}
    >
      <point.icon
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-aq-blue"
        aria-hidden="true"
      />
      <span className="font-label text-xs uppercase tracking-label text-muted-foreground">
        {point.label}
      </span>
    </motion.div>
  ));
}
```

**The large statement atom:**

```tsx
<motion.h2
  data-atom
  aria-hidden="true"
  style={
    animated
      ? {
          y: headlineY, // useTransform(scrollYProgress, [0, 0.4], ['60px', '0px'])
          opacity: headlineOpacity,
          fontSize: 'clamp(2.8rem, 5.5vw, 7rem)',
        }
      : { fontSize: 'clamp(2.8rem, 5.5vw, 7rem)' }
  }
  className="absolute left-[8.33%] top-[18%] z-20 max-w-[14ch] font-display font-light leading-[0.95] text-foreground"
>
  Fashion moves fast.
  <br />
  <em className="text-brand-gradient">Production doesn&apos;t.</em>
</motion.h2>
```

---

### SECTION: Solution — "The Transformation"

**File:** `components/sections/SolutionSection.tsx`

**Layout:** Keep the 3-card pipeline BUT replace card wrappers with atom clusters.

**Each pipeline stage is NOT a `<Card>` — it is a cluster of atoms:**

```
[Stage number atom]   — PINNED, top-[8%], Cormorant 5rem, opacity-[0.15], aria-hidden
[Stage label atom]    — ANCHORED
[Stage title atom]    — DRIFTING, flipReveal(reduced, index)
[Stage body atom]     — DRIFTING, fadeUp(reduced, delay)
[Arrow atom]          — PINNED between stages, animated infinite x drift
```

**Add:** Before the pipeline, add a **stat contrast strip** (two inline atoms side by side):

```tsx
// Left: traditional
<motion.div data-atom {...scatterIn(reduced, -40, 0, 0)} className="...">
  <span className="font-display text-[clamp(2rem,4vw,4.5rem)] text-muted-foreground/30 line-through">14 days</span>
  <span className="font-label text-xs tracking-label text-muted-foreground/40">Traditional shoot</span>
</motion.div>

// Right: ANAQIO
<motion.div data-atom {...scatterIn(reduced, 40, 0, 0.1)} className="...">
  <span className="font-display text-[clamp(2rem,4vw,4.5rem)] text-aq-blue">2 hours</span>
  <span className="font-label text-xs tracking-label text-aq-blue/60">With ANAQIO</span>
</motion.div>
```

**Pipeline cards:** Wrap each card atom cluster in `flipReveal`:

```tsx
{
  SolutionSectionText.pipeline.map((stage, i) => (
    <motion.article
      key={stage.label}
      data-atom
      aria-label={stage.label}
      {...(animated ? flipReveal(reduced, i) : {})}
      className="flex flex-col gap-3" // ← no card background, no border, just atoms
    >
      <span
        aria-hidden="true"
        className="font-display text-5xl font-light text-aq-blue/20"
      >
        {String(i + 1).padStart(2, '0')}
      </span>
      <h3 className="font-display text-[clamp(1.4rem,2.5vw,2.2rem)] font-light">
        {stage.title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-muted-foreground">
        {stage.body}
      </p>
    </motion.article>
  ));
}
```

---

### SECTION: HowItWorks — "The Process"

**File:** `components/sections/HowItWorksSection.tsx`

**Omnizya upgrade:** Each of the 4 steps is a **sequentially unlocking atom cluster**.

Each step card has two visual states:

- **Locked:** `opacity: 0.2, filter: blur(4px)` — atom not yet in view
- **Unlocked:** `opacity: 1, filter: blur(0)` — atom enters view

Implement with individual `useInView` refs per card, each with progressively larger `margin` (earlier triggering):

```tsx
const stepRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
const stepsInView = stepRefs.map((ref, i) =>
  useInView(ref, { once: true, margin: `-${20 + i * 15}%` })
);

// Each step:
<motion.div
  ref={stepRefs[i]}
  data-atom
  animate={
    stepsInView[i]
      ? { opacity: 1, filter: 'blur(0px)', y: 0 }
      : { opacity: 0.15, filter: 'blur(6px)', y: 20 }
  }
  transition={{ duration: 0.7, ease }}
>
  {/* Number label with pulse ring on unlock */}
  <motion.span
    animate={stepsInView[i] ? { boxShadow: '0 0 0 8px rgba(37,99,235,0)' } : {}}
    transition={{ duration: 1, ease: 'easeOut' }}
    className="font-display text-4xl font-light text-aq-blue"
  >
    {step.num}
  </motion.span>
  ...
</motion.div>;
```

---

### SECTION: WhyANAQIO — "The Proof"

**File:** `components/sections/WhyAnaqioSection.tsx`

**Omnizya upgrade:** Remove `<FeatureCard>` wrappers. Each feature is a **free atom cluster** with independent scroll entry.

5 feature atom clusters positioned in an organic, non-grid arrangement on desktop:

```
Feature 1: left-[5%]  top-[15%]   (DRIFTING)
Feature 2: left-[38%] top-[8%]    (DRIFTING, delay +0.08s)
Feature 3: left-[68%] top-[20%]   (DRIFTING, delay +0.16s)
Feature 4: left-[15%] top-[55%]   (DRIFTING, delay +0.24s)
Feature 5: left-[52%] top-[60%]   (DRIFTING, delay +0.32s)
```

On mobile (`< lg`): `position: static`, display as vertical list, `gap-8`.

Each cluster:

```tsx
<motion.div
  data-atom
  style={
    animated ? { position: 'absolute', left: pos.x, top: pos.y, y: atomY } : {}
  }
  className="max-w-[22ch]"
>
  <point.icon className="mb-3 h-5 w-5 text-aq-blue" aria-hidden="true" />
  <h3 className="font-display text-[clamp(1.1rem,1.8vw,1.6rem)] font-light leading-tight">
    {point.title}
  </h3>
  <p className="mt-1.5 font-body text-xs leading-relaxed text-muted-foreground">
    {point.body}
  </p>
</motion.div>
```

Atmospheric atom: Large "WHY" Cormorant text, `20vw` size, `opacity-[0.025]`, centered behind features, `aria-hidden`.

---

### SECTION: WhoItsFor — "The Audience"

**File:** `components/sections/WhoItsForSection.tsx`

**Omnizya upgrade:** Replace 4-card grid with an **animated tab system where each panel is an atom canvas**.

Tab nav:

```tsx
<div role="tablist" className="flex gap-8 border-b border-border">
  {audiences.map((a, i) => (
    <button
      key={a.id}
      role="tab"
      aria-selected={active === i}
      onClick={() => setActive(i)}
      className="relative pb-3 font-label text-xs uppercase tracking-label text-muted-foreground transition-colors aria-selected:text-foreground"
    >
      {a.label}
      {/* Shared layout underline — slides between tabs */}
      {active === i && (
        <motion.div
          layoutId="tab-underline"
          className="absolute bottom-0 left-0 h-px w-full bg-aq-blue"
          transition={{ duration: 0.3, ease }}
        />
      )}
    </button>
  ))}
</div>
```

Panel atom canvas:

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={active}
    initial={animated ? { opacity: 0, x: 40 } : false}
    animate={{ opacity: 1, x: 0 }}
    exit={animated ? { opacity: 0, x: -40 } : {}}
    transition={{ duration: 0.35, ease }}
    className="relative min-h-[28rem] pt-12"
  >
    {/* Large audience icon atom — PINNED right */}
    <motion.div
      aria-hidden="true"
      data-atom
      data-decorative
      className="text-aq-blue/8 absolute right-0 top-0 text-[clamp(6rem,12vw,14rem)]"
    >
      <CurrentAudience.icon />
    </motion.div>

    {/* Title atom */}
    <h3
      data-atom
      className="font-display text-[clamp(2rem,4vw,4rem)] font-light"
    >
      {audience.title}
    </h3>

    {/* Body atom */}
    <p
      data-atom
      className="mt-4 max-w-[40ch] font-body text-sm leading-relaxed text-muted-foreground"
    >
      {audience.body}
    </p>

    {/* Feature list atoms — staggered slideInLeft */}
    {audience.features.map((f, i) => (
      <motion.div
        key={i}
        data-atom
        {...slideInLeft(reduced, i)}
        className="mt-3 flex items-center gap-3"
      >
        <div className="h-1 w-1 rounded-full bg-aq-blue" aria-hidden="true" />
        <span className="font-label text-xs tracking-label text-foreground/70">
          {f}
        </span>
      </motion.div>
    ))}
  </motion.div>
</AnimatePresence>
```

Auto-cycle: `useInterval(() => setActive(a => (a + 1) % audiences.length), 4000)` — pause on hover.

---

### SECTION: Philosophy — "The Belief"

**File:** `components/sections/PhilosophySection.tsx`

**Omnizya upgrade:** Scroll-linked word highlight — words transition from `opacity-20` to `opacity-100` as user scrolls through the section.

```tsx
// Create a scroll-highlight text component inline
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start center', 'end center'],
});

const words = philosophyText.split(' ');
const wordCount = words.length;

return words.map((word, i) => {
  const start = i / wordCount;
  const end = (i + 3) / wordCount; // each word fully lit over a 3-word window
  const wordOpacity = useTransform(scrollYProgress, [start, end], [0.18, 1]);

  return (
    <motion.span
      key={i}
      data-atom
      style={animated ? { opacity: wordOpacity } : {}}
      className="mr-[0.28em] inline-block font-display text-[clamp(1.6rem,3vw,3rem)] font-light leading-tight text-foreground"
    >
      {word}
    </motion.span>
  );
});
```

Atmospheric atom: Single large period `.` at `15rem`, `opacity-[0.04]`, far right, `aria-hidden`.

---

### SECTION: Vision — "The Future"

**File:** `components/sections/VisionSection.tsx`

**Omnizya upgrade:** Add atmospheric large number "2027" as PINNED background atom.

```tsx
// Background watermark atom
<span
  data-atom
  data-decorative
  aria-hidden="true"
  className="pointer-events-none absolute inset-x-0 top-[5%] z-0 select-none text-center font-display font-light text-foreground/[0.03]"
  style={{ fontSize: 'clamp(8rem, 20vw, 22rem)' }}
>
  2027
</span>
```

Vision points: Replace `slideInLeft` delay-based stagger with scroll-range stagger:

```tsx
// Each point starts rising at a different scroll threshold
const pointY = (i: number) =>
  useTransform(
    scrollYProgress,
    [0.1 + i * 0.08, 0.45 + i * 0.08],
    ['30px', '0px']
  );
```

---

### SECTION: FinalCTA — "The Door"

**File:** `components/sections/FinalCTA.tsx`

**Omnizya upgrade:** Magnetic primary button + glow ring.

**Magnetic button:**

```tsx
// components/ui/MagneticButton.tsx  ← new file
'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

export function MagneticButton({
  children,
  className,
  strength = 0.35,
  ...props
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 400, damping: 30 });
  const y = useSpring(rawY, { stiffness: 400, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) * strength);
    rawY.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

**Disable magnetic on low-end (tier !== 'high') and touch devices.**

CTA layout as atom canvas:

```tsx
<section
  ref={sectionRef}
  aria-labelledby="cta-heading"
  className="relative flex min-h-[60dvh] items-center justify-center"
>
  <h2 id="cta-heading" className="sr-only">
    Get Early Access
  </h2>

  {/* Atmospheric glow */}
  <div
    data-atom
    data-decorative
    aria-hidden="true"
    className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-aq-blue/10 blur-[100px]"
  />

  {/* Pre-headline atom */}
  <motion.p
    data-atom
    {...fadeIn(reduced, 0)}
    className="absolute top-[20%] font-label text-xs uppercase tracking-label text-muted-foreground"
  >
    {FinalCTAText.headline.pre}
  </motion.p>

  {/* Headline atom */}
  <motion.h2
    data-atom
    aria-hidden="true"
    style={
      animated
        ? {
            y: headlineY,
            opacity: headlineOpacity,
            fontSize: 'clamp(2.5rem,5vw,6rem)',
          }
        : { fontSize: 'clamp(2.5rem,5vw,6rem)' }
    }
    className="absolute text-center font-display font-light leading-[0.95]"
  >
    <span className="text-brand-gradient">
      {FinalCTAText.headline.gradient}
    </span>
  </motion.h2>

  {/* Magnetic CTA atom */}
  <motion.div
    data-atom
    {...fadeUp(reduced, 0.2)}
    className="absolute bottom-[22%]"
  >
    <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
      <Button
        variant="brand"
        asChild
        className="h-14 rounded-full px-10 text-sm font-bold uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(37,99,235,0.3)]"
      >
        <ScrollLink targetId="waitlist">{FinalCTAText.cta.primary}</ScrollLink>
      </Button>
    </MagneticButton>
  </motion.div>
</section>
```

---

### SECTION: Waitlist — "The Stage"

**File:** `components/sections/WaitlistSection.tsx` + `WaitlistForm.tsx`

**Omnizya upgrade:** Multi-step form as atom canvas with cinematic step transitions.

The outer section remains largely structural (it needs to render the form server-side for SEO fallback). Inner form becomes a 3-step atom sequence.

**Step transitions:**

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={step}
    initial={animated ? { opacity: 0, x: 50 } : false}
    animate={{ opacity: 1, x: 0 }}
    exit={animated ? { opacity: 0, x: -50 } : {}}
    transition={{ duration: 0.32, ease }}
  >
    {step === 1 && <StepBrandName />}
    {step === 2 && <StepRole />}
    {step === 3 && <StepEmail />}
    {step === 4 && <StepSuccess />}
  </motion.div>
</AnimatePresence>
```

**Step 1 — Brand name:**

```tsx
// Large minimal input, Cormorant placeholder
<input
  className="w-full border-0 border-b border-border bg-transparent pb-3 font-display text-[clamp(1.4rem,2.5vw,2.2rem)] text-foreground transition-colors placeholder:text-muted-foreground/30 focus:border-aq-blue focus:outline-none"
  placeholder="Your brand name..."
  autoFocus
/>
```

**Step 2 — Role picker (3 card atoms):**

```tsx
{
  roles.map((role, i) => (
    <motion.button
      key={role.id}
      data-atom
      {...(animated ? flipReveal(reduced, i) : {})}
      onClick={() => {
        setRole(role.id);
        nextStep();
      }}
      className={cn(
        'rounded-xl border border-border p-5 text-left transition-all hover:-translate-y-0.5 hover:border-aq-blue/50 hover:bg-card',
        selected === role.id && 'border-aq-blue bg-aq-blue/5'
      )}
    >
      <role.icon className="mb-3 h-4 w-4 text-aq-blue" aria-hidden="true" />
      <h4 className="font-ui text-sm font-medium">{role.label}</h4>
    </motion.button>
  ));
}
```

**Step 4 — Success:**

```tsx
// CSS confetti burst (no library) — 12 tiny absolute divs animate outward on mount
// Center wordmark + "You're on the list."
<motion.div
  initial={{ scale: 0.8, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
>
  <AnaqioLogo className="mx-auto mb-6 h-8 w-auto text-aq-blue" />
  <h3 className="font-display text-[clamp(1.8rem,3vw,3rem)] font-light">
    You&apos;re on the list.
  </h3>
  <p className="mt-2 font-body text-sm text-muted-foreground">
    We&apos;ll reach out when your studio access is ready.
  </p>
</motion.div>
```

**Progress dots:**

```tsx
<div
  className="flex items-center gap-2"
  role="progressbar"
  aria-valuenow={step}
  aria-valuemax={3}
>
  {[1, 2, 3].map((s) => (
    <motion.div
      key={s}
      animate={{
        backgroundColor: step >= s ? 'var(--aq-blue)' : 'var(--border)',
        scale: step === s ? 1.2 : 1,
      }}
      transition={{ duration: 0.2 }}
      className="h-1.5 w-1.5 rounded-full"
    />
  ))}
</div>
```

---

## New Files to Create

```
hooks/use-device-tier.ts              ← useDeviceTier hook (see spec above)
components/ui/MagneticButton.tsx      ← Magnetic hover button (see spec above)
components/ui/GrainOverlay.tsx        ← Fixed grain texture layer
```

**GrainOverlay:**

```tsx
// components/ui/GrainOverlay.tsx
export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 select-none opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '256px 256px',
      }}
    />
  );
}
```

Wire `<GrainOverlay />` into `app/layout.tsx` after `{children}`.

---

## Global Choreography Rules for All Sections

```typescript
// Standard scroll hook setup — use this pattern in every section:
const sectionRef = useRef<HTMLElement>(null);
const reduced = useReducedMotion();
const tier = useDeviceTier();
const animated = !reduced && tier !== 'low';

const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start end', 'end start'],
});
```

**Scroll range cheatsheet (for `offset: ['start end', 'end start']`):**

- `[0, X]` = atom animates AS section enters from bottom
- `[X, 0.5]` = atom animates as section reaches center
- `[0.6, 1]` = atom exits as section leaves the top

---

## Accessibility Checklist (enforce on every section)

- [ ] `<section aria-labelledby="...">` on every section
- [ ] `id` matching the `aria-labelledby` on the heading
- [ ] `sr-only` heading exists if the visual heading is `aria-hidden="true"`
- [ ] `data-atom` on every atom element
- [ ] `aria-hidden="true"` + `data-decorative` on all decorative atoms
- [ ] All animated motion wraps check `useReducedMotion()`
- [ ] Tab switcher (WhoItsFor): `role="tablist"`, `role="tab"`, `aria-selected`
- [ ] Multi-step form: `aria-live="polite"` on step container, focus moves to first input per step
- [ ] MagneticButton: Disabled on `pointer: coarse` (touch) via CSS `@media (pointer: coarse) { transform: none }`
- [ ] Images: explicit `width` + `height`, `alt`, `loading="lazy"` (except LCP image: `loading="eager" fetchpriority="high"`)

---

## What NOT to Do

```
❌  Do not wrap groups of atoms in <FeatureCard> for visual grouping
❌  Do not use `delay: X` for stagger — use offset scroll ranges
❌  Do not animate `width`, `height`, `top`, `left` — only `transform` + `opacity`
❌  Do not add will-change: transform to every element — budget: 8 max simultaneously
❌  Do not remove scroll-snap from ScrollTriggered.tsx (keep it)
❌  Do not remove the ParallaxSection wrapper (keep section-level parallax)
❌  Do not use inline px values for atom positions — use % or calc(N/12 * 100%)
❌  Do not use static `text-5xl` on display headlines — use clamp()
❌  Do not create new Tailwind config colors — use existing aq-* tokens
❌  Do not create new z-index values outside the defined vocabulary (0,10,20,30,40,50)
❌  Do not break existing dynamic() imports in page.tsx
❌  Do not use `position: fixed` for section content atoms
❌  Do not use font-size smaller than 11px for any visible text (accessibility)
```

---

## Output Format

For each section file you modify, output:

1. The complete file (not a diff)
2. Annotated comments on each atom: `// ATOM: [type] [mode] [tier]`
3. Any new utility/hook files in full

After all section files, output in order:

1. Updated `lib/motion.ts` with new primitives appended
2. `hooks/use-device-tier.ts` (new)
3. `components/ui/MagneticButton.tsx` (new)
4. `components/ui/GrainOverlay.tsx` (new)
5. Diff for `app/layout.tsx` (add GrainOverlay)

Begin with the Hero section. Do not abbreviate or omit code.

---PROMPT END---
