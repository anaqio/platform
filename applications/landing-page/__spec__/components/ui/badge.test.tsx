import { Badge } from '@anaqio/ui'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

describe('Badge', () => {
  it('should render correctly with default props', () => {
    render(<Badge>Default Badge</Badge>)
    const badge = screen.getByText(/default badge/i)
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('bg-primary')
  })

  it('should apply variant classes correctly', () => {
    render(<Badge variant="brand">Brand Badge</Badge>)
    const badge = screen.getByText(/brand badge/i)
    expect(badge).toHaveClass('bg-aq-gold')
    expect(badge).toHaveClass('text-aq-navy')
  })

  it('should apply custom classes', () => {
    render(<Badge className="custom-class">Custom Badge</Badge>)
    const badge = screen.getByText(/custom badge/i)
    expect(badge).toHaveClass('custom-class')
  })

  it('should pass additional props to the div element', () => {
    render(<Badge data-testid="test-badge">Test Badge</Badge>)
    const badge = screen.getByTestId('test-badge')
    expect(badge).toBeInTheDocument()
  })
})
