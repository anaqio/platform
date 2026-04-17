'use client'

import { motion, useReducedMotion } from 'framer-motion'

import type { ElementType } from 'react'

import { fadeUpCard } from '@/lib/data/motion'
import { cn } from '@/lib/utils'

type FeatureCardProps = {
  title: string
  body: string
  /** Position index used for stagger delay. */
  index?: number
  /** Lucide icon component to display in the icon box. */
  icon?: ElementType
  /** Numbered label (e.g. "01") — shown instead of icon when provided. */
  label?: string
  /**
   * `default` — light border + white/50 background (feature grids on light bg).
   * `glass`   — white/4 background (cards on dark or blurred surfaces).
   */
  variant?: 'default' | 'glass'
  className?: string
}

/**
 * Reusable animated card for feature grids, how-it-works steps, and audience cards.
 * Handles its own reduced-motion preference internally.
 */
export function FeatureCard({
  title,
  body,
  index = 0,
  icon: Icon,
  label,
  variant = 'default',
  className,
}: FeatureCardProps) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      {...fadeUpCard(reduced, index)}
      className={cn(
        'group cursor-pointer rounded-xl border p-6 backdrop-blur-sm transition-all duration-300',
        'hover:-translate-y-1 hover:border-aq-blue/25 hover:shadow-[0_8px_30px_rgba(37,99,235,0.1)]',
        variant === 'default'
          ? 'border-border/60 bg-white/5'
          : 'border-white/[0.08] bg-white/[0.04]',
        className
      )}
    >
      {label && (
        <span className="text-brand-gradient mb-3 inline-block font-display text-2xl font-bold">
          {label}
        </span>
      )}
      {Icon && (
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-aq-blue/10 text-aq-blue transition-colors duration-300 group-hover:bg-aq-blue/15">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      )}
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  )
}
