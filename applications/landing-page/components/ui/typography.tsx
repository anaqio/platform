import { cva, type VariantProps } from 'class-variance-authority'
import { type ElementType, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

// ─── Variant definitions ───────────────────────────────────────────────────────
//
// Maps to the ANAQIO type system:
//   font-display  → Cormorant Garamond (editorial / brand headings)
//   font-body     → DM Sans            (UI / body copy)
//   font-editorial→ Instrument Serif   (quotes / accent prose)
//
// Design token reference:
//   tracking-display (0.01em) — headings
//   tracking-label   (0.3em)  — eyebrow / labels
//   tracking-editorial(0.04em)— Instrument Serif prose

const typographyVariants = cva('', {
  variants: {
    variant: {
      // ── Display (hero headline) ─────────────────────────────────────────────
      display:
        'font-display text-5xl font-semibold leading-[1.02] tracking-display sm:text-6xl lg:text-8xl',

      // ── Headings ────────────────────────────────────────────────────────────
      h1: 'scroll-m-20 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl',
      h2: 'scroll-m-20 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-5xl',
      h3: 'scroll-m-20 font-display text-2xl font-semibold leading-snug tracking-tight sm:text-3xl',
      h4: 'scroll-m-20 font-display text-xl font-semibold leading-snug tracking-tight',
      h5: 'scroll-m-20 font-body text-lg font-semibold leading-snug',
      h6: 'scroll-m-20 font-body text-base font-semibold leading-snug',

      // ── Body ────────────────────────────────────────────────────────────────
      p: 'font-body leading-7 [&:not(:first-child)]:mt-6',
      lead: 'font-body text-lg leading-relaxed text-muted-foreground sm:text-xl',
      large: 'font-body text-lg font-semibold',
      small: 'font-body text-sm font-medium leading-none',
      muted: 'font-body text-sm text-muted-foreground',

      // ── Editorial / Accent ──────────────────────────────────────────────────
      blockquote:
        'font-editorial mt-6 border-l-2 border-aq-blue/40 pl-6 text-lg italic leading-relaxed tracking-editorial text-foreground/80',
      quote: 'font-editorial text-xl italic leading-relaxed tracking-editorial sm:text-2xl',

      // ── Labels / UI chrome ──────────────────────────────────────────────────
      eyebrow: 'font-label text-[0.65rem] font-bold uppercase tracking-label text-muted-foreground',
      label: 'font-label text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground',
      caption:
        'font-body text-[0.72rem] font-light leading-snug tracking-wide text-muted-foreground',

      // ── Code ────────────────────────────────────────────────────────────────
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

// ─── Default HTML element per variant ────────────────────────────────────────

const DEFAULT_ELEMENT: Record<
  NonNullable<VariantProps<typeof typographyVariants>['variant']>,
  ElementType
> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  lead: 'p',
  large: 'p',
  small: 'p',
  muted: 'p',
  blockquote: 'blockquote',
  quote: 'p',
  eyebrow: 'p',
  label: 'p',
  caption: 'p',
  code: 'code',
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface TypographyProps extends VariantProps<typeof typographyVariants> {
  /** Override the rendered HTML element (polymorphic). */
  as?: ElementType
  children?: ReactNode
  className?: string
  id?: string
}

/**
 * Unified typography primitive for the ANAQIO design system.
 *
 * Uses Cormorant Garamond for headings, DM Sans for UI/body, and
 * Instrument Serif for editorial accents — all wired to the project's
 * Tailwind font tokens.
 *
 * @example
 * // Section heading with brand gradient accent
 * <Typography variant="h2">
 *   Redefine your <span className="text-brand-gradient">studio</span>
 * </Typography>
 *
 * // Eyebrow label above a heading
 * <Typography variant="eyebrow">Early Access · Q3 2026</Typography>
 * <Typography variant="h1">Fashion's Virtual Studio</Typography>
 *
 * // Editorial quote
 * <Typography variant="blockquote">
 *   Fashion is the armour to survive everyday life.
 * </Typography>
 *
 * // Force a different HTML element (polymorphic)
 * <Typography variant="h2" as="h3">Visually h2, semantically h3</Typography>
 */
export function Typography({
  variant = 'p',
  as,
  className,
  children,
  id,
  ...props
}: TypographyProps) {
  const Element = as ?? DEFAULT_ELEMENT[variant ?? 'p']
  return (
    <Element id={id} className={cn(typographyVariants({ variant }), className)} {...props}>
      {children}
    </Element>
  )
}

// ─── Named shorthands for even cleaner imports ────────────────────────────────
//
// Instead of <Typography variant="h1"> you can write <H1>.
// Each passes through all props, including `as` and `className`.

export const Display = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="display" {...props} />
)
export const H1 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h1" {...props} />
)
export const H2 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h2" {...props} />
)
export const H3 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h3" {...props} />
)
export const H4 = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="h4" {...props} />
)
export const Lead = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="lead" {...props} />
)
export const BodyLarge = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="large" {...props} />
)
export const BodySmall = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="small" {...props} />
)
export const Muted = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="muted" {...props} />
)
export const Eyebrow = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="eyebrow" {...props} />
)
export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" {...props} />
)
export const Blockquote = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="blockquote" {...props} />
)
export const InlineCode = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="code" {...props} />
)
