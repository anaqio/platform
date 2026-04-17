# Omnizya Web Design Principle

**Version:** 1.0
**Date:** 2026-03-10
**Project:** ANAQIO

---

## What Is Omnizya?

Omnizya is a composition philosophy for web interfaces where every visual element — a headline, a number, a line, an image crop, a punctuation mark — exists as a **free atom** in the viewport's coordinate space. Nothing is containerized by default. Elements are not "inside" a card, not "part of" a section block, not "children of" a flex row. They breathe independently, positioned by intention, and animate individually in response to scroll.

The name combines:

- **Omni** — all-encompassing, each element owns its full dimensional freedom
- **Izya** — from the Arabic root meaning "to distribute / to spread out" (إعطاء, iZaʿ)

The result is visual compositions that feel like **editorial spreads** and **cinematic frames** rather than assembled UI components — while remaining semantically correct HTML and performant on commodity hardware.

---

## The Core Tension

Every web design principle must resolve a fundamental tension. Omnizya resolves:

> **Visual freedom** ←→ **Structural integrity**

Traditional component-based layout sacrifices visual freedom for structural predictability. Omnizya achieves both by separating concerns across layers:

| Layer          | Job                                           | Technology                                    |
| -------------- | --------------------------------------------- | --------------------------------------------- |
| **Semantic**   | Define meaning, hierarchy, accessibility, SEO | HTML elements, ARIA                           |
| **Visual**     | Express composition, spatial relationships    | CSS transforms, absolute positioning          |
| **Kinetic**    | Choreograph motion relative to scroll         | Framer Motion, `useTransform`                 |
| **Resilience** | Degrade gracefully on constrained devices     | `@media`, `prefers-reduced-motion`, `contain` |

These layers operate independently. The semantic layer never depends on the visual layer. A screen reader or a search crawler sees clean, ordered HTML. A high-end device with a fast GPU sees floating atoms drifting through cinematic space. A low-end Android on 3G sees a clean, readable, fast-loading page.

---

## Principle 1: The Atom

**Every element is an atom. Atoms are indivisible.**

An atom is the smallest meaningful visual unit that can be independently positioned and animated. It is not a component — it is a raw HTML element with semantic meaning and visual autonomy.

### Atom types

| Atom                | HTML element                       | Notes                                    |
| ------------------- | ---------------------------------- | ---------------------------------------- |
| Display headline    | `<h1>`, `<h2>`                     | Cormorant, large scale                   |
| Sub-label / eyebrow | `<p>`, `<span>`                    | DM Sans, spaced uppercase                |
| Body paragraph      | `<p>`                              | DM Sans, normal weight                   |
| Running number      | `<span>` with `aria-label`         | Decorative, aria-hidden if purely visual |
| Ruled line          | `<hr>` or `<div role="separator">` | Horizontal or vertical                   |
| Image               | `<img>` or `<picture>`             | Never inside a card wrapper              |
| Icon                | `<svg>` with `aria-hidden`         | Purely decorative atoms                  |
| CTA                 | `<button>` or `<a>`                | Interactive atom, always in focus order  |

### Anti-patterns

```
❌  <div class="card">
      <img />
      <h2>Title</h2>
      <p>Body</p>
      <button>CTA</button>
    </div>

✅  <section aria-labelledby="section-title">
      <h2 id="section-title" class="[free position]">Title</h2>
      <p class="[free position]">Body</p>
      <img class="[free position]" />
      <button class="[free position]">CTA</button>
    </section>
```

The section is a semantic boundary. Inside it, nothing is grouped unless semantically required (e.g., a list `<ul>`, a form `<fieldset>`).

---

## Principle 2: The Composition

**Atoms are arranged in composition space, not layout flow.**

A composition is a viewport-relative canvas. Atoms are placed by **intent** — where they should appear visually — not by where they fall in document flow.

### Positioning model

Every atom belongs to one of four positioning modes:

```
PINNED    — position: absolute, coordinates relative to section
DRIFTING  — position: absolute + transform driven by scrollYProgress
ANCHORED  — position: relative, normal flow with transform offset
FIXED     — position: fixed, viewport-relative (use sparingly)
```

