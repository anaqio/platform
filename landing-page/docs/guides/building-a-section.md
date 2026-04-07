# Building a Section

Step-by-step guide to composing a full landing-page section using the four shared primitives.

**Primitives used:** [[motion]], [[section]], [[section-header]], [[feature-card]]

---

## 1. Create the file

Add a new file under `components/sections/` following the kebab-case naming convention:

```
components/sections/benefits-section.tsx
```

## 2. Import the primitives

```tsx
'use client';

import { motion, useReducedMotion } from 'framer-motion';

import { fadeIn } from '@/lib/motion';
import { FeatureCard } from '@/components/ui/feature-card';
import { GradientText, SectionHeader } from '@/components/ui/section-header';
import { Section, SectionContainer } from '@/components/ui/section';
```

> The `'use client'` directive is required whenever you use `useReducedMotion()` or any `motion.*` element.

## 3. Define your data

Keep static data outside the component so it is not re-created on every render.

```tsx
const BENEFITS = [
  {
    title: 'AI Retouching',
    body: 'One-click background removal and professional lighting in seconds.',
    icon: Wand2, // Lucide icon
  },
  {
    title: 'Lookbook Generator',
    body: 'Turn individual shots into a cohesive editorial lookbook automatically.',
    icon: BookOpen,
  },
  {
    title: 'Video Automation',
    body: 'Produce luxury fashion videos from static imagery, no studio required.',
    icon: Video,
  },
];
```

## 4. Build the component

```tsx
export function BenefitsSection() {
  const reduced = useReducedMotion();

  return (
    <Section id="benefits">
      <SectionContainer>
        {/* Heading */}
        <SectionHeader eyebrow="Product Benefits">
          Everything a brand needs, <GradientText>automated</GradientText>
        </SectionHeader>

        {/* Optional supporting copy */}
        <motion.p
          {...fadeIn(reduced, 0.2)}
          className="mx-auto mt-6 max-w-2xl text-center text-muted-foreground"
        >
          From a single asset upload to a full AI-generated campaign.
        </motion.p>

        {/* Card grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <FeatureCard
              key={benefit.title}
              title={benefit.title}
              body={benefit.body}
              icon={benefit.icon}
              index={i}
            />
          ))}
        </div>
      </SectionContainer>
    </Section>
  );
}
```

## 5. Register the section on the landing page

In `app/page.tsx`, add a dynamic import so the section is code-split:

```tsx
import dynamic from 'next/dynamic';

const BenefitsSection = dynamic(
  () =>
    import('@/components/sections/benefits-section').then(
      (m) => m.BenefitsSection
    ),
  { ssr: true }
);

export default function Page() {
  return (
    <main>
      {/* … other sections … */}
      <BenefitsSection />
    </main>
  );
}
```

---

## Animation timing reference

| Element            | Helper                           | Delay   |
| ------------------ | -------------------------------- | ------- |
| `SectionHeader` h2 | `fadeUp` (internal)              | `0 s`   |
| Supporting `<p>`   | `fadeIn(reduced, 0.2)`           | `0.2 s` |
| Card 1             | `fadeUpCard` (internal, index 0) | `0 s`   |
| Card 2             | `fadeUpCard` (internal, index 1) | `0.1 s` |
| Card 3             | `fadeUpCard` (internal, index 2) | `0.2 s` |

All animations trigger once when the element enters the viewport (`viewport: { once: true }`).

---

## Checklist

- [ ] File is in `components/sections/` with kebab-case name.
- [ ] `'use client'` at the top (required for hooks and `motion.*`).
- [ ] Static data defined outside the component.
- [ ] `index` prop passed to every `FeatureCard` for stagger.
- [ ] Section registered in `app/page.tsx` via `dynamic()` with `ssr: true`.
- [ ] `bun run lint` passes.

---

## Related

- [[motion]] — all animation helper details
- [[section]] — `Section` and `SectionContainer` props
- [[section-header]] — `SectionHeader` and `GradientText` props
- [[feature-card]] — `FeatureCard` props, variant values, stagger behaviour
