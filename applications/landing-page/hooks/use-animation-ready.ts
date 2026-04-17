'use client'

import { useReducedMotion } from 'framer-motion'

import { useDeviceTier } from '@/hooks/use-device-tier'
import { useMounted } from '@/hooks/use-mounted'

/**
 * Combines `useReducedMotion()`, `useDeviceTier()`, and `useMounted()` into a single hook.
 *
 * Returns `animated = false` and `reduced = false` when:
 *  1. The component is not yet mounted (SSR and first client pass).
 *
 * This prevents hydration mismatches by ensuring the initial client render
 * matches the server-rendered HTML.
 *
 * @example
 * const { animated, reduced } = useAnimationReady();
 */
export function useAnimationReady() {
  const mounted = useMounted()
  const reducedMotionPref = useReducedMotion()
  const tier = useDeviceTier()

  // Force defaults during SSR and initial client pass to ensure hydration match.
  // We assume a "standard" capable device with no reduced motion for the baseline render.
  const reduced = mounted ? reducedMotionPref : false
  const animated = mounted && !reduced && tier !== 'low'

  return { reduced, tier, animated, mounted }
}
