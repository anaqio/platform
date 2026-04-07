import { describe, it, expect } from 'vitest';

import { PRICING_TIERS } from '@/lib/data/pricing-section';

describe('pricing-section', () => {
  it('should export PRICING_TIERS array with 3 items', () => {
    expect(PRICING_TIERS).toHaveLength(3);
  });

  it('should have required properties on each tier', () => {
    PRICING_TIERS.forEach((tier) => {
      expect(tier).toHaveProperty('name');
      expect(tier).toHaveProperty('price');
      expect(tier).toHaveProperty('currency');
      expect(tier).toHaveProperty('period');
      expect(tier).toHaveProperty('description');
      expect(tier).toHaveProperty('features');
      expect(Array.isArray(tier.features)).toBe(true);
      expect(tier.features.length).toBeGreaterThan(0);
    });
  });

  it('should have a highlighted tier', () => {
    const highlighted = PRICING_TIERS.filter((t) => t.highlighted);
    expect(highlighted).toHaveLength(1);
  });
});