| Mode     | When to use                                     | Performance                        |
| -------- | ----------------------------------------------- | ---------------------------------- |
| PINNED   | Decorative elements, typographic accents, lines | ✅ Zero JS                         |
| DRIFTING | Elements that translate/scale on scroll         | ✅ GPU composited (transform only) |
| ANCHORED | Content that must preserve document order       | ✅ Normal flow + GPU transform     |
| FIXED    | Global overlays (cursor, grain, progress)       | ⚠️ Use sparingly                   |

### The composition canvas

A composition section uses `position: relative` as its stacking context. Inside:

```
[section]  position: relative, min-height: 100dvh
  [atom]   position: absolute, top: 12%, left: 8%         ← PINNED
  [atom]   position: absolute, top: 40%, right: 0         ← PINNED/DRIFTING
  [atom]   position: relative (in normal flow)             ← ANCHORED
```

**Critical rule:** The first atom in source order — the primary headline — must always be `position: relative` or an ANCHORED atom so that the section has meaningful height in the document flow. This is the semantic backbone that holds the composition together for SEO and accessibility.

### Depth layers (z-axis)

All compositions use the same z-axis vocabulary:

```
z-0    — atmospheric background (gradients, grain, video)
z-10   — secondary visual atoms (decorative text, lines, shapes)
z-20   — primary content atoms (headlines, body text, images)
z-30   — interactive atoms (buttons, links, form inputs)
z-40   — floating overlays (tooltips, dropdowns)
z-50   — global fixed elements (cursor, progress bar, preloader)
```

---

## Principle 3: The Choreography

**Atoms animate individually. Scroll drives every motion.**

Choreography is the relationship between an atom's visual state and the scroll position of the page. There is no "section animates in" — there are only "atom A starts at T=0.2, atom B starts at T=0.35."

### Scroll mapping model

Each atom maps scroll progress (`0 → 1`) to one or more visual properties:

```typescript
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start end', 'end start'], // enters at bottom, exits at top
})

// Atom A: rises as section scrolls into view
const atomAY = useTransform(scrollYProgress, [0, 0.4], ['60px', '0px'])
const atomAOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

// Atom B: rises slightly later (stagger via different input range)
const atomBY = useTransform(scrollYProgress, [0.1, 0.5], ['60px', '0px'])

// Atom C: parallax drift (continues past midpoint)
const atomCY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])
```

### Choreography types

| Name        | Behavior                             | Input range  | Output                      |
| ----------- | ------------------------------------ | ------------ | --------------------------- |
| **Rise**    | Atom slides up and fades in          | `[0, 0.3]`   | `y: 60→0, opacity: 0→1`     |
| **Drift**   | Atom moves at different scroll speed | `[0, 1]`     | `y: 0→-20%` (parallax)      |
| **Reveal**  | Clip-path wipes across atom          | `[0, 0.4]`   | `clipPath: inset(0 100%→0)` |
| **Scale**   | Atom grows from small to natural     | `[0.1, 0.5]` | `scale: 0.85→1`             |
| **Rotate**  | Atom rotates into place (3D)         | `[0, 0.4]`   | `rotateX: 45→0`             |
| **Scatter** | Atom starts offset, converges        | `[0, 0.5]`   | `x: 80→0, y: 40→0`          |
| **Exit**    | Atom fades/moves out on scroll past  | `[0.6, 1]`   | `opacity: 1→0, y: 0→-30`    |

### Stagger without containers

Traditional stagger: "animate this list of children with 0.1s delay per child." Omnizya stagger: each atom has a **different scroll input range** so it starts later in the scroll timeline.

```typescript
// Instead of delay-based stagger:
const atoms = [0, 0.05, 0.1, 0.15, 0.2] // offset start points

const atomY = (offset: number) =>
  useTransform(scrollYProgress, [offset, offset + 0.35], ['50px', '0px'])

// Atom 0 starts rising at T=0.00
// Atom 1 starts rising at T=0.05
// Atom 2 starts rising at T=0.10
// etc.
```

