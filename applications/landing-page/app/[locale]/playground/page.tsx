'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────
   Navigation Sections
   ───────────────────────────────────────────── */

const NAV_SECTIONS = [
  { id: 'colors', label: 'Colors', icon: '◆' },
  { id: 'typography', label: 'Typography', icon: '𝐓' },
  { id: 'buttons', label: 'Buttons', icon: '⊡' },
  { id: 'cards', label: 'Cards & Glass', icon: '▢' },
  { id: 'badges', label: 'Badges', icon: '◈' },
  { id: 'inputs', label: 'Inputs', icon: '▤' },
  { id: 'animations', label: 'Animations', icon: '◎' },
  { id: 'gradients', label: 'Gradients', icon: '◐' },
  { id: 'spacing', label: 'Spacing', icon: '⊞' },
] as const

/* ─────────────────────────────────────────────
   Color Definitions
   ───────────────────────────────────────────── */

const BRAND_COLORS = [
  { name: 'aq-blue', value: '#2563EB', tw: 'bg-aq-blue' },
  { name: 'aq-purple', value: '#7C3AED', tw: 'bg-aq-purple' },
  { name: 'aq-white', value: '#F8FAFC', tw: 'bg-aq-white' },
  { name: 'aq-ink', value: '#0F172A', tw: 'bg-aq-ink' },
  { name: 'aq-slate', value: '#334155', tw: 'bg-aq-slate' },
  { name: 'aq-muted', value: '#94A3B8', tw: 'bg-aq-muted' },
  { name: 'aq-border', value: '#E2E8F0', tw: 'bg-aq-border' },
  { name: 'aq-surface', value: '#F1F5F9', tw: 'bg-aq-surface' },
]

const GRADIENT_COLORS = [
  { name: 'grad-start', value: '#3F57AF', tw: 'bg-aq-grad-start' },
  { name: 'grad-mid1', value: '#484DA9', tw: 'bg-aq-grad-mid1' },
  { name: 'grad-mid2', value: '#6049A8', tw: 'bg-aq-grad-mid2' },
  { name: 'grad-end', value: '#6F47A7', tw: 'bg-aq-grad-end' },
]

const SEMANTIC_COLORS = [
  { name: 'background', value: 'hsl(210 40% 98%)', cssVar: '--background' },
  { name: 'foreground', value: 'hsl(222 47% 11%)', cssVar: '--foreground' },
  { name: 'primary', value: 'hsl(221 83% 53%)', cssVar: '--primary' },
  { name: 'secondary', value: 'hsl(210 40% 96%)', cssVar: '--secondary' },
  { name: 'muted', value: 'hsl(214 32% 91%)', cssVar: '--muted' },
  { name: 'accent', value: 'hsl(263 83% 58%)', cssVar: '--accent' },
  { name: 'destructive', value: 'hsl(0 84.2% 60.2%)', cssVar: '--destructive' },
]

/* ─────────────────────────────────────────────
   Helper Components
   ───────────────────────────────────────────── */

function SectionHeading({
  id,
  title,
  description,
}: {
  id: string
  title: string
  description: string
}) {
  return (
    <div id={id} className="mb-8 scroll-mt-8">
      <h2 className="text-display mb-2 text-3xl text-foreground">{title}</h2>
      <p className="text-body max-w-2xl text-muted-foreground">{description}</p>
    </div>
  )
}

function ColorSwatch({
  name,
  value,
  className,
}: {
  name: string
  value: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [value])

  return (
    <button
      onClick={handleCopy}
      className="group flex flex-col items-center gap-2 transition-transform hover:scale-105 focus:outline-none"
    >
      <div
        className={cn(
          'relative h-20 w-20 rounded-xl border border-border shadow-sm transition-shadow group-hover:shadow-lg',
          className
        )}
        style={!className ? { backgroundColor: value } : undefined}
      >
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center rounded-xl bg-foreground/80 font-mono text-xs text-background"
            >
              Copied!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="text-caption text-muted-foreground">{name}</span>
      <span className="font-mono text-[10px] text-muted-foreground/60">{value}</span>
    </button>
  )
}

/* ─────────────────────────────────────────────
   Main Page
   ───────────────────────────────────────────── */

