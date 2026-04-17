# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Anaqio-Waitlist
**Generated:** 2026-03-08 16:48:12
**Category:** Service Landing Page

---

## Global Rules

### Color Palette

#### Core Tokens (in `tailwind.config.ts`)

| Role               | Hex       | Tailwind Token | Usage                                             |
| ------------------ | --------- | -------------- | ------------------------------------------------- |
| Primary            | `#2563EB` | `aq-blue`      | Brand accent, links, CTAs, interactive highlights |
| Secondary          | `#7C3AED` | `aq-purple`    | Gradient partner, hover states, secondary accents |
| Background (dark)  | `#0F172A` | `aq-ink`       | Core dark-theme background                        |
| Background (light) | `#F8FAFC` | `aq-white`     | Light-theme background, text on dark              |
| Surface            | `#F1F5F9` | `aq-surface`   | Card backgrounds in light mode                    |
| Neutral            | `#334155` | `aq-slate`     | Supporting text, subtle borders                   |
| Muted              | `#94A3B8` | `aq-muted`     | Captions, placeholders, disabled states           |
| Border             | `#E2E8F0` | `aq-border`    | Input borders, dividers                           |

#### Extended Tints & Shades (in `brand-content.tsx`)

| Hex       | CSS Variable        | Usage                            |
| --------- | ------------------- | -------------------------------- |
| `#DBEAFE` | `--aq-blue-light`   | Blue hover backgrounds, badges   |
| `#1D4ED8` | `--aq-blue-dark`    | Dark blue text on light badges   |
| `#EDE9FE` | `--aq-purple-light` | Purple hover backgrounds, badges |
| `#5B21B6` | `--aq-purple-dark`  | Dark purple text on light badges |

#### Brand Gradients

| Name                 | Value                                                                        | CSS Class                                     | Usage                                    |
| -------------------- | ---------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------- |
| `aq-gradient`        | `linear-gradient(90deg, #3F57AF 0%, #484DA9 32%, #6049A8 67%, #6F47A7 100%)` | `.bg-brand-gradient` / `.text-brand-gradient` | Signature gradient (buttons, text fills) |
| `aq-gradient-diag`   | `linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)`                          | `.bg-brand-diag`                              | Primary CTA buttons, card headers        |
| `aq-gradient-radial` | `radial-gradient(ellipse at 30% 50%, #2563EB 0%, #7C3AED 100%)`              | —                                             | Decorative radial effects                |
| `aq-gradient-light`  | `linear-gradient(135deg, #DBEAFE 0%, #EDE9FE 100%)`                          | —                                             | Light-mode gradient backgrounds          |
| `hero-gradient`      | Multi-radial composite (4 layers)                                            | `.hero-gradient`                              | Hero section background depth            |

**Color Notes:** Dark-first aesthetic. Use `aq-blue` as the primary interactive color throughout. Use `aq-purple` sparingly as a gradient partner or hover accent.

### Typography

#### Font Families

| Use Case           | Tailwind Class                      | Actual Font                  | Role                                         |
| ------------------ | ----------------------------------- | ---------------------------- | -------------------------------------------- |
| Display / Headings | `font-display`                      | **Space Grotesk**            | Hero titles, section headings, large text    |
| UI / Body          | `font-ui`, `font-body`, `font-sans` | **Inter**                    | Body copy, form labels, navigation           |
| Editorial / Accent | `font-editorial`, `font-serif`      | **Instrument Serif**         | Italic accents, pull-quotes, decorative type |
| Labels / Small     | `font-label`                        | **Inter**                    | Badges, tags, micro-copy                     |
| Wordmark           | `font-wordmark`                     | Georgia (system serif)       | Brand wordmark fallback                      |
| Monospace          | `font-mono`                         | ui-monospace, SFMono-Regular | Code samples, technical values               |

- **Mood:** editorial, premium, dark-first, glassmorphism, cinematic
- **Fonts loaded via:** `next/font/google` in `layout.tsx` (automatic optimization, no external `@import`)

#### Typography Utility Classes (in `globals.css`)

