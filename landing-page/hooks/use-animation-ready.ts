'use client';

import { useReducedMotion } from 'framer-motion';

import { useDeviceTier } from '@/hooks/use-device-tier';

/**
 * Combines `useReducedMotion()` and `useDeviceTier()` into a single hook.
 *
 * Returns `animated = false` when the user prefers reduced motion **or**
 * their device is classified as low-tier — so every section can just write:
 *
 *   const { animated } = useAnimationReady();
 */
export function useAnimationReady() {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const animated = !reduced && tier !== 'low';

  return { reduced, tier, animated };
}
