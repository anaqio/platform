# feature-card

**Source:** [components/ui/feature-card.tsx](../../components/ui/feature-card.tsx)

Client component (`'use client'`). A reusable animated card for feature grids, how-it-works steps, and audience cards. Manages its own reduced-motion preference internally via `useReducedMotion()`.

## `FeatureCard`

### Props

| Prop        | Type                   | Default     | Description                                                                                                                                             |
| ----------- | ---------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `title`     | `string`               | —           | **Required.** Bold card heading rendered as `<h3>`.                                                                                                     |
| `body`      | `string`               | —           | **Required.** Supporting copy rendered as `<p>`.                                                                                                        |
| `index`     | `number`               | `0`         | Position in the parent grid. Multiplied by `0.1 s` to produce a stagger delay (see [[motion#fadeUpCard                                                  | fadeUpCard]]). |
| `icon`      | `ElementType`          | —           | Lucide icon component. Displayed in a blue icon box above the title. Mutually exclusive with `label` (either or both may be omitted).                   |
| `label`     | `string`               | —           | Numbered label (e.g. `"01"`). Displayed in gradient text above the title. Takes visual priority over `icon` in rendered order (label first, then icon). |
| `variant`   | `'default' \| 'glass'` | `'default'` | Controls background and border style (see below).                                                                                                       |
| `className` | `string`               | —           | Merged onto the outer `motion.div`.                                                                                                                     |

### `variant` values

| Value     | Background        | Border                | Use when                                               |
| --------- | ----------------- | --------------------- | ------------------------------------------------------ |
| `default` | `bg-white/50`     | `border-border/60`    | Feature grids on light or neutral surfaces.            |
| `glass`   | `bg-white/[0.04]` | `border-white/[0.08]` | Cards placed on dark or blurred/glassmorphic surfaces. |

Both variants share hover behaviour: `hover:-translate-y-1` lift with a soft blue shadow.

### Stagger behaviour

Pass the array index from your `map()` call as `index`. The [[motion#fadeUpCard|fadeUpCard]] helper converts it to `delay: index * 0.1`, so cards in a grid animate in sequence from left-to-right / top-to-bottom.

```tsx
{
  features.map((feature, i) => <FeatureCard key={feature.title} {...feature} index={i} />)
}
```

### Icon vs label

- Use `icon` for generic feature grids where a visual metaphor matters.
- Use `label` for ordered steps or numbered lists (e.g. `"01"`, `"02"`).
- Omit both for plain text cards.

---

## Usage — icon variant

```tsx
import { Wand2 } from 'lucide-react'
import { FeatureCard } from '@/components/ui/feature-card'
;<FeatureCard
  title="AI Retouching"
  body="One-click background removal and professional lighting adjustments."
  icon={Wand2}
  index={0}
/>
```

## Usage — label (step) variant

```tsx
<FeatureCard
  title="Upload Your Assets"
  body="Drop in garment photos or lookbook shots in any format."
  label="01"
  index={0}
  variant="glass"
/>
```

---

## Related

- [[motion]] — provides `fadeUpCard`; stagger is derived from `index`
- [[section]] — `SectionContainer` wraps the card grid
- [[section-header]] — precedes the card grid in the typical section layout
- [[building-a-section]] — complete section assembly example
