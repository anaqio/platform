import { describe, expect, it } from 'vitest';

import { ObjectBuilder } from '@/lib/utils/object-builder';

describe('ObjectBuilder', () => {
  describe('passthrough', () => {
    it('should return same object when no format is provided', () => {
      const input = { a: 'A', b: 'B' };
      expect(ObjectBuilder(input)).toEqual(input);
    });

    it('should return empty object when no format and empty input', () => {
      expect(ObjectBuilder({})).toEqual({});
    });
  });

  describe('string mapping (key renaming)', () => {
    it('should rename keys using string mapping', () => {
      const input = { firstName: 'John', lastName: 'Doe' };
      const format = { name: 'firstName', surname: 'lastName' };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ name: 'John', surname: 'Doe' });
    });

    it('should treat non-existent string keys as literal values', () => {
      const input = { existing: 'value' };
      const format = { staticValue: 'nonExistent' };
      const result = ObjectBuilder(input, format);

      // 'nonExistent' is not in input, so it's treated as a literal string
      expect(result).toEqual({ staticValue: 'nonExistent' });
    });
  });

  describe('function mapping (transformation)', () => {
    it('should transform values using function mapping', () => {
      const input = { first: 'John', last: 'Doe' };
      const format = {
        fullName: (i: Record<string, unknown>) => `${i.first} ${i.last}`,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ fullName: 'John Doe' });
    });

    it('should compute derived values', () => {
      const input = { price: 100, quantity: 5 };
      const format = {
        total: (i: Record<string, unknown>) =>
          (i.price as number) * (i.quantity as number),
        formatted: (i: Record<string, unknown>) =>
          `$${(i.price as number) * (i.quantity as number)}`,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ total: 500, formatted: '$500' });
    });

    it('should access multiple input keys in transformation', () => {
      const input = { city: 'Casablanca', country: 'Morocco' };
      const format = {
        location: (i: Record<string, unknown>) => `${i.city}, ${i.country}`,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ location: 'Casablanca, Morocco' });
    });
  });

  describe('literal value mapping', () => {
    it('should assign static literal values', () => {
      const input = { id: 1 };
      const format = { id: 1, type: 'user', active: true };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ id: 1, type: 'user', active: true });
    });

    it('should assign object literals', () => {
      const input = { id: 1 };
      const format = { id: 1, metadata: { source: 'api', version: '1.0' } };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({
        id: 1,
        metadata: { source: 'api', version: '1.0' },
      });
    });
  });

  describe('mixed format mapping', () => {
    it('should handle all mapping types in single format', () => {
      const input = { firstName: 'John', lastName: 'Doe', age: 30 };
      const format = {
        fullName: (i: Record<string, unknown>) =>
          `${i.firstName} ${i.lastName}`,
        name: 'firstName' as keyof typeof input,
        type: 'premium' as const,
        isAdult: (i: Record<string, unknown>) => (i.age as number) >= 18,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({
        fullName: 'John Doe',
        name: 'John',
        type: 'premium',
        isAdult: true,
      });
    });

    it('should preserve order of format keys', () => {
      const input = { a: 1, b: 2, c: 3 };
      const format = {
        x: 'a' as keyof typeof input,
        y: (i: Record<string, unknown>) => (i.b as number) * 2,
        z: 100,
      };
      const result = ObjectBuilder(input, format);

      expect(Object.keys(result)).toEqual(['x', 'y', 'z']);
      expect(result).toEqual({ x: 1, y: 4, z: 100 });
    });
  });

  describe('edge cases', () => {
    it('should handle empty format object', () => {
      const input = { a: 1, b: 2 };
      const format = {} as const;
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({});
    });

    it('should handle empty input with literal format', () => {
      const input = {};
      const format = { static: 'value' };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ static: 'value' });
    });

    it('should handle nested objects passthrough', () => {
      const input = { user: { name: 'John', age: 30 } };
      const format = { userData: 'user' };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ userData: { name: 'John', age: 30 } });
    });

    it('should handle null-like values', () => {
      const input = { zero: 0, empty: '', falsy: false, nil: null };
      const format = {
        zero: 'zero' as keyof typeof input,
        empty: 'empty' as keyof typeof input,
        falsy: 'falsy' as keyof typeof input,
        nil: 'nil' as keyof typeof input,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ zero: 0, empty: '', falsy: false, nil: null });
    });

    it('should handle array values', () => {
      const input = { tags: ['a', 'b', 'c'] };
      const format = {
        tags: 'tags' as keyof typeof input,
        count: (i: Record<string, unknown>) => (i.tags as unknown[]).length,
      };
      const result = ObjectBuilder(input, format);

      expect(result).toEqual({ tags: ['a', 'b', 'c'], count: 3 });
    });
  });

  describe('type safety', () => {
    it('should infer correct output type', () => {
      const input = { name: 'John', age: 30 };
      const format = {
        name: 'name' as keyof typeof input,
        age: 'age' as keyof typeof input,
      };
      const result = ObjectBuilder(input, format);

      // Type checking: result should have name (string) and age (number)
      expect(typeof result.name).toBe('string');
      expect(typeof result.age).toBe('number');
    });

    it('should transform types correctly', () => {
      const input = { value: '42' };
      const format = {
        numeric: (i: Record<string, unknown>) => Number(i.value),
      };
      const result = ObjectBuilder(input, format);

      expect(typeof result.numeric).toBe('number');
      expect(result.numeric).toBe(42);
    });
  });
});
