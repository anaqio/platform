import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useInterval } from '@/hooks/use-interval'

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call the callback after the specified delay', () => {
    const callback = vi.fn()
    renderHook(() => useInterval(callback, 1000))

    expect(callback).not.toHaveBeenCalled()

    // Fast-forward time by 1000ms
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)

    // Fast-forward another 1000ms
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call the callback if delay is null', () => {
    const callback = vi.fn()
    renderHook(() => useInterval(callback, null))

    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should clear the interval on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useInterval(callback, 1000))

    unmount()
    vi.advanceTimersByTime(5000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should update the interval when delay changes', () => {
    const callback = vi.fn()
    const { rerender } = renderHook(({ delay }) => useInterval(callback, delay), {
      initialProps: { delay: 1000 },
    })

    // After 500ms, callback shouldn't be called yet
    vi.advanceTimersByTime(500)
    expect(callback).not.toHaveBeenCalled()

    // Change delay to 2000ms
    rerender({ delay: 2000 })

    // The previous 1000ms interval is cleared, and a new 2000ms one starts.
    // Advance 1000ms (1500ms total) - still not called.
    vi.advanceTimersByTime(1000)
    expect(callback).not.toHaveBeenCalled()

    // Advance another 1000ms (2500ms total, 2000ms since rerender) - should be called.
    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
