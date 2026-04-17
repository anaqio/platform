# DataManager

**Source:** [lib/utils/data-manager.ts](../../lib/utils/data-manager.ts)

Typed accessor for `next-intl` raw translation data. Replaces the repeated `t.raw('key') as SomeType` pattern across section components with a single generic entry point.

## `TranslationFn`

```ts
export type TranslationFn = {
  raw(key: string): unknown
}
```

Minimal interface satisfied by the return value of `useTranslations()`. Keeps the utility decoupled from `next-intl` internals.

## `DataManager<T>`

```ts
function DataManager<T>(t: TranslationFn, key: string): T
```

Extracts and casts raw translation data in one call.

| Param | Type            | Description                                    |
| ----- | --------------- | ---------------------------------------------- |
| `t`   | `TranslationFn` | Result of `useTranslations(namespace)`         |
| `key` | `string`        | JSON key within the namespace (e.g. `'steps'`) |

**Returns:** `T` — the raw JSON value cast to the supplied generic.

### Example

```tsx
const t = useTranslations('landing.howItWorks')
const steps = DataManager<Array<{ num: string; title: string; body: string }>>(t, 'steps')
```

**Before (inline pattern):**

```tsx
const steps = t.raw('steps') as Array<{
  num: string
  title: string
  body: string
}>
```

## `DataManagerWithExtras<TRaw, TExtra, TResult>`

```ts
function DataManagerWithExtras<TRaw, TExtra, TResult>(
  t: TranslationFn,
  key: string,
  extras: TExtra[],
  merge: (item: TRaw, extra: TExtra, index: number) => TResult
): TResult[]
```

Extracts a raw translation array and merges a parallel array of non-serializable values (icons, colors, callbacks) onto each item.

| Param    | Type                                                    | Description                            |
| -------- | ------------------------------------------------------- | -------------------------------------- |
| `t`      | `TranslationFn`                                         | Result of `useTranslations(namespace)` |
| `key`    | `string`                                                | JSON key for the array                 |
| `extras` | `TExtra[]`                                              | Parallel array (icons, colors, etc.)   |
| `merge`  | `(item: TRaw, extra: TExtra, index: number) => TResult` | Combiner function per item             |

**Returns:** `TResult[]` — merged array.

### Example

```tsx
const t = useTranslations('landing.whoItsFor')
const AUDIENCE_ICONS = [Store, Palette, Briefcase, LayoutGrid]

const audiences = DataManagerWithExtras(t, 'audiences', AUDIENCE_ICONS, (a, icon) => ({
  ...a,
  icon,
}))
```

**Before (inline pattern):**

```tsx
const audiences = (t.raw('audiences') as Array<{ title: string; body: string }>).map((a, i) => ({
  ...a,
  icon: AUDIENCE_ICONS[i],
}))
```

## Sections using this pattern

These components currently use the inline `t.raw()` pattern and are candidates for refactoring to `DataManager`:

| Section             | Namespace            | Key                 | Extras        |
| ------------------- | -------------------- | ------------------- | ------------- |
| `WhoItsForSection`  | `landing.whoItsFor`  | `audiences`         | Icons         |
| `WhoItsForSection`  | `landing.whoItsFor`  | `features`          | —             |
| `WhyAnaqioSection`  | `landing.whyAnaqio`  | `points`            | Icons         |
| `VisionSection`     | `landing.vision`     | `points`            | Icons, colors |
| `ProblemSection`    | `landing.problem`    | `painPoints`        | Icons         |
| `SolutionSection`   | `landing.solution`   | `pipeline`          | Colors        |
| `HowItWorksSection` | `landing.howItWorks` | `steps`             | —             |
| `SupportLine`       | `landing.hero`       | `supportLine.words` | —             |
