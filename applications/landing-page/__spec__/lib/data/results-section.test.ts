import { describe, it, expect } from 'vitest';

import { RESULTS } from '@/lib/data/results-section';

describe('results-section', () => {
  it('should export RESULTS array with 3 items', () => {
    expect(RESULTS).toHaveLength(3);
  });

  it('should have required properties on each result card', () => {
    RESULTS.forEach((result) => {
      expect(result).toHaveProperty('metric');
      expect(result).toHaveProperty('traditional');
      expect(result).toHaveProperty('anaqio');
      expect(result).toHaveProperty('improvement');
      expect(typeof result.metric).toBe('string');
      expect(typeof result.traditional).toBe('string');
      expect(typeof result.anaqio).toBe('string');
      expect(typeof result.improvement).toBe('string');
    });
  });
});
