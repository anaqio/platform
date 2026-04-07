import { describe, it, expect } from 'vitest';

import { MARQUEE_ITEMS } from '@/lib/data/marquee-content';

describe('marquee-content', () => {
  it('should export MARQUEE_ITEMS array with 5 items', () => {
    expect(MARQUEE_ITEMS).toHaveLength(5);
  });

  it('should have required properties on each item', () => {
    MARQUEE_ITEMS.forEach((item) => {
      expect(item).toHaveProperty('text');
      expect(item).toHaveProperty('emoji');
      expect(typeof item.text).toBe('string');
      expect(typeof item.emoji).toBe('string');
    });
  });

  it('should not have empty text values', () => {
    MARQUEE_ITEMS.forEach((item) => {
      expect(item.text.trim()).not.toBe('');
    });
  });
});
