// lib/data/results-section.ts
export interface ResultCard {
  metric: string
  traditional: string
  anaqio: string
  improvement: string
}

export const RESULTS: ResultCard[] = [
  {
    metric: 'Cost per Shoot',
    traditional: '5,000 MAD',
    anaqio: '500 MAD',
    improvement: '90% reduction',
  },
  {
    metric: 'Production Time',
    traditional: '2–3 weeks',
    anaqio: '2–3 hours',
    improvement: '99% faster',
  },
  {
    metric: 'Photo Variations',
    traditional: '20–50 per session',
    anaqio: 'Unlimited',
    improvement: '10x+ more',
  },
]