| Class              | Definition                                                       | Usage                        |
| ------------------ | ---------------------------------------------------------------- | ---------------------------- |
| `.text-display`    | `font-display font-bold leading-[0.95] tracking-display`         | Hero titles, largest text    |
| `.text-headline`   | `font-display font-semibold leading-tight tracking-tight`        | Section headings             |
| `.text-subheading` | `font-body font-medium tracking-wide`                            | Subheadings, intro text      |
| `.text-body`       | `font-body font-normal leading-7`                                | Body paragraphs              |
| `.text-caption`    | `font-body text-[0.72rem] font-light tracking-wider`             | Small captions, footnotes    |
| `.text-cta`        | `font-label text-[0.65rem] font-medium uppercase tracking-label` | CTA labels, section eyebrows |
| `.text-wordmark`   | `font-wordmark font-light italic`                                | Brand wordmark text          |

#### Custom Letter Spacing

| Token                | Value     | Usage                        |
| -------------------- | --------- | ---------------------------- |
| `tracking-display`   | `-0.02em` | Tight display headings       |
| `tracking-editorial` | `0.02em`  | Serif accent text            |
| `tracking-label`     | `0.3em`   | All-caps section labels      |
| `tracking-wide-xl`   | `0.4em`   | Ultra-wide decorative labels |

### Spacing Variables

| Token      | Value  | Usage                     |
| ---------- | ------ | ------------------------- |
| `--sp-xs`  | `4px`  | Tight gaps                |
| `--sp-sm`  | `8px`  | Icon gaps, inline spacing |
| `--sp-md`  | `16px` | Standard padding          |
| `--sp-lg`  | `24px` | Section padding           |
| `--sp-xl`  | `32px` | Large gaps                |
| `--sp-2xl` | `48px` | Section margins           |
| `--sp-3xl` | `64px` | Hero padding              |
| `--sp-4xl` | `96px` | Full-page spacers         |

### Border Radius

| Token                       | Value   | Usage                   |
| --------------------------- | ------- | ----------------------- |
| `--r-sm` / `rounded-sm`     | `4px`   | Subtle rounding         |
| `--r-md` / `rounded-md`     | `8px`   | Inputs, small cards     |
| `--r-lg` / `rounded-lg`     | `12px`  | Cards, panels           |
| `--r-xl` / `rounded-xl`     | `16px`  | Large cards, modals     |
| `--r-full` / `rounded-full` | `999px` | Pills, avatars, buttons |

### Shadow Depths (Brand-Tinted)

| Level           | Value                                                                | Usage                   |
| --------------- | -------------------------------------------------------------------- | ----------------------- |
| `--shadow-sm`   | `0 1px 3px rgba(37,99,235,0.08), 0 1px 2px rgba(37,99,235,0.06)`     | Subtle lift             |
| `--shadow-md`   | `0 4px 16px rgba(37,99,235,0.12), 0 2px 6px rgba(124,58,237,0.08)`   | Cards, buttons          |
| `--shadow-lg`   | `0 16px 40px rgba(37,99,235,0.16), 0 4px 12px rgba(124,58,237,0.12)` | Modals, dropdowns       |
| `--shadow-glow` | `0 0 40px rgba(124,58,237,0.25)`                                     | Decorative glow effects |

---

## Component Specs

### Buttons

Three sizes: `.btn-sm` (7px 16px), default (10px 22px), `.btn-lg` (14px 32px). All pill-shaped.

```css
/* Primary Button — gradient diagonal */
.btn-primary {
  background: var(--aq-gradient-diag);
  color: white;
  padding: 10px 22px;
  border-radius: var(--r-full);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.01em;
  transition: all 200ms ease;
  cursor: pointer;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

/* Secondary Button — outlined */
.btn-secondary {
  background: white;
  color: var(--aq-blue);
  border: 1.5px solid var(--aq-blue);
  padding: 10px 22px;
  border-radius: var(--r-full);
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  background: var(--aq-blue-light);
}

/* Ghost Button */
.btn-ghost {
  background: var(--aq-surface);
  color: var(--aq-slate);
  padding: 10px 22px;
  border-radius: var(--r-full);
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-ghost:hover {
  background: var(--aq-border);
}
```

### Cards