This gives scroll-driven stagger that responds to the user's scroll speed — fast scrollers see compressed stagger, slow scrollers see luxurious sequencing.

### The 60px rule

All rise/scatter animations use `60px` (not `20px`, not `100px`) as the displacement magnitude for primary atoms. This is enough to read as "entering from below" without feeling like the atom teleported. Secondary atoms use `30px`, atmospheric atoms use `100px+`.

```typescript
// Primary atoms (headlines, CTAs)
y: ['60px', '0px']

// Secondary atoms (body text, labels)
y: ['30px', '0px']

// Atmospheric atoms (large decorative numbers, background images)
y: ['120px', '0px'] or y: ['0%', '-30%']
```

---

## Principle 4: The Semantic Layer

**The DOM is always readable without CSS or JS.**

Omnizya's visual freedom never comes at the cost of semantic integrity. The rule is absolute: if you disable all CSS and JavaScript, the page must read as a coherent, hierarchically correct document.

### Semantic requirements

1. **Heading hierarchy is sacred.** `h1` is unique per page. `h2` marks major sections. `h3` marks sub-sections. Never skip levels for visual sizing — use CSS `font-size` instead.

2. **Source order matches reading order.** Even if an atom is visually positioned top-right, in the HTML it appears where it logically belongs in the reading sequence. CSS positions it visually.

3. **Decorative atoms are hidden from the tree.** Any atom that is purely visual (a large decorative "01", a background rule, a texture) gets `aria-hidden="true"`. Its semantic content must exist elsewhere (in visible text, in an `aria-label`).

4. **Interactive atoms are always in the tab order.** No `tabindex="-1"` on CTAs or links unless they're intentionally removed from focus (e.g., duplicate links). All interactive atoms are reachable by keyboard.

5. **Images have meaningful alt text or `alt=""`** if decorative.

### SEO implications of free positioning

Search crawlers read DOM order, not visual position. If your hero section visually shows:

```
[visual: big image on left, headline on right]
```

The DOM order should be:

```html
<section>
  <h1>Headline First</h1>
  ← crawlers read this first
  <p>Supporting text</p>
  <img alt="..." /> ← image second
  <a href="#">CTA</a>
</section>
```

CSS positions the `<img>` visually to the left via `position: absolute; left: 0`. The crawler sees the intended reading order.

### Structured data

Every Omnizya page includes at minimum:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "...",
    "description": "...",
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "ANAQIO",
      ...
    }
  }
</script>
```

Waitlist pages should also include `"@type": "Event"` (the launch event) to signal urgency to search engines.

---

## Principle 5: Resilience

**Every composition degrades gracefully. Low-end devices get a real experience, not a broken one.**

Resilience is not "make it work" — it is "make it excellent at every capability tier." The experience changes, but it never degrades below dignified.

### Capability tiers

| Tier                   | Device                                   | Network     | JS      | Motion               |
| ---------------------- | ---------------------------------------- | ----------- | ------- | -------------------- |
| **Tier 3** (Target)    | Modern desktop/mobile, GPU               | Broadband   | Full    | Full choreography    |
| **Tier 2** (Common)    | Mid-range Android, 2–3 year old hardware | 4G          | Full    | Reduced choreography |
| **Tier 1** (Resilient) | Low-end Android, old iPhone              | 3G, slow 4G | Partial | No choreography      |
| **Tier 0** (Baseline)  | Any device                               | Any         | None    | None                 |

### Tier 2 strategy: Reduced choreography

Activated by `prefers-reduced-motion: reduce` OR by detecting slow hardware (see detection below).

- Atoms are ANCHORED (normal flow) instead of DRIFTING
- All `useTransform` outputs are replaced with their final values
- `whileInView` animations use `opacity: 0→1` only (no translate, no scale, no clip-path)
- Scroll-linked animations are replaced with `IntersectionObserver` one-shot fades
- Parallax disabled globally

```typescript
// In every choreography function:
const reduced = useReducedMotion()

const atomY = reduced
  ? '0px' // Tier 2: already in place
  : useTransform(scrollYProgress, [0, 0.3], ['60px', '0px']) // Tier 3: animated
