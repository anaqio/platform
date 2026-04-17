import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const mockPush = vi.fn()
const mockSignUp = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: mockSignUp,
    },
  })),
}))

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

import { SignUpForm } from '@/components/sign-up-form'
import { ERROR_MESSAGES } from '@/lib/constants/errors'

describe('SignUpForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockSignUp.mockClear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the sign up form with title and description', () => {
    render(<SignUpForm />)

    expect(screen.getByText('title')).toBeInTheDocument()
    expect(screen.getByText('desc')).toBeInTheDocument()
  })

  it('renders email, password, and repeat password fields', () => {
    render(<SignUpForm />)

    expect(screen.getByLabelText('email.label')).toBeInTheDocument()
    expect(screen.getByLabelText('password.label')).toBeInTheDocument()
    expect(screen.getByLabelText('passwordRepeat')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<SignUpForm />)

    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument()
  })

  it('renders login link', () => {
    render(<SignUpForm />)

    const loginLink = screen.getByText('loginLink')
    expect(loginLink).toBeInTheDocument()
    expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/login')
  })

  it('shows error when passwords do not match', async () => {
    render(<SignUpForm />)

    const emailInput = screen.getByLabelText('email.label')
    const passwordInput = screen.getByLabelText('password.label')
    const repeatPasswordInput = screen.getByLabelText('passwordRepeat')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'different' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })

    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('calls signUp and redirects on success', async () => {
    mockSignUp.mockResolvedValue({ error: null })

    render(<SignUpForm />)

    const emailInput = screen.getByLabelText('email.label')
    const passwordInput = screen.getByLabelText('password.label')
    const repeatPasswordInput = screen.getByLabelText('passwordRepeat')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'password123' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          emailRedirectTo: expect.stringContaining('/protected'),
        },
      })
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/sign-up-success')
    })
  })

  it('displays error message on sign up failure', async () => {
    mockSignUp.mockResolvedValue({
      error: new Error('Email already registered'),
    })

    render(<SignUpForm />)

    const emailInput = screen.getByLabelText('email.label')
    const passwordInput = screen.getByLabelText('password.label')
    const repeatPasswordInput = screen.getByLabelText('passwordRepeat')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'password123' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email already registered')).toBeInTheDocument()
    })
  })

  it('displays generic error message on non-Error throw', async () => {
    mockSignUp.mockRejectedValue('unexpected')

    render(<SignUpForm />)

    const emailInput = screen.getByLabelText('email.label')
    const passwordInput = screen.getByLabelText('password.label')
    const repeatPasswordInput = screen.getByLabelText('passwordRepeat')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'password123' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.AUTH)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    let resolveSignUp: (value: any) => void
    mockSignUp.mockReturnValue(
      new Promise((resolve) => {
        resolveSignUp = resolve
      })
    )

    render(<SignUpForm />)

    const emailInput = screen.getByLabelText('email.label')
    const passwordInput = screen.getByLabelText('password.label')
    const repeatPasswordInput = screen.getByLabelText('passwordRepeat')
    const submitButton = screen.getByRole('button', { name: 'submit' })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(repeatPasswordInput, {
      target: { value: 'password123' },
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'submitPending' })).toBeInTheDocument()
    })

    resolveSignUp!({ error: null })
  })

  it('forwards className to AuthCard', () => {
    const { container } = render(<SignUpForm className="custom-class" />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass('custom-class')
  })
})
