'use client';

import * as React from 'react';

import {
  AnaqioTypographyLogo,
  type LogoAnimationVariant,
} from '@/components/ui/anaqio-typography-logo';

const demos: {
  label: string;
  variant: LogoAnimationVariant;
  description: string;
}[] = [
  {
    label: '01. Stagger Fade-Up',
    variant: 'stagger',
    description:
      'Letters fade in with a subtle upward slide, staggered sequentially.',
  },
  {
    label: '02. Outline → Fill',
    variant: 'outline-fill',
    description:
      'Outlines draw on, then a gradient mask wipes left-to-right to reveal the fill.',
  },
  {
    label: '03. Slow Continuous Spin',
    variant: 'spin',
    description: 'Entire wordmark rotates continuously for ambient motion.',
  },
  {
    label: '04. Spring Bounce on Hover',
    variant: 'spring-hover',
    description: 'Hover over the logo — each letter bounces up with a spring.',
  },
  {
    label: '05. Cinematic Reveal',
    variant: 'cinematic-reveal',
    description:
      'Letters slide in from the left with a blur-to-sharp transition.',
  },
  {
    label: '06. Breathing',
    variant: 'breathing',
    description: 'Gentle, continuous scale pulse for a calm, ambient feel.',
  },
  {
    label: '07. Lock-In Snap',
    variant: 'lock-in',
    description:
      'Letters snap into place from an oversized state with stiff spring physics.',
  },
];

export default function LogoPlayground() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-24 sm:px-12">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-4">
          <h1 className="font-display text-4xl font-bold tracking-tight">
            Logo Animation Playground
          </h1>
          <p className="text-muted-foreground">
            Experimenting with different motion design patterns for the ANAQIO
            typography logo.
          </p>
        </div>

        {/* Hero-size static preview */}
        <div className="rounded-2xl border border-border/50 bg-background p-12 shadow-sm">
          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Static (No Animation)
          </span>
          <AnaqioTypographyLogo className="mx-auto w-80" />
        </div>

        {/* Variant grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {demos.map((demo) => (
            <div
              key={demo.variant}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border/50 bg-background p-12 shadow-sm"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {demo.label}
              </span>
              <AnaqioTypographyLogo className="w-full" variant={demo.variant} />
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {demo.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
