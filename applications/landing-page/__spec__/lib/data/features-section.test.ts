import { describe, it, expect } from 'vitest'

import { FEATURES } from '@/lib/data/features-section'

describe('features-section', () => {
  it('should export FEATURES array with 3 items', () => {
    expect(FEATURES).toHaveLength(3)
  })

  it('should have required properties on each feature', () => {
    FEATURES.forEach((feature) => {
      expect(feature).toHaveProperty('icon')
      expect(feature).toHaveProperty('title')
      expect(feature).toHaveProperty('description')
      expect(typeof feature.icon).toBe('string')
      expect(typeof feature.title).toBe('string')
      expect(typeof feature.description).toBe('string')
    })
  })
})
