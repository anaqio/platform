// lib/data/pricing-section.ts
export interface PricingTier {
  name: string
  price: number | string
  currency: string
  period: string
  description: string
  features: string[]
  highlighted?: boolean
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Studio Starter',
    price: 99,
    currency: 'MAD',
    period: 'month',
    description: 'For emerging brands testing AI photography',
    features: [
      '100 monthly generations',
      'Basic lighting & background controls',
      '10 concurrent projects',
      'Email support',
    ],
  },
  {
    name: 'Studio Pro',
    price: 499,
    currency: 'MAD',
    period: 'month',
    description: 'For growing brands scaling production',
    features: [
      'Unlimited monthly generations',
      'Advanced AI features & presets',
      'Unlimited projects',
      'Priority support',
      'Custom brand guidelines',
      'Team collaboration (3 seats)',
    ],
    highlighted: true,
  },
  {
    name: 'Studio Enterprise',
    price: 'Custom',
    currency: 'MAD',
    period: 'month',
    description: 'For established brands & agencies',
    features: [
      'Everything in Pro',
      'Dedicated account manager',
      'Custom integrations',
      'Unlimited team seats',
      'Advanced analytics',
      'White-label options',
    ],
  },
]
