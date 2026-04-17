import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { Segment } from '@/lib/data/segments-section'

vi.mock('@/hooks/use-animation-ready', () => ({
  useAnimationReady: () => ({ reduced: false, tier: 'high', animated: true }),
}))

import { SegmentCardAtom } from '@/components/atoms/SegmentCardAtom'

describe('SegmentCardAtom', () => {
  const mockSegment: Segment = {
    icon: '👨‍💼',
    name: 'Emerging Brand Owner',
    role: 'Founder / CEO',
    problem: 'Budget constraints limit photoshoot frequency',
    solution: 'Generate unlimited content at a fraction of cost',
  }

  it('renders segment icon', () => {
    render(<SegmentCardAtom segment={mockSegment} />)
    const icon = screen.getByText('👨‍💼')
    expect(icon).toBeInTheDocument()
  })

  it('renders segment name', () => {
    render(<SegmentCardAtom segment={mockSegment} />)
    const name = screen.getByText('Emerging Brand Owner')
    expect(name).toBeInTheDocument()
  })

  it('renders segment role', () => {
    render(<SegmentCardAtom segment={mockSegment} />)
    const role = screen.getByText('Founder / CEO')
    expect(role).toBeInTheDocument()
  })

  it('renders problem and solution on hover', () => {
    render(<SegmentCardAtom segment={mockSegment} />)
    expect(screen.getByText('Problem')).toBeInTheDocument()
    expect(screen.getByText('Solution')).toBeInTheDocument()
    expect(screen.getByText('Budget constraints limit photoshoot frequency')).toBeInTheDocument()
    expect(screen.getByText('Generate unlimited content at a fraction of cost')).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    const { container } = render(<SegmentCardAtom segment={mockSegment} />)
    const card = container.firstChild
    expect(card).toHaveClass('rounded-lg', 'border', 'p-5')
  })
})
