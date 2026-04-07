import { Globe, RefreshCw, Rocket } from 'lucide-react';

import type { IconItem } from '@/lib/data/types';

export const VisionSectionText = {
  eyebrow: 'Our Vision',
  headline: { pre: 'The Future of', gradient: 'Fashion Production' },
  intro:
    'The fashion industry is entering a new era where visual production must keep pace with digital commerce.',
  quote:
    "Anaqio's vision is to become the visual infrastructure layer of the global fashion industry, transforming visual production from a bottleneck into a growth engine.",
  points: [
    { text: 'Collections launch faster.', icon: Rocket },
    { text: 'Content cycles move quicker.', icon: RefreshCw },
    { text: 'Brands reach global audiences instantly.', icon: Globe },
  ] satisfies IconItem[],
} as const;
