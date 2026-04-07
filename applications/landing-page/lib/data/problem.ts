import { Camera, LayoutList, Share2, ShoppingBag } from 'lucide-react';

import type { IconItem } from '@/lib/data/types';

export const ProblemSectionText = {
  eyebrow: 'The Challenge',
  headline: { pre: 'Fashion Content Demand.', gradient: 'Exploding' },
  visualHeadline: {
    line1: 'Fashion moves fast.',
    line2: "Production doesn't.",
  },
  intro: {
    a: 'Fashion brands today need an enormous volume of visuals.',
    b: "But traditional production wasn't built for this speed.",
    detail:
      'Photoshoots require studios, models, logistics, and post-production — making them expensive, slow, and difficult to scale. For emerging designers and growing brands, this creates a bottleneck between creative vision and commercial growth.',
    quote: 'Fashion is art. Commerce requires optimization.',
  },
  painPoints: [
    { text: 'Product launches.', icon: Camera },
    { text: 'Social media campaigns.', icon: Share2 },
    { text: 'E-commerce catalogs.', icon: ShoppingBag },
    { text: 'Marketplace listings.', icon: LayoutList },
  ] satisfies IconItem[],
} as const;
