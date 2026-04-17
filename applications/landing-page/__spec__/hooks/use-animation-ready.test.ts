import { renderHook } from '@testing-library/react'
import { useReducedMotion } from 'framer-motion'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { useAnimationReady } from '@/hooks/use-animation-ready'
import { useDeviceTier } from '@/hooks/use-device-tier'

vi.mock('framer-motion', () => ({
  useReducedMotion: vi.fn(),
}))

vi.mock('@/hooks/use-device-tier', () => ({
  useDeviceTier: vi.fn(),
}))

describe('useAnimationReady', () => {
  beforeEach(() => {
    vi.mocked(useReducedMotion).mockReturnValue(false)
    vi.mocked(useDeviceTier).mockReturnValue('high')
  })

  it('returns animated true when reduced motion is false and tier is high', () => {
    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.reduced).toBe(false)
    expect(result.current.tier).toBe('high')
    expect(result.current.animated).toBe(true)
  })

  it('returns animated false when reduced motion is true', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)

    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.reduced).toBe(true)
    expect(result.current.animated).toBe(false)
  })

  it('returns animated false when device tier is low', () => {
    vi.mocked(useDeviceTier).mockReturnValue('low')

    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.tier).toBe('low')
    expect(result.current.animated).toBe(false)
  })

  it('returns animated true when device tier is mid', () => {
    vi.mocked(useDeviceTier).mockReturnValue('mid')

    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.tier).toBe('mid')
    expect(result.current.animated).toBe(true)
  })

  it('returns animated false when both reduced motion and low tier', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    vi.mocked(useDeviceTier).mockReturnValue('low')

    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.reduced).toBe(true)
    expect(result.current.tier).toBe('low')
    expect(result.current.animated).toBe(false)
  })

  it('returns animated false when reduced motion is true even with mid tier', () => {
    vi.mocked(useReducedMotion).mockReturnValue(true)
    vi.mocked(useDeviceTier).mockReturnValue('mid')

    const { result } = renderHook(() => useAnimationReady())

    expect(result.current.reduced).toBe(true)
    expect(result.current.tier).toBe('mid')
    expect(result.current.animated).toBe(false)
  })
})
