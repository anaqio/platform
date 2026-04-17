/**
 * Data Manager (functional lambda blackbox)
 *
 * Extracts raw translation data via a pre-bound `useTranslations` result.
 * Accepts a translation function + key, returns typed data.
 *
 * Usage:
 *   const t = useTranslations('landing.whoItsFor');
 *   const audiences = DataManager<Array<{ title: string; body: string }>>(t, 'audiences');
 */

export type TranslationFn = {
  raw(key: string): unknown
}

export function DataManager<T>(t: TranslationFn, key: string): T {
  return t.raw(key) as T
}

/**
 * Variant that merges extra props (icons, colors, etc.) onto each item in an array.
 *
 * Usage:
 *   const points = DataManagerWithExtras(t, 'points', POINT_ICONS, (item, icon) => ({ ...item, icon }));
 */
export function DataManagerWithExtras<TRaw extends object, TExtra, TResult>(
  t: TranslationFn,
  key: string,
  extras: TExtra[],
  merge: (item: TRaw, extra: TExtra, index: number) => TResult
): TResult[] {
  const raw = t.raw(key) as TRaw[]
  return raw.map((item, i) => merge(item, extras[i], i))
}
