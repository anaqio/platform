import { describe, expect, test } from 'bun:test'

import { computeEventStats } from './event-stats'

describe('computeEventStats', () => {
  test('counts total, active, upcoming, and past events', () => {
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const stats = computeEventStats([
      { is_active: true, start_at: future, end_at: null },
      { is_active: false, start_at: null, end_at: past },
      { is_active: true, start_at: null, end_at: null },
    ])

    expect(stats).toEqual({
      total: 3,
      active: 2,
      upcoming: 1,
      past: 1,
    })
  })
})