```

### Tier 1 strategy: Static layout

Activated when JS is slow to execute or the network is poor.

- All sections use `min-height: auto` (not `100dvh`) so content collapses to natural height
- Scroll-snapping is disabled (override `scroll-snap-type: none`)
- Free-positioned atoms collapse to `position: static` via a `.no-js` class on `<html>` or low-hardware detection
- Images are `loading="lazy"` with appropriate `sizes` and `srcset`
- No background video (defer to static poster image)
- Form is single-step (multi-step collapses to full form)

### Tier 0 strategy: No-JS baseline

Add a `<noscript>` stylesheet that sets:

```css
/* noscript.css */
[data-atom] {
  position: static !important;
  transform: none !important;
  opacity: 1 !important;
  clip-path: none !important;
}

[data-decorative] {
  display: none !important;
}
```

All atoms get `data-atom` attribute. All decorative atoms get `data-decorative`.

### Low-hardware detection

Use the Navigator API to detect constrained devices:

```typescript
// hooks/use-device-tier.ts
export function useDeviceTier(): 'high' | 'mid' | 'low' {
  const [tier, setTier] = useState<'high' | 'mid' | 'low'>('high')

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4
    const memory = (navigator as any).deviceMemory ?? 4 // GB, Chrome-only
    const connection = (navigator as any).connection?.effectiveType ?? '4g'

    if (cores <= 2 || memory <= 1 || connection === '2g' || connection === 'slow-2g') {
      setTier('low')
    } else if (cores <= 4 || memory <= 2 || connection === '3g') {
      setTier('mid')
    } else {
      setTier('high')
    }
  }, [])

  return tier
}
```

Pass `tier` down as context. Mid/low tiers receive Tier 2 or Tier 1 experiences respectively.

### Performance budget per atom

Each animated atom has a performance budget:

| Property                               | Composited?  | Cost          | Use in Omnizya?                     |
| -------------------------------------- | ------------ | ------------- | ----------------------------------- |
| `transform` (translate, scale, rotate) | ✅ Yes (GPU) | Negligible    | ✅ Freely                           |
| `opacity`                              | ✅ Yes (GPU) | Negligible    | ✅ Freely                           |
| `filter` (blur)                        | ⚠️ Partial   | Medium        | ⚠️ Sparingly, on Tier 3 only        |
| `clip-path`                            | ⚠️ Partial   | Medium        | ⚠️ Max 2–3 atoms per section        |
| `width`, `height`                      | ❌ No        | High (reflow) | ❌ Never animate                    |
| `top`, `left`                          | ❌ No        | High (reflow) | ❌ Never animate — use `transform`  |
| `background-position`                  | ❌ No        | Medium        | ⚠️ CSS-only shimmer, no JS          |
| `box-shadow`                           | ❌ No        | Medium        | ⚠️ Only on hover, not scroll-driven |

**Rule:** Scroll-driven animations touch **only `transform` and `opacity`**. Everything else is a CSS transition triggered by class or state change.

### `will-change` discipline

`will-change: transform` promotes an element to its own compositor layer. Overuse causes memory exhaustion on low-end devices.

```
✅  Apply will-change only on elements that:
    - Are actively scroll-driven (scroll velocity > 0)
    - Are currently in the viewport
    - Animate continuously (not one-shot whileInView)

✅  Remove will-change when animation completes:
    style={{ willChange: isScrolling ? 'transform' : 'auto' }}

❌  Never apply will-change statically to every atom
❌  Never apply will-change to more than 10 elements per composition
```

### Image strategy for low-end

All images in Omnizya compositions:

```tsx
<img
  src="image-800w.webp"
  srcSet="image-400w.webp 400w, image-800w.webp 800w, image-1600w.webp 1600w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  decoding="async"
  width={800}
  height={600} // Always specify to prevent CLS
  alt="..."
