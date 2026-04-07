import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const mockPush = vi.fn();
const mockSignInWithPassword = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
    },
  })),
}));

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { LoginForm } from '@/components/login-form';
import { ERROR_MESSAGES } from '@/lib/constants/errors';

describe('LoginForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockSignInWithPassword.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login form with title and description', () => {
    render(<LoginForm />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('renders email and password fields', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('email.label')).toBeInTheDocument();
    expect(screen.getByLabelText('password.label')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<LoginForm />);

    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    render(<LoginForm />);

    const forgotLink = screen.getByText('forgot');
    expect(forgotLink).toBeInTheDocument();
    expect(forgotLink.closest('a')).toHaveAttribute(
      'href',
      '/auth/forgot-password'
    );
  });

  it('renders sign up link', () => {
    render(<LoginForm />);

    const signUpLink = screen.getByText('signupLink');
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink.closest('a')).toHaveAttribute('href', '/auth/sign-up');
  });

  it('calls signInWithPassword and redirects on success', async () => {
    mockSignInWithPassword.mockResolvedValue({ error: null });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('email.label');
    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/protected');
    });
  });

  it('displays error message on auth failure', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: new Error('Invalid credentials'),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('email.label');
    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('displays generic error message on non-Error throw', async () => {
    mockSignInWithPassword.mockRejectedValue('unexpected');

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('email.label');
    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.AUTH)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    let resolveSignIn: (value: any) => void;
    mockSignInWithPassword.mockReturnValue(
      new Promise((resolve) => {
        resolveSignIn = resolve;
      })
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('email.label');
    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'submitPending' })
      ).toBeInTheDocument();
    });

    resolveSignIn!({ error: null });
  });

  it('forwards className to AuthCard', () => {
    const { container } = render(<LoginForm className="custom-class" />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('does not redirect on auth failure', async () => {
    mockSignInWithPassword.mockResolvedValue({
      error: new Error('Invalid credentials'),
    });

    render(<LoginForm />);

    const emailInput = screen.getByLabelText('email.label');
    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrong' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
