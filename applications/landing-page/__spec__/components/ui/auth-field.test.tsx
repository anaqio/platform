import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { AuthField } from '@/components/ui/auth-field'

describe('AuthField', () => {
  const defaultProps = {
    id: 'email',
    label: 'Email',
    value: '',
    onChange: vi.fn(),
  }

  it('renders the label', () => {
    render(<AuthField {...defaultProps} />)

    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it('renders the input with correct id', () => {
    render(<AuthField {...defaultProps} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'email')
  })

  it('renders input with default type text', () => {
    render(<AuthField {...defaultProps} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('renders input with custom type', () => {
    render(<AuthField {...defaultProps} type="email" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders input with placeholder', () => {
    render(<AuthField {...defaultProps} placeholder="Enter email" />)

    const input = screen.getByPlaceholderText('Enter email')
    expect(input).toBeInTheDocument()
  })

  it('renders required input', () => {
    render(<AuthField {...defaultProps} required />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('required')
  })

  it('displays the value', () => {
    render(<AuthField {...defaultProps} value="test@example.com" />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test@example.com')
  })

  it('calls onChange with e.target.value on input change', () => {
    const onChange = vi.fn()
    render(<AuthField {...defaultProps} onChange={onChange} />)

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'new-value' } })

    expect(onChange).toHaveBeenCalledWith('new-value')
  })

  it('associates label with input via htmlFor/id', () => {
    render(<AuthField {...defaultProps} />)

    const label = screen.getByText('Email')
    expect(label).toHaveAttribute('for', 'email')
  })

  it('applies custom styling classes on input', () => {
    render(<AuthField {...defaultProps} />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-white/10', 'bg-background/50')
  })
})
