export interface Feature {
  icon: string
  title: string
  description: string
}

export const FEATURES: Feature[] = [
  {
    icon: '🎨',
    title: 'AI Virtual Try-On',
    description:
      'Let customers visualize products before purchase with our advanced virtual try-on technology.',
  },
  {
    icon: '📸',
    title: 'Automated Studio Photography',
    description:
      'Generate professional product shots with adjustable lighting, backgrounds, and angles instantly.',
  },
  {
    icon: '⚡',
    title: 'Production at Scale',
    description:
      'Create unlimited lookbooks, variations, and campaigns without the cost of traditional photoshoots.',
  },
]
