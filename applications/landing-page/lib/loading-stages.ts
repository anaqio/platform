// ─── Shared Loading Stages ──────────────────────────────────────────────────
// Used by both app/loading.tsx and components/sections/LoadingScreen.tsx
// to keep stage labels and thresholds consistent.

import type { NavigatorWithCapabilities } from '@/lib/types/navigator'

export const LOADING_STAGES = [
  { threshold: 0, key: 'initializing' },
  { threshold: 25, key: 'assets' },
  { threshold: 60, key: 'rendering' },
  { threshold: 88, key: 'studio' },
  { threshold: 100, key: 'ready' },
] as const

export type LoadingStage = (typeof LOADING_STAGES)[number]
export type LoadingStageKey = LoadingStage['key']
export type ConnectionTier = 'fast' | 'moderate' | 'slow'
export type DeviceTier = 'high' | 'mid' | 'low'

export function resolveStage(progress: number): LoadingStage {
  return [...LOADING_STAGES].reverse().find((s) => progress >= s.threshold) ?? LOADING_STAGES[0]
}

/**
 * Classify connection quality using the Network Information API.
 * Falls back to 'moderate' when the API is unavailable (Firefox, Safari).
 */
export function getConnectionTier(): ConnectionTier {
  if (typeof navigator === 'undefined') return 'moderate'
  const conn = (navigator as NavigatorWithCapabilities).connection
  if (!conn) return 'moderate'
  const { effectiveType, downlink } = conn
  if (
    effectiveType === 'slow-2g' ||
    effectiveType === '2g' ||
    (downlink !== undefined && downlink < 1.5)
  )
    return 'slow'
  if (effectiveType === '3g' || (downlink !== undefined && downlink < 5)) return 'moderate'
  return 'fast'
}

/**
 * Adaptive safety timeout (ms) so slow devices / connections never hang.
 * Device tier × connection tier compound to determine the ceiling.
 */
export function getSafetyTimeout(deviceTier: DeviceTier, conn: ConnectionTier): number {
  const base: Record<ConnectionTier, number> = {
    fast: 4000,
    moderate: 6500,
    slow: 12000,
  }
  const multiplier: Record<DeviceTier, number> = {
    high: 1,
    mid: 1.3,
    low: 1.8,
  }
  return base[conn] * multiplier[deviceTier]
}

/**
 * Module-level state for incremental byte tracking to avoid O(N^2) scans.
 * We use PerformanceObserver to track new entries as they arrive.
 */
let totalTransferred = 0
let totalDecoded = 0
let observerInitialized = false
let observerHasFired = false

/**
 * Ensures the PerformanceObserver is active and capturing incremental updates.
 * Falls back to manual sum when observer is unavailable or hasn't fired yet.
 */
function ensureObserver(): void {
  if (observerInitialized || typeof PerformanceObserver === 'undefined') return

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      for (let i = 0; i < entries.length; i++) {
        const e = entries[i] as PerformanceResourceTiming
        totalTransferred += e.transferSize ?? 0
        totalDecoded += e.decodedBodySize ?? 0
      }
      observerHasFired = true
    })

    // buffered: true ensures we get all previous resource entries in the first callback.
    observer.observe({ type: 'resource', buffered: true })
    observerInitialized = true
  } catch {
    // Observer not supported or failed to start
  }
}

/**
 * Sum actual bytes transferred from PerformanceResourceTiming entries.
 * Returns 0 when the API is unavailable.
 */
export function getBytesTransferred(): number {
  if (typeof performance === 'undefined') return 0
  ensureObserver()

  // If the observer has fired, we can rely on the incrementally updated totals.
  if (observerHasFired) {
    return totalTransferred
  }

  // Fallback for first call (before observer fires) or when observer is unavailable.
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  let sum = 0
  for (let i = 0; i < entries.length; i++) {
    sum += entries[i].transferSize ?? 0
  }
  return sum
}

/**
 * Sum decoded (uncompressed) body sizes — a better proxy for render work.
 */
export function getBytesDecoded(): number {
  if (typeof performance === 'undefined') return 0
  ensureObserver()

  if (observerHasFired) {
    return totalDecoded
  }

  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  let sum = 0
  for (let i = 0; i < entries.length; i++) {
    sum += entries[i].decodedBodySize ?? 0
  }
  return sum
}
