# motion

**Source:** [lib/motion.ts](../../lib/motion.ts)

Shared Framer Motion animation helpers. Every export accepts a `reduced` argument — the result of `useReducedMotion()` — so that animations are skipped for users who opt into reduced-motion at the OS level.

## `ease`

```ts
export const ease = [0.16, 1, 0.3, 1] as const
```

A custom cubic-bezier curve shared across all transitions. Produces a fast-out, slow-in feel that reads as snappy and premium.

## Animation Helpers

Each helper returns a plain object that can be spread onto any `motion.*` element.

### `fadeUp`

| Param     | Type              | Default | Description                                                                                |
| --------- | ----------------- | ------- | ------------------------------------------------------------------------------------------ |
| `reduced` | `boolean \| null` | —       | Pass `useReducedMotion()` result. When truthy, `initial` is set to `false` (no animation). |
| `delay`   | `number`          | `0`     | Seconds before the animation starts.                                                       |

**Initial state:** `{ opacity: 0, y: 20 }`
**Exit state:** `{ opacity: 1, y: 0 }`
**Duration:** `0.7 s`
**Viewport:** enters once, margin `-80px`

Use for section headings and large content blocks.

---

### `fadeUpCard`

| Param     | Type              | Default | Description                                                                    |
| --------- | ----------------- | ------- | ------------------------------------------------------------------------------ |
| `reduced` | `boolean \| null` | —       | Reduced-motion flag.                                                           |
| `index`   | `number`          | `0`     | Card position in the grid — multiplied by `0.1 s` to produce a stagger effect. |

**Initial state:** `{ opacity: 0, y: 24 }`
**Duration:** `0.5 s`
**Viewport:** enters once, margin `-60px`

Use on each [[feature-card]] in a grid. Pass the array index as `index` so cards reveal sequentially.

---

### `fadeIn`

| Param     | Type              | Default | Description                          |
| --------- | ----------------- | ------- | ------------------------------------ |
| `reduced` | `boolean \| null` | —       | Reduced-motion flag.                 |
| `delay`   | `number`          | `0`     | Seconds before the animation starts. |

**Initial state:** `{ opacity: 0 }` (no Y movement)
**Duration:** `0.6 s`

Use for footnotes, captions, and subtle reveals that should not slide.

---

### `slideInLeft`

| Param     | Type              | Default | Description                                       |
| --------- | ----------------- | ------- | ------------------------------------------------- |
| `reduced` | `boolean \| null` | —       | Reduced-motion flag.                              |
| `index`   | `number`          | `0`     | Row position — multiplied by `0.1 s` for stagger. |

**Initial state:** `{ opacity: 0, x: -16 }`
**Duration:** `0.5 s`
**Viewport:** enters once, margin `-60px`

Use for vertically stacked list rows (e.g. vision points, timeline entries).

---

## Usage

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, fadeUpCard, slideInLeft } from '@/lib/motion'

export function MySection() {
  const reduced = useReducedMotion()

  return (
    <section>
      <motion.h2 {...fadeUp(reduced)}>Heading</motion.h2>

      <ul>
        {items.map((item, i) => (
          <motion.li key={item.id} {...slideInLeft(reduced, i)}>
            {item.label}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
```

## Reduced-Motion Pattern

`useReducedMotion()` returns `true` when the OS "prefers-reduced-motion" media query is active, `false` otherwise, and `null` during SSR hydration. Each helper treats any truthy value as "skip animation" by setting `initial: false`, which tells Framer Motion to render the final state immediately.

**Always pass the hook result — never hard-code `false`.**

## Related

- [[section]] — layout wrappers that sections using these animations live inside
- [[section-header]] — uses `fadeUp` internally
- [[feature-card]] — uses `fadeUpCard` internally
- [[building-a-section]] — complete usage example
