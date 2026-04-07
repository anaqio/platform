import { describe, expect, it } from 'vitest';

import {
  DataManager,
  DataManagerWithExtras,
  type TranslationFn,
} from '@/lib/utils/data-manager';

function mockT(data: Record<string, unknown>): TranslationFn {
  return { raw: (key: string) => data[key] };
}

describe('DataManager', () => {
  it('returns raw translation data for a given key', () => {
    const t = mockT({ steps: [{ num: '1', title: 'Upload' }] });
    const result = DataManager<Array<{ num: string; title: string }>>(
      t,
      'steps'
    );
    expect(result).toEqual([{ num: '1', title: 'Upload' }]);
  });

  it('returns a string value', () => {
    const t = mockT({ headline: 'Welcome' });
    expect(DataManager<string>(t, 'headline')).toBe('Welcome');
  });

  it('returns undefined for a missing key', () => {
    const t = mockT({});
    expect(DataManager<unknown>(t, 'missing')).toBeUndefined();
  });

  it('returns nested object data', () => {
    const nested = { a: { b: { c: 42 } } };
    const t = mockT({ deep: nested });
    expect(DataManager<typeof nested>(t, 'deep')).toEqual(nested);
  });
});

describe('DataManagerWithExtras', () => {
  it('merges extras onto each raw item', () => {
    const t = mockT({
      audiences: [
        { title: 'Brands', body: 'For brands' },
        { title: 'Designers', body: 'For designers' },
      ],
    });
    const icons = ['IconA', 'IconB'];

    const result = DataManagerWithExtras(
      t,
      'audiences',
      icons,
      (item, icon) => ({ ...item, icon })
    );

    expect(result).toEqual([
      { title: 'Brands', body: 'For brands', icon: 'IconA' },
      { title: 'Designers', body: 'For designers', icon: 'IconB' },
    ]);
  });

  it('passes the index to the merge function', () => {
    const t = mockT({ items: [{ name: 'a' }, { name: 'b' }] });
    const colors = ['red', 'blue'];

    const result = DataManagerWithExtras(
      t,
      'items',
      colors,
      (item, color, index) => ({ ...item, color, index })
    );

    expect(result[0]).toEqual({ name: 'a', color: 'red', index: 0 });
    expect(result[1]).toEqual({ name: 'b', color: 'blue', index: 1 });
  });

  it('handles empty arrays', () => {
    const t = mockT({ items: [] });
    const result = DataManagerWithExtras(t, 'items', [], (item) => item);
    expect(result).toEqual([]);
  });

  it('handles extras longer than raw array (extra entries ignored)', () => {
    const t = mockT({ items: [{ v: 1 }] });
    const extras = ['a', 'b', 'c'];

    const result = DataManagerWithExtras(t, 'items', extras, (item, extra) => ({
      ...item,
      extra,
    }));

    expect(result).toEqual([{ v: 1, extra: 'a' }]);
  });

  it('handles extras shorter than raw array (extra is undefined)', () => {
    const t = mockT({ items: [{ v: 1 }, { v: 2 }] });
    const extras = ['a'];

    const result = DataManagerWithExtras(t, 'items', extras, (item, extra) => ({
      ...item,
      extra,
    }));

    expect(result).toEqual([
      { v: 1, extra: 'a' },
      { v: 2, extra: undefined },
    ]);
  });
});
