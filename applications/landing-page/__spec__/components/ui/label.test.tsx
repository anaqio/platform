import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Label } from '@anaqio/ui'

describe('Label', () => {
  it('should render correctly', () => {
    render(<Label>Email Address</Label>)
    const label = screen.getByText(/email address/i)
    expect(label).toBeInTheDocument()
  })

  it('should apply custom classes', () => {
    render(
      <Label data-testid="custom-label" className="custom-class">
        Custom Label
      </Label>
    )
    const label = screen.getByTestId('custom-label')
    expect(label).toHaveClass('custom-class')
  })

  it('should forward refs correctly', () => {
    const ref = createRef<HTMLLabelElement>()
    render(
      <Label ref={ref} data-testid="ref-label">
        Ref Label
      </Label>
    )
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    expect(ref.current?.getAttribute('data-testid')).toBe('ref-label')
  })

  it('should associate with an input using htmlFor', () => {
    render(
      <>
        <Label htmlFor="test-input">Test Input</Label>
        <input id="test-input" />
      </>
    )
    const input = screen.getByLabelText(/test input/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('id', 'test-input')
  })
})