export default function PlaygroundPage() {
  const [activeSection, setActiveSection] = useState('colors')
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for sidebar highlighting
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    )

    const sections = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    sections.forEach((el) => observerRef.current?.observe(el!))

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-gradient flex h-8 w-8 items-center justify-center rounded-lg">
              <Link href="/" aria-label="Anaqio Homepage">
                <span className="text-sm font-bold text-white">A</span>
              </Link>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">
                Design Playground
              </h1>
              <p className="text-caption text-muted-foreground">Anaqio Design System</p>
            </div>
          </div>
          <Badge variant="brand">Dev Only</Badge>
        </div>
      </header>

      <div className="mx-auto flex max-w-screen-2xl">
        {/* ── Sidebar ── */}
        <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-56 shrink-0 border-r border-border p-4 lg:block">
          <nav className="flex flex-col gap-1">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-200',
                  activeSection === section.id
                    ? 'bg-aq-blue/10 font-medium text-aq-blue'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <span className="text-xs opacity-60">{section.icon}</span>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 px-8 py-10 lg:px-12">
          {/* ━━━━━━━━━ COLORS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="colors"
              title="Colors & Brand Palette"
              description="The complete Anaqio color system. Click any swatch to copy its value."
            />

            <h3 className="text-headline mb-4 text-lg text-foreground">Brand Colors</h3>
            <div className="mb-10 flex flex-wrap gap-6">
              {BRAND_COLORS.map((c) => (
                <ColorSwatch key={c.name} name={c.name} value={c.value} className={c.tw} />
              ))}
            </div>

            <h3 className="text-headline mb-4 text-lg text-foreground">Gradient Stops</h3>
            <div className="mb-10 flex flex-wrap gap-6">
              {GRADIENT_COLORS.map((c) => (
                <ColorSwatch key={c.name} name={c.name} value={c.value} className={c.tw} />
              ))}
            </div>

            <h3 className="text-headline mb-4 text-lg text-foreground">Semantic Tokens</h3>
            <div className="flex flex-wrap gap-6">
              {SEMANTIC_COLORS.map((c) => (
                <ColorSwatch key={c.name} name={c.name} value={c.value} />
              ))}
            </div>
          </section>

          {/* ━━━━━━━━━ TYPOGRAPHY ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="typography"
              title="Typography System"
              description="Font families, weights, and typographic scale used across the product."
            />

            <div className="space-y-10">
              {[
                {
                  label: 'Display — Space Grotesk',
                  className: 'text-display',
                  sizes: ['text-5xl', 'text-4xl', 'text-3xl', 'text-2xl'],
                },
                {
                  label: 'Headline — Space Grotesk',
                  className: 'text-headline',
                  sizes: ['text-3xl', 'text-2xl', 'text-xl', 'text-lg'],
                },
                {
                  label: 'Body — Inter',
                  className: 'text-body',
                  sizes: ['text-lg', 'text-base', 'text-sm'],
                },
                {
                  label: 'Caption — Inter',
                  className: 'text-caption',
                  sizes: ['text-sm', 'text-xs'],
                },
                {
                  label: 'CTA — Inter',
                  className: 'text-cta',
                  sizes: ['text-sm', 'text-xs'],
                },
                {
                  label: 'Editorial — Instrument Serif',
                  className: 'font-editorial',
                  sizes: ['text-4xl', 'text-3xl', 'text-2xl'],
                },
                {
                  label: 'Wordmark — Bodoni Moda',
                  className: 'text-wordmark',
                  sizes: ['text-4xl', 'text-3xl', 'text-2xl'],
                },
                {
                  label: 'Mono — JetBrains Mono',
                  className: 'font-mono',
                  sizes: ['text-base', 'text-sm', 'text-xs'],
                },
              ].map((family) => (
                <div
                  key={family.label}
                  className="rounded-xl border border-border bg-secondary/30 p-6"
                >
                  <p className="text-caption mb-4 uppercase text-aq-blue">{family.label}</p>
                  <div className="space-y-3">
                    {family.sizes.map((size) => (
                      <div key={size} className="flex items-baseline gap-4">
                        <span className="w-20 shrink-0 font-mono text-[10px] text-muted-foreground/50">
                          {size}
                        </span>
                        <p className={cn(family.className, size, 'text-foreground')}>
                          The quick brown fox jumps
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ━━━━━━━━━ BUTTONS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="buttons"
              title="Button Variants"
              description="All button variants and sizes from the design system."
            />

            {(
              ['default', 'brand', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
            ).map((variant) => (
              <div key={variant} className="mb-8">
                <p className="text-caption mb-3 uppercase text-aq-blue">
                  variant=&quot;{variant}&quot;
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant={variant} size="lg">
                    Large
                  </Button>
                  <Button variant={variant}>Default</Button>
                  <Button variant={variant} size="sm">
                    Small
                  </Button>
                  <Button variant={variant} size="icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm0 12.5a5.5 5.5 0 110-11 5.5 5.5 0 010 11zM8 4a.75.75 0 01.75.75v2.5h2.5a.75.75 0 010 1.5h-2.5v2.5a.75.75 0 01-1.5 0v-2.5h-2.5a.75.75 0 010-1.5h2.5v-2.5A.75.75 0 018 4z" />
                    </svg>
                  </Button>
                  <Button variant={variant} disabled>
                    Disabled
                  </Button>
                </div>
              </div>
            ))}
          </section>

          {/* ━━━━━━━━━ CARDS & GLASS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="cards"
              title="Cards & Glass Effects"
              description="Card component and glassmorphism surface treatments."
            />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {/* Standard Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Standard Card</CardTitle>
                  <CardDescription>Default card component from shadcn/ui</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Uses the default card styling with rounded corners, border, and shadow.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm" variant="outline">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              {/* Glass */}
              <div className="glass rounded-xl p-6">
                <h3 className="text-headline mb-2 text-lg text-foreground">.glass</h3>
                <p className="text-sm text-muted-foreground">
                  backdrop-blur-xl · bg-card/60 · border-border/30 · noise overlay
                </p>
              </div>

              {/* Glass Strong */}
              <div className="glass-strong rounded-xl p-6">
                <h3 className="text-headline mb-2 text-lg text-foreground">.glass-strong</h3>
                <p className="text-sm text-muted-foreground">
                  backdrop-blur-2xl · bg-card/80 · border-border/20 · heavier noise
                </p>
              </div>

              {/* Glass Card */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-headline mb-2 text-lg text-foreground">.glass-card</h3>
                <p className="text-sm text-muted-foreground">
                  backdrop-blur-lg · bg-card/40 · border-border/10 · subtle noise
                </p>
              </div>

              {/* Noise Overlay */}
              <div className="noise-overlay rounded-xl bg-aq-blue/10 p-6">
                <h3 className="text-headline mb-2 text-lg text-foreground">.noise-overlay</h3>
                <p className="text-sm text-muted-foreground">
                  Film-grain texture overlay for depth
                </p>
              </div>
            </div>
          </section>

          {/* ━━━━━━━━━ BADGES ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="badges"
              title="Badge Variants"
              description="Inline status indicators and labels."
            />

            <div className="flex flex-wrap gap-4">
              {(['default', 'brand', 'secondary', 'destructive', 'outline'] as const).map(
                (variant) => (
                  <div key={variant} className="flex flex-col items-center gap-2">
                    <Badge variant={variant}>{variant}</Badge>
                    <span className="font-mono text-[10px] text-muted-foreground/50">
                      {variant}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>

          {/* ━━━━━━━━━ INPUTS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="inputs"
              title="Input & Form Elements"
              description="Text input states and form patterns."
            />

            <div className="grid max-w-xl gap-6">
              <div className="space-y-2">
                <Label htmlFor="default-input">Default Input</Label>
                <Input id="default-input" placeholder="Type something..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filled-input">Filled Input</Label>
                <Input id="filled-input" defaultValue="hello@anaqio.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disabled-input">Disabled Input</Label>
                <Input id="disabled-input" disabled placeholder="Cannot edit" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-input">Error State</Label>
                <Input
                  id="error-input"
                  className="border-destructive focus-visible:ring-destructive"
                  defaultValue="invalid@"
                />
                <p className="text-xs text-destructive">Please enter a valid email address.</p>
              </div>
            </div>
          </section>

          {/* ━━━━━━━━━ ANIMATIONS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="animations"
              title="Animations & Transitions"
              description="Live demonstrations of all keyframe animations in the design system."
            />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {/* Gradient Shift */}
              <AnimationCard
                title="gradient-shift"
                className="animate-gradient bg-brand-gradient"
              />

              {/* Glow Pulse */}
              <AnimationCard title="glow-pulse">
                <div className="animate-glow mx-auto h-12 w-12 rounded-full bg-aq-blue" />
              </AnimationCard>

              {/* Float */}
              <AnimationCard title="float">
                <div className="animate-float mx-auto h-10 w-10 rounded-lg bg-aq-purple" />
              </AnimationCard>

              {/* Float Slow */}
              <AnimationCard title="float-slow">
                <div className="animate-float-slow mx-auto h-10 w-10 rounded-full bg-aq-grad-mid1" />
              </AnimationCard>

              {/* Shimmer */}
              <AnimationCard title="shimmer">
                <div className="animate-shimmer h-6 w-full rounded-md bg-muted bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              </AnimationCard>

              {/* Hero Glow */}
              <AnimationCard title="hero-glow">
                <div className="animate-hero-glow mx-auto h-16 w-16 rounded-xl bg-aq-blue/20" />
              </AnimationCard>

              {/* Depth Pulse */}
              <AnimationCard title="depth-pulse">
                <div className="animate-depth-pulse mx-auto h-12 w-12 rounded-lg bg-aq-purple/30" />
              </AnimationCard>

              {/* Framer Motion Spring */}
              <AnimationCard title="Framer Motion Spring">
                <motion.div
                  className="mx-auto h-12 w-12 rounded-xl bg-aq-blue"
                  animate={{ rotate: [0, 90, 0] }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </AnimationCard>

              {/* Entrance */}
              <AnimationCard title="page-entrance">
                <EntranceDemo />
              </AnimationCard>
            </div>
          </section>

          {/* ━━━━━━━━━ GRADIENTS & EFFECTS ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="gradients"
              title="Gradients & Effects"
              description="Brand gradients, text effects, and background treatments."
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/30 p-8">
                <p className="text-caption mb-3 uppercase text-aq-blue">.text-brand-gradient</p>
                <p className="text-brand-gradient text-display text-4xl">Anaqio Studio</p>
              </div>

              <div className="overflow-hidden rounded-xl">
                <div className="bg-brand-gradient p-8">
                  <p className="text-caption mb-3 uppercase text-white/60">.bg-brand-gradient</p>
                  <p className="text-display text-2xl text-white">Background Gradient</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl">
                <div className="bg-brand-diag p-8">
                  <p className="text-caption mb-3 uppercase text-white/60">.bg-brand-diag</p>
                  <p className="text-display text-2xl text-white">Diagonal + Hover</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-border">
                <div className="hero-gradient bg-background p-8">
                  <p className="text-caption mb-3 uppercase text-aq-blue">.hero-gradient</p>
                  <p className="text-display text-2xl text-foreground">Radial Hero Glow</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Multi-layered radial gradients for hero sections
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ━━━━━━━━━ SPACING ━━━━━━━━━ */}
          <section className="mb-20">
            <SectionHeading
              id="spacing"
              title="Spacing Scale"
              description="Visual reference for the Tailwind spacing system used in layout."
            />

            <div className="space-y-3">
              {[
                { name: '1', px: '4px' },
                { name: '2', px: '8px' },
                { name: '3', px: '12px' },
                { name: '4', px: '16px' },
                { name: '5', px: '20px' },
                { name: '6', px: '24px' },
                { name: '8', px: '32px' },
                { name: '10', px: '40px' },
                { name: '12', px: '48px' },
                { name: '16', px: '64px' },
                { name: '20', px: '80px' },
                { name: '24', px: '96px' },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-4">
                  <span className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground/50">
                    {s.name}
                  </span>
                  <div
                    className="h-5 rounded border border-aq-blue/15 bg-aq-blue/20"
                    style={{ width: s.px }}
                  />
                  <span className="font-mono text-[10px] text-muted-foreground/40">{s.px}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="border-t border-border pb-16 pt-8">
            <p className="text-caption text-center text-muted-foreground">
              Anaqio Design System Playground · For development use only
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Sub-Components
   ───────────────────────────────────────────── */

function AnimationCard({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-6">
      <p className="text-caption mb-4 uppercase text-aq-blue">{title}</p>
      {children ? (
        <div className="flex min-h-[80px] items-center justify-center">{children}</div>
      ) : (
        <div className={cn('h-20 w-full rounded-lg', className)} />
      )}
    </div>
  )
}

function EntranceDemo() {
  const [key, setKey] = useState(0)
  return (
    <div className="flex flex-col items-center gap-3">
      <div key={key} className="page-entrance h-10 w-10 rounded-lg bg-aq-blue" />
      <button
        onClick={() => setKey((k) => k + 1)}
        className="font-mono text-[10px] text-aq-blue/60 transition-colors hover:text-aq-blue"
      >
        Replay ↻
      </button>
    </div>
  )
}
