// lib/data/segments-section.ts
export interface Segment {
  icon: string
  name: string
  role: string
  problem: string
  solution: string
}

export const SEGMENTS: Segment[] = [
  {
    icon: '👨‍💼',
    name: 'Emerging Brand Owner',
    role: 'Founder / CEO',
    problem: 'Budget constraints limit photoshoot frequency',
    solution: 'Generate unlimited content at a fraction of cost',
  },
  {
    icon: '👩‍🎨',
    name: 'Established Fashion Director',
    role: 'Creative Director',
    problem: 'Long production cycles delay collections',
    solution: 'Create lookbooks and variations in hours',
  },
  {
    icon: '📦',
    name: 'E-commerce Operations Manager',
    role: 'Operations Lead',
    problem: 'Maintaining catalog consistency across platforms',
    solution: 'Ensure uniform styling with AI-driven standards',
  },
  {
    icon: '🎬',
    name: 'Creative Freelancer',
    role: 'Freelance Stylist/Photographer',
    problem: 'High equipment and location costs per project',
    solution: 'Offer clients premium output without overhead',
  },
]
