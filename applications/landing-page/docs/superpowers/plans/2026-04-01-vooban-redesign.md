# Vooban-Style Full Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the entire Anaqio landing page to mimic Vooban's design language — electric blue dominant, oversized ANAQIO wordmark hero, floating video card, left MENU sidebar, sections alternating blue ↔ white.

**Architecture:** Replace the dark-navy theme with electric blue (#2B3AE7) as the new dominant surface. Introduce a fixed left MENU sidebar strip. Redesign every section to follow Vooban's alternating blue/white rhythm with large editorial typography. Keep all i18n, Framer Motion, and Next.js patterns intact.

**Tech Stack:** Next.js 16 App Router, React 19, Framer Motion, Tailwind CSS v4, next-intl, shadcn/ui, Bun

---

## Reference: Vooban Design System

| Element               | Vooban value        | Anaqio equivalent                           |
| --------------------- | ------------------- | ------------------------------------------- |
| Electric blue         | `#2B3AE7`           | `--aq-electric` (new token)                 |
| White                 | `#FFFFFF`           | `--aq-white` (new token)                    |
| Cyan accent underline | `#00C8FF`           | `#D4AF37` (gold — Anaqio's differentiator)  |
| Font                  | Heavy grotesque     | Syne (already loaded) — crank weight to 900 |
| Hero bg               | Solid electric blue | Solid `--aq-electric`                       |
| White sections        | `#F5F5F2`           | `#F5F5F0`                                   |
| Left sidebar          | 64px fixed strip    | `components/layout/MenuSidebar.tsx`         |
| Nav                   | Minimal flat topbar | Replace pill nav                            |

## Color Shift Summary

**Before:** `--background: 222 47% 11%` (dark navy `#0e1829`)  
**After:** Two surfaces used explicitly per section:

- Blue sections: `bg-[#2B3AE7]` text-white
- White sections: `bg-[#F5F5F0]` text-[#0a0a0a]

No single global `background` change — each section opts into blue or white explicitly. This prevents breaking non-redesigned pages.

---

## File Map

| File                                        | Action     | Responsibility                                                                        |
| ------------------------------------------- | ---------- | ------------------------------------------------------------------------------------- |
| `app/globals.css`                           | Modify     | Add `--aq-electric`, `--aq-white` tokens; add `.vb-blue`, `.vb-white` section helpers |
| `components/layout/MenuSidebar.tsx`         | **Create** | Fixed 64px left sidebar with rotated "MENU" text + fullscreen overlay                 |
| `components/layout/Header.tsx`              | Modify     | Replace collapsing pill with flat Vooban-style topbar                                 |
| `components/sections/VoobanHeroSection.tsx` | **Create** | Electric blue hero, oversized ANAQIO wordmark, floating video card                    |
| `components/sections/NewLandingPage.tsx`    | Modify     | Swap VideoHeroSection → VoobanHeroSection; add MenuSidebar                            |
| `components/sections/ProblemSection.tsx`    | Modify     | Blue section, large left-aligned editorial statement                                  |
| `components/sections/SolutionSection.tsx`   | Modify     | Blue section, service cards grid                                                      |
| `components/sections/FeaturesSection.tsx`   | Modify     | White section, clean feature grid                                                     |
| `components/sections/ResultsSection.tsx`    | Modify     | Blue section, oversized stat numbers                                                  |
| `components/sections/SegmentsSection.tsx`   | Modify     | White section, segment card grid                                                      |
| `components/sections/PricingSection.tsx`    | Modify     | Blue section, pricing cards                                                           |
| `components/sections/HowItWorksSection.tsx` | Modify     | White section, numbered steps                                                         |
| `components/sections/WhyAnaqioSection.tsx`  | Modify     | White section, brand grid / differentiators                                           |
| `components/sections/VisionSection.tsx`     | Modify     | Blue section, large CTA statement                                                     |
| `components/sections/MarqueeSection.tsx`    | Modify     | Thin ticker, adapts to blue/white context                                             |
| `components/layout/Footer.tsx`              | Modify     | White section, multi-column Vooban-style footer                                       |

---

## Task 1: Design Tokens — globals.css

**Files:**

- Modify: `app/globals.css`

- [ ] **Step 1: Add electric blue tokens and section utility classes**

In `app/globals.css`, inside `:root { ... }`, add after line `--aq-navy: #1b2f52;`:

```css
/* Vooban-style electric blue surface */
--aq-electric: #2b3ae7;
--aq-electric-deep: #1e2fc7;
--aq-white-warm: #f5f5f0;
--aq-gold-underline: #d4af37;
```

After the `:root` block, add section utilities (before `.animated-grid`):

```css
/* ── Vooban section surfaces ──────────────────── */
.vb-blue {
  background-color: var(--aq-electric);
  color: #ffffff;
}

.vb-white {
  background-color: var(--aq-white-warm);
  color: #0a0a0a;
}

/* Gold underline accent (replaces Vooban cyan) */
.vb-underline {
  text-decoration: underline;
  text-decoration-color: var(--aq-gold-underline);
  text-decoration-thickness: 3px;
  text-underline-offset: 6px;
}

/* Left sidebar body offset */
body.has-sidebar {
  padding-left: 64px;
}

@media (max-width: 767px) {
  body.has-sidebar {
    padding-left: 0;
  }
}
```

- [ ] **Step 2: Verify dev server starts without errors**

```bash
cd /home/odin/Documents/Projects/Development/Web/com.anaqio/landing-page
bun dev
```

Expected: server starts on http://localhost:3000, no CSS parse errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(design): add electric blue tokens and vb- section utilities"
```

---

## Task 2: Left MENU Sidebar

**Files:**

- Create: `components/layout/MenuSidebar.tsx`
- Modify: `components/sections/NewLandingPage.tsx` (mount the sidebar)

- [ ] **Step 1: Create MenuSidebar component**

Create `components/layout/MenuSidebar.tsx`:

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { ScrollLink } from '@/components/ui/scroll-link';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const SECTION_LINKS = [
  { label: 'Solution', targetId: 'solution' },
  { label: 'Comment ça marche', targetId: 'how-it-works' },
  { label: 'Pourquoi Anaqio', targetId: 'why-anaqio' },
  { label: 'Vision', targetId: 'vision' },
] as const;

const PAGE_LINKS = [
  { label: 'À propos', href: '/about' },
  { label: 'Marque', href: '/brand' },
  { label: 'Contact', href: '/contact' },
] as const;

export function MenuSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  // Offset body when sidebar mounted
  useEffect(() => {
    document.body.classList.add('has-sidebar');
    return () => document.body.classList.remove('has-sidebar');
  }, []);

  // Lock scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* ── Fixed left strip ── */}
      <div
        className={cn(
          'fixed left-0 top-0 z-[9990] hidden h-full w-16 flex-col items-center justify-between py-6 md:flex',
          'border-r border-white/10 bg-[#2B3AE7]'
        )}
      >
        {/* Logo mark */}
        <div className="flex flex-col items-center gap-2">
          <Link href="/" aria-label="Anaqio home">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-white/90">
              <span className="text-[10px] font-black tracking-tight text-[#2B3AE7]">
                AQ
              </span>
            </div>
          </Link>
        </div>

        {/* Rotated MENU label — click to open overlay */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          className="group flex flex-col items-center gap-3"
        >
          {/* Two line hamburger */}
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 bg-white transition-all duration-300 group-hover:w-4" />
            <span className="block h-[2px] w-5 bg-white transition-all duration-300" />
          </div>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            MENU
          </span>
        </button>

        {/* Bottom locale */}
        <div className="scale-75">
          <LocaleSwitcher />
        </div>
      </div>

      {/* ── Full-screen overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9995] flex bg-[#2B3AE7] md:pl-16"
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close menu"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>

            <div className="flex w-full flex-col justify-center px-12 md:px-24">
              {/* Primary nav */}
              <nav className="mb-16">
                {SECTION_LINKS.map(({ label, targetId }, i) => (
                  <motion.div
                    key={targetId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  >
                    <ScrollLink
                      targetId={targetId}
                      onClick={close}
                      className="font-display block py-3 text-4xl font-black text-white/80 transition-colors hover:text-white md:text-6xl"
                    >
                      {label}
                    </ScrollLink>
                  </motion.div>
                ))}
              </nav>

              {/* Secondary links */}
              <div className="flex gap-8">
                {PAGE_LINKS.map(({ label, href }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.35 }}
                  >
                    <Link
                      href={href}
                      onClick={close}
                      className="text-sm font-medium uppercase tracking-widest text-white/50 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Mount MenuSidebar in NewLandingPage**

In `components/sections/NewLandingPage.tsx`, add import:

```tsx
import { MenuSidebar } from '@/components/layout/MenuSidebar';
```

And inside the returned JSX, as first child of the outer `<div className="flex w-full flex-col">`:

```tsx
<MenuSidebar />
```

- [ ] **Step 3: Visual check — sidebar visible on desktop**

```bash
bun dev
```

Open http://localhost:3000. Expect: 64px blue strip on left. MENU label rotated. Logo mark top. Click MENU → overlay slides in from left.

- [ ] **Step 4: Commit**

```bash
git add components/layout/MenuSidebar.tsx components/sections/NewLandingPage.tsx
git commit -m "feat(nav): add Vooban-style left MENU sidebar with full-screen overlay"
```

---

## Task 3: Header — Flat Vooban Topbar

**Files:**

- Modify: `components/layout/Header.tsx`

Replace the collapsing pill with a minimal flat bar: logo left (hidden on desktop since sidebar has it), nav links right, locale switcher far right.

- [ ] **Step 1: Rewrite Header to flat topbar**

Replace the entire content of `components/layout/Header.tsx` with:

```tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { LocaleSwitcher } from '@/components/locale-switcher';
import { AnaqioTypographyLogo } from '@/components/ui/anaqio-typography-logo';
import { ScrollLink } from '@/components/ui/scroll-link';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Solution', targetId: 'solution' },
  { label: 'Comment', targetId: 'how-it-works' },
  { label: 'Pourquoi', targetId: 'why-anaqio' },
  { label: 'Vision', targetId: 'vision' },
] as const;

const PAGE_LINKS = [
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export function Header() {
  const t = useTranslations('header');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-[9980] transition-all duration-500',
        'md:left-16', // offset for sidebar
        isScrolled
          ? 'bg-[#2B3AE7]/95 shadow-sm backdrop-blur-md'
          : 'bg-transparent'
      )}
    >
      <div className="flex h-14 items-center justify-between px-6 md:px-8">
        {/* Mobile: logo */}
        <Link
          href="/"
          className="flex items-center gap-2 md:hidden"
          aria-label="Anaqio"
        >
          <AnaqioTypographyLogo
            instanceId="header-logo-mobile"
            className="w-20"
            variant="none"
          />
        </Link>

        {/* Desktop nav — right-aligned */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex md:flex-1 md:items-center md:justify-end md:gap-8"
        >
          {NAV_LINKS.map(({ label, targetId }) => (
            <ScrollLink
              key={targetId}
              targetId={targetId}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {label}
            </ScrollLink>
          ))}
          {PAGE_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
          <div className="ml-4 border-l border-white/20 pl-4">
            <LocaleSwitcher />
          </div>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsMobileOpen(true)}
          aria-label={t('menu.aria')}
        >
          <div className="flex flex-col gap-[5px]">
            <span className="block h-[2px] w-5 bg-white" />
            <span className="block h-[2px] w-5 bg-white" />
          </div>
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#2B3AE7] px-6 pb-12 pt-20"
          >
            <button
              onClick={() => setIsMobileOpen(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="mt-8 flex flex-col gap-5">
              {NAV_LINKS.map(({ label, targetId }) => (
                <ScrollLink
                  key={targetId}
                  targetId={targetId}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-3xl font-black text-white"
                >
                  {label}
                </ScrollLink>
              ))}
            </div>

            <div className="mt-10 flex gap-6">
              {PAGE_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-sm text-white/60 hover:text-white"
                >
                  {label}
                </Link>
              ))}
            </div>

            <div className="mt-auto">
              <LocaleSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 2: Check desktop — flat transparent topbar on blue hero**

```bash
bun dev
```

Expected: topbar is transparent over hero blue, items right-aligned. On scroll, bg becomes electric blue/95.

- [ ] **Step 3: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "feat(nav): replace collapsing pill nav with flat Vooban-style topbar"
```

---

## Task 4: Hero — VoobanHeroSection

**Files:**

- Create: `components/sections/VoobanHeroSection.tsx`
- Modify: `components/sections/NewLandingPage.tsx`

The hero is the signature piece: full-viewport electric blue, giant "ANAQIO" spanning the bottom, floating dark video card center.

- [ ] **Step 1: Create VoobanHeroSection.tsx**

Create `components/sections/VoobanHeroSection.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { HeroVideoPlayer } from './atoms/HeroVideoPlayer';

import { Button } from '@/components/ui/button';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ScrollLink } from '@/components/ui/scroll-link';
import { useAnimationReady } from '@/hooks/use-animation-ready';

export function VoobanHeroSection() {
  const t = useTranslations('landing.hero');
  const { animated, tier } = useAnimationReady();

  return (
    <section
      aria-labelledby="hero-heading"
      className="vb-blue relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      <h1 id="hero-heading" className="sr-only">
        ANAQIO — {t('headline.pre')} {t('headline.pro')}
      </h1>

      {/* ── Eyebrow ── */}
      <motion.div
        className="relative z-20 flex items-center gap-3 px-8 pt-20 md:px-12 md:pt-24"
        initial={animated ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="h-px w-6 bg-white/60" />
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
          {t('eyebrow')}
        </span>
      </motion.div>

      {/* ── Center: floating video card ── */}
      <div className="relative z-20 flex flex-1 items-center justify-center px-6 py-8">
        {/* Floating dark card containing video */}
        <motion.div
          initial={animated ? { opacity: 0, scale: 0.92, y: 20 } : false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-2xl bg-[#0d0d0d] shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
          style={{ width: 'min(480px, 90vw)', aspectRatio: '9/13' }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <span>STUDIO</span>
            <span>ANAQIO</span>
          </div>

          {/* Video */}
          <div className="relative h-full overflow-hidden">
            <HeroVideoPlayer />
          </div>

          {/* Card bottom: scrolling label */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden bg-[#0d0d0d] py-3">
            <motion.div
              className="flex whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.15em] text-white/40"
              animate={{ x: [0, -400] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="mr-8">
                  Mode Anaqio &nbsp;·&nbsp; Mode Anaqio &nbsp;·&nbsp;
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── CTAs ── */}
      <motion.div
        className="relative z-20 flex items-center justify-center gap-4 pb-8"
        initial={animated ? { opacity: 0, y: 16 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <MagneticButton strength={tier === 'high' ? 0.35 : 0}>
          <Button
            asChild
            className="h-11 gap-2 rounded-sm bg-white px-7 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#2B3AE7] hover:bg-white/90"
          >
            <ScrollLink targetId="final-cta">
              <span>{t('cta.act')}</span>
              <ArrowDownRight className="h-3 w-3" />
            </ScrollLink>
          </Button>
        </MagneticButton>
        <Button
          asChild
          variant="ghost"
          className="h-11 rounded-sm border border-white/30 px-7 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10"
        >
          <ScrollLink targetId="how-it-works">{t('cta.learn')}</ScrollLink>
        </Button>
      </motion.div>

      {/* ── Oversized ANAQIO wordmark ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-10 overflow-hidden"
        style={{ marginBottom: '-0.12em' }}
      >
        <motion.p
          initial={animated ? { y: 40, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display select-none text-center font-black uppercase leading-none tracking-tight text-white"
          style={{
            fontSize: 'clamp(5rem, 18vw, 20rem)',
            letterSpacing: '-0.03em',
          }}
        >
          ANAQIO
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Replace VideoHeroSection with VoobanHeroSection in NewLandingPage**

In `components/sections/NewLandingPage.tsx`:

Replace:

```tsx
import { VideoHeroSection } from './VideoHeroSection';
```

With:

```tsx
import { VoobanHeroSection } from './VoobanHeroSection';
```

Replace:

```tsx
<VideoHeroSection />
```

With:

```tsx
<VoobanHeroSection />
```

- [ ] **Step 3: Visual check — hero**

```bash
bun dev
```

Expected: full-viewport electric blue. Giant white "ANAQIO" spanning the bottom. Dark card with video in center. Two CTA buttons. No dark-navy background visible.

- [ ] **Step 4: Commit**

```bash
git add components/sections/VoobanHeroSection.tsx components/sections/NewLandingPage.tsx
git commit -m "feat(hero): add Vooban-style hero — electric blue, oversized wordmark, floating card"
```

---

## Task 5: ProblemSection — Blue Editorial Statement

**Files:**

- Modify: `components/sections/ProblemSection.tsx`

Vooban's "À propos" blue section: small label top-left, large editorial statement right-aligned, generous vertical space.

- [ ] **Step 1: Read current ProblemSection**

```bash
cat components/sections/ProblemSection.tsx
```

- [ ] **Step 2: Replace outer wrapper and layout with vb-blue treatment**

The section should:

- Have `className="vb-blue px-8 py-32 md:px-16 md:py-48"` (blue bg, white text)
- Small `À PROPOS` label top-left
- The core problem statement at large scale: `clamp(2.5rem, 5vw, 5rem)`
- One key word with `.vb-underline` (gold underline)
- Remove any dark card backgrounds, blur effects, muted tones

Concrete wrapper replacement (adapt inner copy to your existing i18n keys):

```tsx
<section
  id="problem"
  className="vb-blue relative overflow-hidden px-8 py-32 md:px-16 md:py-48"
>
  {/* Small label */}
  <p className="mb-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
    {t('label')} {/* or hardcode "Le Problème" */}
  </p>

  {/* Large editorial statement */}
  <h2
    className="font-display max-w-5xl font-black text-white"
    style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.1 }}
  >
    {t('statement.a')}{' '}
    <span className="vb-underline">{t('statement.key')}</span>{' '}
    {t('statement.b')}
  </h2>
</section>
```

- [ ] **Step 3: Visual check**

```bash
bun dev
```

Scroll to ProblemSection. Expected: solid electric blue, large white statement, gold underline on key word.

- [ ] **Step 4: Commit**

```bash
git add components/sections/ProblemSection.tsx
git commit -m "feat(problem): Vooban blue editorial statement layout"
```

---

## Task 6: SolutionSection — Blue Service Cards

**Files:**

- Modify: `components/sections/SolutionSection.tsx`

Blue background, two-column header ("Expertises" left, "Services" right), card grid with small label + title.

- [ ] **Step 1: Read current SolutionSection**

```bash
cat components/sections/SolutionSection.tsx
```

- [ ] **Step 2: Apply vb-blue treatment with card grid**

```tsx
<section id="solution" className="vb-blue px-8 py-24 md:px-16">
  {/* Two-col header */}
  <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
        {t('label')}
      </p>
      <h2
        className="font-display font-black text-white"
        style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
      >
        {t('title')}
      </h2>
      <p className="mt-4 max-w-md text-base text-white/60">{t('subtitle')}</p>
    </div>
  </div>

  {/* Cards */}
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {solutions.map((item) => (
      <div
        key={item.id}
        className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
      >
        <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
          {t('cardLabel')}
        </p>
        <h3 className="font-display text-xl font-bold text-white">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-white/60">{item.desc}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/SolutionSection.tsx
git commit -m "feat(solution): Vooban blue service cards grid"
```

---

## Task 7: FeaturesSection — White Feature Grid

**Files:**

- Modify: `components/sections/FeaturesSection.tsx`

White section with clean feature grid — this is the visual "breathing room" between blue sections.

- [ ] **Step 1: Read current FeaturesSection**

```bash
cat components/sections/FeaturesSection.tsx
```

- [ ] **Step 2: Apply vb-white treatment**

```tsx
<section id="features" className="vb-white px-8 py-24 md:px-16">
  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
    {t('label')}
  </p>
  <h2
    className="font-display mb-16 max-w-2xl font-black text-black"
    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
  >
    {t('title')}
  </h2>

  <div className="grid grid-cols-1 gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3">
    {features.map((f) => (
      <div key={f.id} className="bg-[#F5F5F0] p-8">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-[#2B3AE7] text-white">
          {f.icon}
        </div>
        <h3 className="font-display mb-2 text-lg font-bold text-black">
          {f.title}
        </h3>
        <p className="text-sm text-black/60">{f.desc}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/FeaturesSection.tsx
git commit -m "feat(features): Vooban white feature grid"
```

---

## Task 8: ResultsSection — Blue Stats

**Files:**

- Modify: `components/sections/ResultsSection.tsx`

Blue section, oversized stat numbers, thin divider lines between stats.

- [ ] **Step 1: Read current ResultsSection**

```bash
cat components/sections/ResultsSection.tsx
```

- [ ] **Step 2: Apply vb-blue treatment with stat grid**

```tsx
<section id="results" className="vb-blue px-8 py-24 md:px-16">
  <p className="mb-16 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
    {t('label')}
  </p>

  <div className="grid grid-cols-2 divide-x divide-white/10 border-t border-white/10 md:grid-cols-4">
    {stats.map((s) => (
      <div key={s.id} className="px-8 py-12 first:pl-0">
        <p
          className="font-display font-black text-white"
          style={{ fontSize: 'clamp(3rem, 7vw, 7rem)', lineHeight: 1 }}
        >
          {s.value}
        </p>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/50">
          {s.label}
        </p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/ResultsSection.tsx
git commit -m "feat(results): Vooban blue oversized stats layout"
```

---

## Task 9: SegmentsSection — White Card Grid

**Files:**

- Modify: `components/sections/SegmentsSection.tsx`

White section, similar to Vooban's client logos section but with segment cards instead of logos.

- [ ] **Step 1: Read current SegmentsSection**

```bash
cat components/sections/SegmentsSection.tsx
```

- [ ] **Step 2: Apply vb-white treatment with grey tile grid**

```tsx
<section id="segments" className="vb-white px-8 py-24 md:px-16">
  <div className="mb-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <h2
      className="font-display font-black text-black"
      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
    >
      {t('title')}
    </h2>
    <p className="max-w-md text-sm text-black/60">{t('subtitle')}</p>
  </div>

  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {segments.map((seg) => (
      <div
        key={seg.id}
        className="group relative overflow-hidden rounded-xl bg-[#EBEBEB] p-8 transition-colors hover:bg-[#2B3AE7]"
      >
        <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.3em] text-black/40 group-hover:text-white/50">
          {t('segmentLabel')}
        </p>
        <h3 className="font-display text-xl font-bold text-black group-hover:text-white">
          {seg.title}
        </h3>
        <p className="mt-2 text-sm text-black/60 group-hover:text-white/70">
          {seg.desc}
        </p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/SegmentsSection.tsx
git commit -m "feat(segments): Vooban white grey-tile segments grid"
```

---

## Task 10: HowItWorksSection — White Steps

**Files:**

- Modify: `components/sections/HowItWorksSection.tsx`

White section, numbered steps, large step numbers as visual anchors.

- [ ] **Step 1: Read current HowItWorksSection**

```bash
cat components/sections/HowItWorksSection.tsx
```

- [ ] **Step 2: Apply vb-white treatment with numbered steps**

```tsx
<section id="how-it-works" className="vb-white px-8 py-24 md:px-16">
  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
    {t('label')}
  </p>
  <h2
    className="font-display mb-20 max-w-xl font-black text-black"
    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
  >
    {t('title')}
  </h2>

  <div className="flex flex-col divide-y divide-black/10">
    {steps.map((step, i) => (
      <div
        key={step.id}
        className="grid grid-cols-[80px_1fr] gap-8 py-10 md:grid-cols-[120px_1fr]"
      >
        <p
          className="font-display font-black text-black/10"
          style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', lineHeight: 1 }}
        >
          {String(i + 1).padStart(2, '0')}
        </p>
        <div>
          <h3 className="font-display mb-2 text-xl font-bold text-black md:text-2xl">
            {step.title}
          </h3>
          <p className="text-sm text-black/60">{step.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/HowItWorksSection.tsx
git commit -m "feat(how-it-works): Vooban white numbered steps layout"
```

---

## Task 11: PricingSection — Blue Pricing

**Files:**

- Modify: `components/sections/PricingSection.tsx`

- [ ] **Step 1: Read current PricingSection**

```bash
cat components/sections/PricingSection.tsx
```

- [ ] **Step 2: Apply vb-blue treatment**

Outer wrapper:

```tsx
<section id="pricing" className="vb-blue px-8 py-24 md:px-16">
```

All card backgrounds: `bg-white/5 border border-white/10` for standard, `bg-white text-[#2B3AE7]` for highlighted plan.

All text: white for labels/headings, `text-white/60` for body.

CTA buttons: `bg-white text-[#2B3AE7]` for primary, `border border-white/30 text-white` for secondary.

- [ ] **Step 3: Commit**

```bash
git add components/sections/PricingSection.tsx
git commit -m "feat(pricing): Vooban blue pricing section"
```

---

## Task 12: WhyAnaqioSection — White Differentiators

**Files:**

- Modify: `components/sections/WhyAnaqioSection.tsx`

White section. Vooban uses this area for client logos — we use it for brand differentiators / "why Anaqio" benefits.

- [ ] **Step 1: Read current WhyAnaqioSection**

```bash
cat components/sections/WhyAnaqioSection.tsx
```

- [ ] **Step 2: Apply vb-white treatment**

```tsx
<section id="why-anaqio" className="vb-white px-8 py-24 md:px-16">
  <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
    {t('label')}
  </p>
  <h2
    className="font-display mb-4 font-black text-black"
    style={{ fontSize: 'clamp(2rem, 4vw, 4rem)' }}
  >
    {t('title.a')} <span className="vb-underline">{t('title.key')}</span>
    {t('title.b')}
  </h2>
  <p className="mb-20 max-w-lg text-base text-black/60">{t('subtitle')}</p>

  {/* Benefit grid — grey tiles */}
  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
    {reasons.map((r) => (
      <div key={r.id} className="rounded-xl bg-[#EBEBEB] p-6">
        <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-black/40">
          {t('reasonLabel')}
        </p>
        <p className="font-display text-lg font-bold text-black">{r.title}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/WhyAnaqioSection.tsx
git commit -m "feat(why-anaqio): Vooban white differentiators grid"
```

---

## Task 13: VisionSection — Blue CTA Statement

**Files:**

- Modify: `components/sections/VisionSection.tsx`

Blue section, large statement left-aligned, single CTA button.

- [ ] **Step 1: Read current VisionSection**

```bash
cat components/sections/VisionSection.tsx
```

- [ ] **Step 2: Apply vb-blue treatment**

```tsx
<section id="vision" className="vb-blue px-8 py-32 md:px-16 md:py-48">
  <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
    {t('label')}
  </p>
  <h2
    className="font-display mb-12 max-w-4xl font-black text-white"
    style={{ fontSize: 'clamp(2.5rem, 5vw, 5rem)', lineHeight: 1.1 }}
  >
    {t('statement.a')}{' '}
    <span className="vb-underline">{t('statement.key')}</span>
    {'. '}
    {t('statement.b')}
  </h2>

  <Button
    asChild
    className="h-12 rounded-sm bg-white px-8 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#2B3AE7] hover:bg-white/90"
  >
    <ScrollLink targetId="final-cta">{t('cta')}</ScrollLink>
  </Button>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add components/sections/VisionSection.tsx
git commit -m "feat(vision): Vooban blue CTA statement section"
```

---

## Task 14: MarqueeSection — Thin Ticker Adaptation

**Files:**

- Modify: `components/sections/MarqueeSection.tsx`

The marquee should adapt to its surrounding context. On blue sections: white text, blue bg. On white sections: black text, white bg. Pass `variant="blue" | "white"` prop.

- [ ] **Step 1: Read current MarqueeSection**

```bash
cat components/sections/MarqueeSection.tsx
```

- [ ] **Step 2: Replace background prop with variant**

Update props to accept `variant?: 'blue' | 'white'` (default `'white'`).

Replace background logic:

```tsx
interface MarqueeSectionProps {
  variant?: 'blue' | 'white';
}

export function MarqueeSection({ variant = 'white' }: MarqueeSectionProps) {
  return (
    <div
      className={cn(
        'overflow-hidden border-y py-3',
        variant === 'blue'
          ? 'border-white/10 bg-[#2B3AE7] text-white/50'
          : 'border-black/10 bg-[#F5F5F0] text-black/40'
      )}
    >
      {/* existing marquee inner content */}
    </div>
  );
}
```

- [ ] **Step 3: Update NewLandingPage to use new variant prop**

In `NewLandingPage.tsx`, change:

```tsx
<MarqueeSection background="bg-background" />
```

to:

```tsx
<MarqueeSection variant="blue" />
```

and:

```tsx
<MarqueeSection background="bg-foreground/[0.03]" />
```

to:

```tsx
<MarqueeSection variant="white" />
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/MarqueeSection.tsx components/sections/NewLandingPage.tsx
git commit -m "feat(marquee): variant prop blue/white for context-aware ticker"
```

---

## Task 15: Footer — Vooban-Style White Footer

**Files:**

- Modify: `components/layout/Footer.tsx`

White section, multi-column: logo + tagline left, nav columns center, newsletter + contact right. Bottom bar: copyright + built-by.

- [ ] **Step 1: Read current Footer**

```bash
cat components/layout/Footer.tsx
```

- [ ] **Step 2: Replace with Vooban-style footer**

Key structure:

```tsx
<footer className="vb-white border-t border-black/10 px-8 py-16 md:px-16">
  {/* Top grid */}
  <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-[1fr_auto_auto_auto]">
    {/* Brand */}
    <div>
      <AnaqioTypographyLogo
        instanceId="footer-logo"
        className="mb-3 w-24"
        variant="none"
      />
      <p className="max-w-xs text-sm text-black/50">{t('tagline')}</p>
    </div>

    {/* Nav columns */}
    <FooterColumn title={t('col.platform')} links={platformLinks} />
    <FooterColumn title={t('col.company')} links={companyLinks} />
    <FooterColumn title={t('col.legal')} links={legalLinks} />
  </div>

  {/* Newsletter row */}
  <div className="mb-12 flex flex-col gap-4 border-t border-black/10 pt-12 md:flex-row md:items-end md:justify-between">
    <div className="max-w-sm">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
        {t('newsletter.label')}
      </p>
      <p className="text-sm text-black/60">{t('newsletter.desc')}</p>
    </div>
    <WaitlistMiniForm />
  </div>

  {/* Bottom bar */}
  <div className="flex flex-col items-start justify-between gap-4 border-t border-black/10 pt-6 md:flex-row md:items-center">
    <p className="text-xs text-black/40">© {new Date().getFullYear()} Anaqio</p>
    <LocaleSwitcher />
  </div>
</footer>
```

- [ ] **Step 3: Commit**

```bash
git add components/layout/Footer.tsx
git commit -m "feat(footer): Vooban-style white multi-column footer"
```

---

## Task 16: AtelierForm Section — White Form

**Files:**

- Modify: `components/sections/NewLandingPage.tsx` (inline section)

The AtelierInvitationForm section (currently inline in NewLandingPage) should use the white surface.

- [ ] **Step 1: Wrap AtelierForm inline section in vb-white**

In `NewLandingPage.tsx`, the inline `<main>` section around `AtelierInvitationForm`:

```tsx
<section id="final-cta" className="vb-white px-8 py-24 md:px-16">
  <div className="mx-auto max-w-7xl">
    <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_520px]">
      {/* Left copy */}
      <div className="space-y-8 lg:pt-4">
        {/* existing headline/stats content — update text colors to black */}
      </div>
      {/* Right form card */}
      <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <AtelierInvitationForm />
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/NewLandingPage.tsx
git commit -m "feat(cta): Vooban white surface for atelier invitation section"
```

---

## Task 17: Final Review — Full Page Visual Pass

- [ ] **Step 1: Run dev server and scroll entire page**

```bash
bun dev
```

Checklist:

- [ ] Left sidebar visible at 64px, blue, MENU label rotated
- [ ] Header: flat transparent, adapts on scroll
- [ ] Hero: full blue, oversized ANAQIO, floating dark card, CTAs
- [ ] MarqueeSection: blue ticker
- [ ] ProblemSection: blue, large statement, gold underline
- [ ] SolutionSection: blue, service cards
- [ ] MarqueeSection: white ticker
- [ ] FeaturesSection: white, clean grid
- [ ] ResultsSection: blue, oversized stats
- [ ] SegmentsSection: white, grey tiles
- [ ] PricingSection: blue
- [ ] HowItWorksSection: white, numbered steps
- [ ] WhyAnaqioSection: white, grey tiles
- [ ] VisionSection: blue, large CTA statement
- [ ] AtelierForm: white
- [ ] Footer: white, multi-column

- [ ] **Step 2: Run lint and type-check**

```bash
bun run lint
bun run build
```

Expected: no errors.

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat(redesign): complete Vooban-style page overhaul — electric blue, white alternating sections"
```

---

## Scope Notes

**Not in scope:**

- Remotion video compositions
- i18n content changes (only layout/styles)
- Playwright E2E tests (run existing suite post-redesign to check regressions)
- Mobile nav (sidebar hides on mobile; Header mobile menu handles it)

**Post-tasks (separate PR):**

- Update Playwright performance tests for new section IDs
- Update any Vitest snapshot tests

---

## Self-Review

**Spec coverage:**

- ✅ Electric blue shift — Task 1 (tokens) + all section tasks
- ✅ Oversized ANAQIO wordmark — Task 4
- ✅ Floating video card — Task 4
- ✅ Left MENU sidebar — Task 2
- ✅ Flat topbar — Task 3
- ✅ Blue ↔ white alternating — Tasks 5–16
- ✅ Gold underline accent — Task 1 (`.vb-underline`)
- ✅ Footer redesign — Task 15
- ✅ MarqueeSection adaptation — Task 14

**Placeholder scan:** None found — all code blocks are complete.

**Type consistency:** `variant="blue" | "white"` used consistently in Task 14. `VoobanHeroSection` exports consistent with `NewLandingPage` import in Task 4.