```css
/* Glass card — dark-first glassmorphism */
.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  transition: all 500ms ease;
  cursor: pointer;
}

.card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(37, 99, 235, 0.2);
  transform: translateY(-2px);
}
```

### Section Heading

Standard heading pattern used across all content sections. Consistent structure: eyebrow label → headline with gradient accent.

```tsx
<motion.h2
  initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-100px' }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  className="font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
>
  <span className="text-muted-foreground block w-full text-center text-sm uppercase tracking-[0.2em]">
    {eyebrow}
  </span>
  {headlineText} <span className="text-brand-gradient font-bold italic">{accentText}</span>
</motion.h2>
```

- Eyebrow: `text-sm uppercase tracking-[0.2em] text-muted-foreground`
- Accent words: Always use `text-brand-gradient font-bold italic` — never raw color like `text-purple-900`

### Section Card

Standard card used across content sections (HowItWorks, WhyAnaqio, WhoItsFor, Solution).

```css
/* Section card — light-mode glassmorphism */
.section-card {
  border-radius: 12px;
  border: 1px solid rgba(228, 231, 236, 0.6); /* border-border/60 */
  background: rgba(255, 255, 255, 0.5); /* bg-white/50 */
  backdrop-filter: blur(4px);
  padding: 24px;
  cursor: pointer;
  transition: all 300ms ease;
}

.section-card:hover {
  transform: translateY(-4px);
  border-color: rgba(37, 99, 235, 0.25); /* border-aq-blue/25 */
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1);
}
```

- **Icon container**: `h-10 w-10 rounded-lg bg-aq-blue/10 text-aq-blue` with hover `bg-aq-blue/15`
- **Title**: `font-semibold text-foreground`
- **Body**: `text-sm leading-relaxed text-muted-foreground`
- **Must include**: `cursor-pointer`, hover transition, icon (Lucide SVG)

### Staggered Grid Animation

All card grids must use staggered reveal via Framer Motion:

```tsx
<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-80px' }}
  transition={{
    duration: 0.5,
    delay: index * 0.1,  // 100ms stagger per card
    ease: [0.16, 1, 0.3, 1],
  }}
>
```

- **Required**: `useReducedMotion()` from `framer-motion` to disable animations for accessibility
- When `prefersReducedMotion` is true, pass `false` to `initial` to skip animation entirely
- Stagger delay: `0.1s` per card (max ~0.5s total for a 5-card grid)

### Inputs

