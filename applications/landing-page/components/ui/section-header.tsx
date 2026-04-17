'use client'

import { motion, useReducedMotion } from 'framer-motion'

import type { ReactNode } from 'react'

import { fadeUp } from '@/lib/data/motion'
import { cn } from '@/lib/utils'

type SectionHeaderProps = {
  /** Small uppercase label above the heading. */
  eyebrow: string
  /** h2 content — use GradientText for the accented word. */
  children: ReactNode
  className?: string
}

/**
 * Animated section heading: eyebrow label + h2 with gradient accent.
 *
 * @example
 * <SectionHeader eyebrow="Product Benefits">
 *   Why <GradientText>Anaqio</GradientText> is Better?
 * </SectionHeader>
 */
export function SectionHeader({ eyebrow, children, className }: SectionHeaderProps) {
  const reduced = useReducedMotion()

  return (
    <motion.h2
      {...fadeUp(reduced)}
      className={cn(
        'font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl',
        className
      )}
    >
      <span className="mb-2 block w-full text-sm font-normal uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </span>
      {children}
    </motion.h2>
  )
}

/**
 * Inline gradient + italic accent word for use inside SectionHeader.
 *
 * @example
 * Why <GradientText>Anaqio</GradientText> is Better?
 */
export function GradientText({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('text-brand-gradient font-bold italic', className)}>{children}</span>
}
