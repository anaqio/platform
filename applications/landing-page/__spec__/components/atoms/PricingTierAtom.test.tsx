import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PricingTier } from '@/lib/data/pricing-section'

vi.mock('@/hooks/use-animation-ready', () => ({
  useAnimationReady: () => ({ reduced: false, tier: 'high', animated: true }),
}))

import { PricingTierAtom } from '@/components/atoms/PricingTierAtom'

describe('PricingTierAtom', () => {
  const mockTier: PricingTier = {
    name: 'Studio Pro',
    price: 499,
    currency: 'MAD',
    period: 'month',
    description: 'For growing brands scaling production',
    features: ['Unlimited monthly generations', 'Advanced AI features & presets'],
    highlighted: true,
  }

  const basicTier: PricingTier = {
    name: 'Studio Starter',
    price: 99,
    currency: 'MAD',
    period: 'month',
    description: 'For emerging brands testing AI photography',
    features: ['100 monthly generations', 'Basic lighting & background controls'],
    highlighted: false,
  }

  it('renders tier name', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const name = screen.getByText('Studio Pro')
    expect(name).toBeInTheDocument()
  })

  it('renders price with currency and period', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const price = screen.getByText('499')
    const currency = screen.getByText(/MAD \/ month/)
    expect(price).toBeInTheDocument()
    expect(currency).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const description = screen.getByText('For growing brands scaling production')
    expect(description).toBeInTheDocument()
  })

  it('renders all features', () => {
    render(<PricingTierAtom tier={mockTier} />)
    mockTier.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
  })

  it('shows Popular badge for highlighted tier', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const popular = screen.getByText('Popular')
    expect(popular).toBeInTheDocument()
  })

  it('does not show Popular badge for non-highlighted tier', () => {
    render(<PricingTierAtom tier={basicTier} />)
    const popular = screen.queryByText('Popular')
    expect(popular).not.toBeInTheDocument()
  })

  it('renders Get Started button', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const button = screen.getByRole('button', { name: /Get Started/i })
    expect(button).toBeInTheDocument()
  })

  it('handles custom price strings', () => {
    const customTier: PricingTier = {
      ...basicTier,
      name: 'Studio Enterprise',
      price: 'Custom',
    }
    render(<PricingTierAtom tier={customTier} />)
    expect(screen.getByText('Custom')).toBeInTheDocument()
  })

  it('shows Contact Sales button for Custom price tier', () => {
    const customTier: PricingTier = {
      ...basicTier,
      name: 'Studio Enterprise',
      price: 'Custom',
    }
    render(<PricingTierAtom tier={customTier} />)
    const button = screen.getByRole('button', { name: /Contact Sales/i })
    expect(button).toBeInTheDocument()
  })

  it('shows Get Started button for numeric price tier', () => {
    render(<PricingTierAtom tier={mockTier} />)
    const button = screen.getByRole('button', { name: /Get Started/i })
    expect(button).toBeInTheDocument()
  })
})
