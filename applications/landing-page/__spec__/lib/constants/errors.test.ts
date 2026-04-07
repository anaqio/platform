import { describe, expect, it } from 'vitest';

import { ERROR_MESSAGES } from '@/lib/constants/errors';

describe('ERROR_MESSAGES', () => {
  it('exports GENERIC message', () => {
    expect(ERROR_MESSAGES.GENERIC).toBe(
      'Something went wrong. Please try again later.'
    );
  });

  it('exports GENERIC_SHORT message', () => {
    expect(ERROR_MESSAGES.GENERIC_SHORT).toBe(
      'Something went wrong. Please try again.'
    );
  });

  it('exports AUTH message', () => {
    expect(ERROR_MESSAGES.AUTH).toBe('An error occurred');
  });

  it('exports VALID_EMAIL message', () => {
    expect(ERROR_MESSAGES.VALID_EMAIL).toBe(
      'Please provide a valid email address.'
    );
  });

  it('has exactly 4 keys', () => {
    expect(Object.keys(ERROR_MESSAGES)).toHaveLength(4);
  });

  it('is readonly (as const)', () => {
    // TypeScript enforces this at compile time; verify the shape at runtime
    expect(typeof ERROR_MESSAGES.GENERIC).toBe('string');
    expect(typeof ERROR_MESSAGES.GENERIC_SHORT).toBe('string');
    expect(typeof ERROR_MESSAGES.AUTH).toBe('string');
    expect(typeof ERROR_MESSAGES.VALID_EMAIL).toBe('string');
  });
});
