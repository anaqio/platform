# section-header

**Source:** [components/ui/section-header.tsx](../../components/ui/section-header.tsx)

Client component (`'use client'`). Exports the animated section heading block and the inline gradient accent helper.

## `SectionHeader`

Renders an animated `<motion.h2>` containing an uppercase eyebrow label above the heading text. Animation is driven by [[motion#fadeUp|fadeUp]] and respects the OS reduced-motion preference automatically via `useReducedMotion()`.

### Props

| Prop        | Type        | Required | Description                                                               |
| ----------- | ----------- | -------- | ------------------------------------------------------------------------- | -------------------------------------------- |
| `eyebrow`   | `string`    | yes      | Small uppercase label rendered above the `h2`. E.g. `"Product Benefits"`. |
| `children`  | `ReactNode` | yes      | The heading text. Nest [[feature-card#GradientText                        | GradientText]] inside for the accented word. |
| `className` | `string`    | no       | Merged onto the `motion.h2` element.                                      |

### Default classes on `h2`

```
font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl
```

Responsive scale: `4xl` → `5xl` → `6xl`. Uses the `font-display` (Cormorant) typeface.

### Eyebrow classes (internal `<span>`)

```
mb-2 block w-full text-center text-sm font-normal uppercase tracking-[0.2em] text-muted-foreground
```

---

## `GradientText`

Inline `<span>` that applies the `text-brand-gradient` utility and italic styling. Intended to accent one or two words inside a `SectionHeader`.

### Props

| Prop        | Type        | Required | Description                                  |
| ----------- | ----------- | -------- | -------------------------------------------- |
| `children`  | `ReactNode` | yes      | The accented word(s).                        |
| `className` | `string`    | no       | Additional classes merged onto the `<span>`. |

### Default classes

```
text-brand-gradient font-bold italic
```

---

## Usage

```tsx
import { GradientText, SectionHeader } from '@/components/ui/section-header';

<SectionHeader eyebrow="Product Benefits">
  Why <GradientText>Anaqio</GradientText> is Better?
</SectionHeader>;
```

The heading re-animates each time it enters the viewport (controlled by `viewport: { once: true }` — it animates once and stays visible).

---

## Related

- [[motion]] — provides `fadeUp`; pass `useReducedMotion()` result
- [[section]] — `SectionContainer` wraps the header
- [[feature-card]] — follows the header in the typical section layout
- [[building-a-section]] — complete section assembly example
