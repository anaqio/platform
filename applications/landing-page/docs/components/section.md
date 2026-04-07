# section

**Source:** [components/ui/section.tsx](../../components/ui/section.tsx)

Two layout primitives that every landing-page section is built on. Neither is animated — they are purely structural.

## `Section`

Full-viewport `<section>` element with standard horizontal padding and vertical centering.

### Props

| Prop        | Type                                | Default | Description                                                                       |
| ----------- | ----------------------------------- | ------- | --------------------------------------------------------------------------------- |
| `id`        | `string`                            | —       | Passed to the `<section>` element. Used for anchor navigation (e.g. `#waitlist`). |
| `className` | `string`                            | —       | Merged with default classes via `cn()`.                                           |
| `children`  | `ReactNode`                         | —       | Section content.                                                                  |
| `...props`  | `React.HTMLAttributes<HTMLElement>` | —       | All other HTML section attributes.                                                |

### Default classes

```
flex min-h-screen w-full flex-col justify-center px-4 py-24 sm:px-8 lg:px-12
```

- `min-h-screen` — each section fills at minimum the full viewport height.
- `justify-center` — vertically centres content within that height.
- Responsive horizontal padding: `px-4` → `sm:px-8` → `lg:px-12`.

### Usage

```tsx
import { Section, SectionContainer } from '@/components/ui/section';

export function BenefitsSection() {
  return (
    <Section id="benefits">
      <SectionContainer>{/* content */}</SectionContainer>
    </Section>
  );
}
```

---

## `SectionContainer`

Centred max-width `<div>` used directly inside `Section` to constrain content width.

### Props

| Prop        | Type                                   | Default | Description                    |
| ----------- | -------------------------------------- | ------- | ------------------------------ |
| `className` | `string`                               | —       | Merged with default classes.   |
| `children`  | `ReactNode`                            | —       | Container content.             |
| `...props`  | `React.HTMLAttributes<HTMLDivElement>` | —       | All other HTML div attributes. |

### Default classes

```
mx-auto w-full max-w-[1200px]
```

The `1200px` cap keeps content readable on ultra-wide displays while still filling narrower viewports.

---

## Typical Structure

```
Section (min-h-screen, responsive padding)
└── SectionContainer (max-w-[1200px], centred)
    ├── SectionHeader
    └── grid / flex content
```

## Related

- [[motion]] — animation helpers spread onto `motion.*` elements inside sections
- [[section-header]] — animated heading block placed inside `SectionContainer`
- [[feature-card]] — card grid placed inside `SectionContainer`
- [[building-a-section]] — step-by-step assembly guide
