import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FashionPoseSelector } from '../components/studio/FashionPoseSelector'

const CATEGORY_HEADINGS = [
  'Back & Detail Shots',
  'Formal & Elegant',
  'Athletic & Activewear',
  'Casual & Relaxed',
  'Bohemian & Artisanal',
  'Dresses & Gowns',
  'Dynamic & Action Poses',
]

describe('FashionPoseSelector', () => {
  it('renders all 7 category headings', () => {
    render(<FashionPoseSelector value="" onChange={vi.fn()} />)

    for (const heading of CATEGORY_HEADINGS) {
      expect(screen.getByText(heading)).toBeInTheDocument()
    }
  })

  it('clicking a pose fires onChange with the correct en string', () => {
    const onChange = vi.fn()

    render(<FashionPoseSelector value="" onChange={onChange} />)

    // First category ("Back & Detail Shots") is open by default
    const poseButton = screen.getByText('Standing from Behind')
    fireEvent.click(poseButton)

    expect(onChange).toHaveBeenCalledOnce()
    expect(onChange).toHaveBeenCalledWith('a standing pose seen from the back')
  })

  it('first category is open by default — its accordion button is aria-expanded true', () => {
    render(<FashionPoseSelector value="" onChange={vi.fn()} />)

    const backHeader = screen.getByText('Back & Detail Shots')
    expect(backHeader.closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('clicking a closed category header opens it (aria-expanded becomes true)', () => {
    render(<FashionPoseSelector value="" onChange={vi.fn()} />)

    // "Formal & Elegant" is closed initially
    const formalHeader = screen.getByText('Formal & Elegant')
    expect(formalHeader.closest('button')).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(formalHeader)

    expect(formalHeader.closest('button')).toHaveAttribute('aria-expanded', 'true')
  })

  it('clicking an open category header closes it (aria-expanded becomes false)', () => {
    render(<FashionPoseSelector value="" onChange={vi.fn()} />)

    // "Back & Detail Shots" is open by default
    const backHeader = screen.getByText('Back & Detail Shots')
    expect(backHeader.closest('button')).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(backHeader)

    expect(backHeader.closest('button')).toHaveAttribute('aria-expanded', 'false')
  })
})
