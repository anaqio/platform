import { describe, expect, it, vi, beforeEach, afterAll } from 'vitest';

import { cn } from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      // Basic merge
      expect(cn('p-2', 'm-2')).toBe('p-2 m-2');

      // Conflict resolution (tailwind-merge behavior)
      expect(cn('p-2 p-4')).toBe('p-4');

      // With clsx logic (conditional classes)
      expect(cn('p-2', { 'bg-red-500': true, 'bg-blue-500': false })).toBe(
        'p-2 bg-red-500'
      );

      // Arrays and undefined/null
      expect(cn('p-2', ['flex', undefined], null, false)).toBe('p-2 flex');
    });
  });

  describe('hasEnvVars', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      vi.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should be truthy when env vars are present', async () => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = 'anon-key';

      const { hasEnvVars } = await import('../../../lib/utils');
      expect(hasEnvVars).toBeTruthy();
    });

    it('should be falsy when env vars are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;
      delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

      const { hasEnvVars } = await import('../../../lib/utils');
      expect(hasEnvVars).toBeFalsy();
    });
  });
});
