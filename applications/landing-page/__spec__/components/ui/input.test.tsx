import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'

import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('should render correctly', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText(/enter text/i)
    expect(input).toBeInTheDocument()
  })

  it('should accept and display user input', async () => {
    const user = userEvent.setup()
    render(<Input placeholder="Type here" />)
    const input = screen.getByPlaceholderText(/type here/i)

    await user.type(input, 'Hello World')
    expect(input).toHaveValue('Hello World')
  })

  it('should apply custom classes', () => {
    render(<Input data-testid="custom-input" className="my-custom-class" />)
    const input = screen.getByTestId('custom-input')
    expect(input).toHaveClass('my-custom-class')
  })

  it('should support different input types', () => {
    render(<Input data-testid="password-input" type="password" />)
    const input = screen.getByTestId('password-input')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('should forward refs correctly', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} data-testid="ref-input" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
    expect(ref.current?.getAttribute('data-testid')).toBe('ref-input')
  })

  it('should handle disabled state', () => {
    render(<Input disabled data-testid="disabled-input" />)
    const input = screen.getByTestId('disabled-input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed')
  })
})