/>
```

For above-the-fold hero images: `loading="eager"` + `fetchpriority="high"`.

---

## Principle 6: The Grid Contract

**Visual freedom operates within invisible grid contracts.**

"Component-free" does not mean "no spatial system." Omnizya uses an invisible grid — not a CSS grid for layout, but a spatial contract that defines where atoms may live.

### The 12-column contract

The composition canvas is divided into 12 invisible columns. Atoms are positioned by column alignment, not pixel values.

```
|  1 |  2 |  3 |  4 |  5 |  6 |  7 |  8 |  9 | 10 | 11 | 12 |
```

Rather than `left: 347px`, write `left: calc(3/12 * 100%)` (atom starts at column 3).

Tailwind implementation:

```
w-1/12  → 1 column width
w-2/12  → 2 columns
left-[25%]  → starts at column 3 (3/12 = 25%)
```

### The 8-row contract

Vertically, compositions use 8 rhythm rows per section:

```
Row 1 — 0–12.5%    (atmospheric intro, eyebrow labels)
Row 2 — 12.5–25%   (primary headline zone)
Row 3 — 25–37.5%   (secondary content, dividers)
Row 4 — 37.5–50%   (supporting text, images start)
Row 5 — 50–62.5%   (image center, detail content)
Row 6 — 62.5–75%   (secondary CTA, footnotes)
Row 7 — 75–87.5%   (transition zone to next section)
Row 8 — 87.5–100%  (overlap into next section)
```

Atoms at Row 8 are the "bridge atoms" that visually connect sections — they're positioned in the current section's stacking context but appear to float into the next.

---

## Principle 7: Typography Freedom

**Type is an atom, not a style property.**

In Omnizya, typographic scale is defined by compositional role, not by UI hierarchy alone. A display headline can be as large as the viewport allows. A running number can be 20rem with 5% opacity. An eyebrow label can be 8px spaced at 0.5em tracking.

### Editorial typographic atoms

| Role                   | Font             | Size (desktop)                | Size (mobile)                      | Weight      |
| ---------------------- | ---------------- | ----------------------------- | ---------------------------------- | ----------- |
| **Campaign headline**  | Cormorant        | `clamp(4rem, 10vw, 12rem)`    | `clamp(2.5rem, 8vw, 4rem)`         | 300 (light) |
| **Section headline**   | Cormorant        | `clamp(2.5rem, 5vw, 6rem)`    | `clamp(1.8rem, 6vw, 2.5rem)`       | 400         |
| **Eyebrow label**      | DM Sans          | `0.6875rem`                   | `0.625rem`                         | 500         |
| **Body copy**          | DM Sans          | `1rem`                        | `0.9375rem`                        | 400         |
| **Atmospheric number** | Cormorant        | `clamp(8rem, 20vw, 22rem)`    | Hidden / `clamp(5rem, 15vw, 8rem)` | 300         |
| **Running quote**      | Instrument Serif | `clamp(1.25rem, 2.5vw, 2rem)` | `clamp(1.1rem, 4vw, 1.5rem)`       | 400 italic  |
| **Micro label**        | DM Sans mono     | `0.625rem`                    | `0.625rem`                         | 500         |

### `clamp()` always

All type atoms use `clamp()` for fluid scaling between breakpoints. Never use static `text-*` classes for display or section headlines in Omnizya compositions.

```css
/* ✅ Omnizya type atom */
font-size: clamp(2.5rem, 5vw + 1rem, 6rem);

/* ❌ Not Omnizya */
font-size: 3rem; /* or text-5xl */
```

In Tailwind, implement via `text-[clamp(...)]` or extend `fontSize` in `tailwind.config.ts`.

---

## Implementation in ANAQIO

### Current state vs. Omnizya target

| Pattern            | Current (component-based)                         | Omnizya target                                                                      |
| ------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Section structure  | `<Section>` wrapper → `SectionHeader` → card grid | `<section>` → freely positioned atoms                                               |
| Headline animation | `SectionHeader` `fadeUp` (single block)           | Each word/atom has independent scroll choreography                                  |
| Card grids         | `FeatureCard` component with internal layout      | Each card element (icon, title, body) is an independent atom                        |
| Pain points        | Mapped from array → repeated components           | Each pain point is an atom cluster with individual scroll offset                    |
| Hero               | Layered with absolute blobs + relative content    | Full atom canvas: each headline word, line, button is independently choreographed   |
| Positioning        | Mostly flex/grid + absolute for decorations only  | Atoms use absolute positioning within section canvas, semantic layer in normal flow |

### Adoption strategy

Omnizya does not require a full rewrite. It is adopted **section by section**:

1. **New sections** are built Omnizya-first (atom canvas, no wrappers)
2. **Existing sections** are refactored when they are redesigned for cinematic purpose
3. **`FeatureCard`, `Section`, `SectionContainer`** components remain — they serve as **semantic containers**, not visual ones. Their visual layout is overridden per composition.

### The `Atom` primitive

A minimal React atom component for Omnizya:

```tsx
// components/ui/atom.tsx
import { motion, type HTMLMotionProps } from 'framer-motion'