```css
/* Light-mode input (brand page, forms) */
.input-field {
  padding: 11px 16px;
  border: 1.5px solid var(--aq-border);
  border-radius: var(--r-md);
  font-size: 14px;
  background: white;
  color: var(--aq-ink);
  transition:
    border-color 200ms,
    box-shadow 200ms;
}

.input-field:focus {
  border-color: var(--aq-blue);
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.input-field::placeholder {
  color: var(--aq-muted);
}

/* Dark-mode input (glassmorphism sections) */
.input-glass {
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--r-lg);
  font-size: 16px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--aq-white);
  transition: border-color 300ms ease;
}

.input-glass:focus {
  border-color: rgba(37, 99, 235, 0.5);
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Cinematic Dark Glassmorphism

**Keywords:** Dark-first, frosted glass panels, radial gradient depth, editorial typography, staggered reveals, subtle noise textures, premium feel

**Best For:** AI SaaS, fashion-tech, creative studio tools, premium waitlist pages

**Key Effects:** Glassmorphism cards, gradient glow orbs, fade-in-up staggered sections, parallax depth, view transitions

### Glassmorphism Utilities

| Class           | Blur | Noise Opacity | Usage                 |
| --------------- | ---- | ------------- | --------------------- |
| `.glass`        | 20px | 0.02          | Standard glass panels |
| `.glass-strong` | 30px | 0.03          | High-contrast glass   |
| `.glass-card`   | 16px | 0.02          | Card-level glass      |

### Gradient & Texture Utilities

| Class                  | Description                                            |
| ---------------------- | ------------------------------------------------------ |
| `.text-brand-gradient` | Gradient text fill using `aq-gradient`                 |
| `.bg-brand-gradient`   | Background using `aq-gradient`                         |
| `.bg-brand-diag`       | Background using `aq-gradient-diag` with hover reverse |
| `.hero-gradient`       | Multi-radial hero background (4 layers of blue/purple) |
| `.noise-overlay`       | Adds SVG noise after-pseudo at 4.5% opacity            |
| `.bg-grain`            | Fixed full-screen noise grain at 3% opacity            |

### Motion & Interaction Utilities

| Class               | Description                                            |
| ------------------- | ------------------------------------------------------ |
| `.gravitate`        | Mouse-tracked parallax offset (30px range, 300ms ease) |
| `.ease-smooth`      | `cubic-bezier(0.22, 1, 0.36, 1)` easing shorthand      |
| `.abstract-blob`    | Animated gradient blob with parallax + gyro tracking   |
| `.glass-bubble`     | Apple-style glass sphere with inner radial highlight   |
| `.animated-grid`    | Subtle moving grid pattern overlay                     |
| `.perspective-grid` | 3D-perspective grid for header depth                   |

### Custom Animations (CSS)

| Name               | Class                                    | Description                                     |
| ------------------ | ---------------------------------------- | ----------------------------------------------- |
| `gradient-shift`   | `.animate-gradient`                      | Background-position loop for animated gradients |
| `glow-pulse`       | `.animate-glow`                          | Opacity pulse (0.4→0.8) for glowing orbs        |
| `float`            | `.animate-float` / `.animate-float-slow` | Vertical oscillation (6s / 10s)                 |
| `entrance`         | `.page-entrance`                         | Fade-in with blur-10px (1s ease-out)            |
| `shimmer`          | `.animate-shimmer`                       | Horizontal shine sweep                          |
| `hero-glow`        | `.animate-hero-glow`                     | Box-shadow pulse for hero elements              |
| `depth-pulse`      | `.animate-depth-pulse`                   | Z-axis translateZ oscillation                   |
| `theme-transition` | `.animate-theme-transition`              | Brightness/opacity flash on theme change        |
| `blob-drift-0…5`   | Auto via `:nth-child`                    | 6 unique organic drift paths for blobs          |

### View Transitions (CSS)

Enabled via `next.config.ts` `viewTransition: true`. Custom keyframes:

| Element       | Old (exit)                               | New (enter)                            | Duration |
| ------------- | ---------------------------------------- | -------------------------------------- | -------- |
| Root page     | `vt-slide-out` (fade + translateY -2rem) | `vt-slide-in` (fade + translateY 1rem) | 300ms    |
| `site-header` | Morphs in place (no crossfade)           | Morphs in place                        | 350ms    |
| `site-logo`   | Morphs in place (no crossfade)           | Morphs in place                        | 350ms    |

All view transitions are disabled when `prefers-reduced-motion: reduce`.

### Page Pattern

**Pattern Name:** Vertical Cinematic Scroll

- **Conversion Strategy:** Immersive product storytelling. Smooth natural scrolling with staggered section reveals.
- **CTA Placement:** In-hero email capture + repeated CTA after social proof
- **Section Order:** 1. Hero (full-height with email capture), 2. Interactive Preview, 3. Product Features (Bento Grid), 4. Social Proof, 5. Coming Soon, 6. Waitlist CTA, 7. Footer

---

## Anti-Patterns (Do NOT Use)

- ❌ Complex navigation
- ❌ Hidden contact info

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y
- ❌ **Raw color accents** — Never use `text-purple-900` or ad-hoc colors; always use `text-brand-gradient` for accent text
- ❌ **Static card grids** — All card grids must use staggered `whileInView` entry animations
- ❌ **Missing `useReducedMotion()`** — All Framer Motion sections must respect `prefers-reduced-motion`
- ❌ **Cards without hover states** — Every section card must have lift + border-glow hover
- ❌ **Cards without icons** — Feature/benefit cards should include a Lucide SVG icon to reinforce meaning
- ❌ **Plain bullet lists** — Replace `<ul>` bullets with icon-list or styled cards for visual weight
- ❌ **Missing section IDs** — Every section must have an `id` attribute for anchor navigation

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
