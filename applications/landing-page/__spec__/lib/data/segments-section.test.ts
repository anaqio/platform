import { describe, it, expect } from 'vitest'

import { SEGMENTS } from '@/lib/data/segments-section'

describe('segments-section', () => {
  it('should export SEGMENTS array with 4 items', () => {
    expect(SEGMENTS).toHaveLength(4)
  })

  it('should have required properties on each segment', () => {
    SEGMENTS.forEach((segment) => {
      expect(segment).toHaveProperty('icon')
      expect(segment).toHaveProperty('name')
      expect(segment).toHaveProperty('role')
      expect(segment).toHaveProperty('problem')
      expect(segment).toHaveProperty('solution')
    })
  })
})