type AtomProps = HTMLMotionProps<'div'> & {
  decorative?: boolean
  tier?: 'high' | 'mid' | 'low'
}

export function Atom({ decorative, children, ...props }: AtomProps) {
  return (
    <motion.div
      data-atom
      aria-hidden={decorative ? 'true' : undefined}
      data-decorative={decorative ? 'true' : undefined}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

**However:** In practice, avoid the `<Atom>` wrapper and directly use `<motion.h1 data-atom>`, `<motion.p data-atom>`, etc. to keep the DOM flat and semantic.

### Composition template

```tsx
// Template for an Omnizya composition section
export function ExampleSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const tier = useDeviceTier()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Atom choreography
  const eyebrowY = useTransform(scrollYProgress, [0, 0.3], ['30px', '0px'])
  const headlineY = useTransform(scrollYProgress, [0.05, 0.4], ['60px', '0px'])
  const headlineOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1])
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1.05, 1])
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  // Tier 2/1: disable scroll-linked motion
  const isAnimated = !reduced && tier !== 'low'

  return (
    <section ref={sectionRef} aria-labelledby="example-headline" className="relative min-h-screen">
      {/* Semantic backbone — normal flow, invisible visually */}
      <h2 id="example-headline" className="sr-only">
        Section title for SEO
      </h2>

      {/* Eyebrow atom — DRIFTING */}
      <motion.p
        data-atom
        className="font-label text-foreground/50 absolute left-[8.33%] top-[12%] text-xs uppercase tracking-[0.3em]"
        style={isAnimated ? { y: eyebrowY } : undefined}
      >
        Eyebrow Label
      </motion.p>

      {/* Headline atom — DRIFTING */}
      <motion.h2
        data-atom
        aria-hidden="true" // visual duplicate of sr-only above
        className="font-display absolute left-[8.33%] top-[18%] text-[clamp(3rem,6vw,8rem)] leading-[0.9]"
        style={isAnimated ? { y: headlineY, opacity: headlineOpacity } : undefined}
      >
        Visual Headline
      </motion.h2>

      {/* Image atom — DRIFTING with parallax */}
      <motion.div
        data-atom
        className="absolute right-0 top-0 h-full w-1/2 overflow-hidden"
        style={isAnimated ? { scale: imageScale } : undefined}
      >
        <motion.img
          src="..."
          alt="Descriptive alt"
          className="h-full w-full object-cover"
          style={isAnimated ? { y: imageY } : undefined}
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Body atom — ANCHORED (in normal flow, shifted visually) */}
      <p
        data-atom
        className="font-body text-foreground/70 relative z-20 ml-[8.33%] mt-[45%] max-w-sm text-base"
      >
        Body copy here.
      </p>

      {/* CTA atom — interactive, must be in tab order */}
      <a
        data-atom
        href="#waitlist"
        className="font-ui absolute bottom-[15%] left-[8.33%] z-30 text-sm underline-offset-4 hover:underline"
      >
        Call to action
      </a>

      {/* Atmospheric atom — decorative, aria-hidden */}
      <span
        data-atom
        data-decorative
        aria-hidden="true"
        className="font-display text-foreground/[0.04] absolute right-[8%] top-[8%] select-none text-[clamp(6rem,15vw,18rem)] font-light leading-none"
      >
        01
      </span>
    </section>
  )
}
```

---

## Checklist: Is My Section Omnizya-Compliant?

### Composition

- [ ] No wrapping card/component divs around content atoms
- [ ] Each atom (headline, body, image, CTA) is individually positioned
- [ ] Section has `position: relative` and `min-height: 100dvh`
- [ ] Invisible grid contract used for horizontal placement (`left-[8.33%]` etc.)
- [ ] Atmospheric atoms are `data-decorative aria-hidden="true"`
- [ ] Bridge atoms exist at Row 8 to connect to next section

### Choreography

- [ ] `useScroll` scoped to the section's `ref`
- [ ] Each atom has its own `useTransform` with unique scroll input range
- [ ] Stagger achieved via offset scroll ranges, not JS `delay`
- [ ] Only `transform` and `opacity` are scroll-driven
- [ ] Atmospheric atoms have larger displacement (`120px+`) than primary atoms (`60px`)
- [ ] Exit animation defined where atoms should leave viewport

### Semantics / SEO

- [ ] `h1` / `h2` heading present (may be `sr-only` if visually displayed as `aria-hidden`)
- [ ] Source order matches logical reading order
- [ ] All images have `alt` text or `alt=""`
- [ ] Interactive atoms are in tab order
- [ ] `aria-hidden` on all decorative atoms
- [ ] Section has `aria-labelledby` pointing to its heading
- [ ] Structured data added to page (`<script type="application/ld+json">`)

### Resilience

- [ ] `useReducedMotion()` checked; all choreography is conditional
- [ ] `useDeviceTier()` checked; Tier 1 renders static layout
- [ ] `[data-atom]` present on every atom (for noscript CSS override)
- [ ] Only `transform` and `opacity` are animated (composited, no reflow)
- [ ] `will-change: transform` used only on continuously animated atoms
- [ ] `will-change` removed after animation completes
- [ ] All images have explicit `width` and `height` attributes (prevent CLS)
- [ ] Above-fold images: `loading="eager" fetchpriority="high"`
- [ ] Below-fold images: `loading="lazy" decoding="async"`
- [ ] No more than 3 `clip-path` animations per section on Tier 3
- [ ] Background video has `preload="none"` and is loaded in `useEffect`

### Typography

- [ ] Display and section headlines use `clamp()` sizing
- [ ] Atmospheric numbers use `aria-hidden` and are not in reading order
- [ ] No static `text-*` Tailwind class on headlines in compositions

---

## Anti-Patterns Reference

| Anti-Pattern                                     | Why it breaks Omnizya                                  | Fix                                                        |
| ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------- |
| `<Card>` wrapping image + title + body           | Destroys atom independence, single animation trigger   | Position each element as its own atom                      |
| `delay: 0.3` for stagger                         | JS delay-based — breaks on variable scroll speed       | Use offset scroll ranges in `useTransform`                 |
| `left: 347px` for atom position                  | Pixel-perfect but not grid-contracted                  | Use `left: calc(3/12 * 100%)` or `left-[25%]`              |
| Animating `height`, `width`, `top`, `left`       | Causes reflow, destroys 60fps on low-end               | Use `transform: translateY/X/scale` only                   |
| `will-change: transform` on every atom           | Memory exhaustion on low-end                           | Apply only to continuously animating atoms                 |
| Section-level `whileInView`                      | Entire section enters as one block                     | Each atom has its own `whileInView` or scroll range        |
| Heading inside card with no semantic backup      | Hidden from SEO crawlers by position                   | Add `sr-only` heading in normal flow as semantic anchor    |
| `scroll-snap-type: y mandatory` on every section | Fights with free scroll, breaks on low-end             | Use scroll-snap only where deliberate pacing is needed     |
| `AnimatePresence` exit on scroll-driven atoms    | Exit animations conflict with scroll direction changes | Use `useTransform` opacity for exit, not `AnimatePresence` |
| Static `font-size: 3rem` on display type         | Doesn't scale to viewport                              | Always use `clamp()` on display atoms                      |

---

_This document is the reference implementation of Omnizya for the ANAQIO project. All new cinematic compositions should be built against these principles._
