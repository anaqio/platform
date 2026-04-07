import { Move3D, Ruler, ShieldCheck, Sun, Zap } from 'lucide-react';

import type { FeatureItem } from '@/lib/data/types';

export const WhyAnaqioSectionText = {
  eyebrow: 'Product Benefits',
  headline: { pre: 'Why', gradient: 'Anaqio', post: 'is Better?' },
  footer: 'Anaqio is built for reliability, consistency, and scale.',
  points: [
    {
      title: 'Garment Precision',
      body: 'Faithful reproduction of textures, cuts, colors, and brand details.',
      icon: Ruler,
    },
    {
      title: 'Controlled Poses',
      body: 'Consistent positioning across product collections.',
      icon: Move3D,
    },
    {
      title: 'Lighting Consistency',
      body: 'Uniform lighting that preserves accurate color representation.',
      icon: Sun,
    },
    {
      title: 'Scalable Production',
      body: 'Generate hundreds of visuals without increasing production costs.',
      icon: Zap,
    },
    {
      title: 'Brand-Safe Outputs',
      body: 'Structured AI pipelines designed for fashion brands — not experimental image generation.',
      icon: ShieldCheck,
    },
  ] satisfies FeatureItem[],
} as const;
