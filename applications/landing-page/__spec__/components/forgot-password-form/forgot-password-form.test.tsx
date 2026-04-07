import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const mockResetPasswordForEmail = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      resetPasswordForEmail: mockResetPasswordForEmail,
    },
  })),
}));

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { ERROR_MESSAGES } from '@/lib/constants/errors';

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    mockResetPasswordForEmail.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the forgot password form with title and description', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('renders the email field', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText('email.label')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('renders back to login link', () => {
    render(<ForgotPasswordForm />);

    const backLink = screen.getByText('back');
    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute('href', '/auth/login');
  });

  it('calls resetPasswordForEmail and shows success state on success', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockResetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        {
          redirectTo: expect.stringContaining('/auth/update-password'),
        }
      );
    });

    await waitFor(() => {
      expect(screen.getByText('success.title')).toBeInTheDocument();
      expect(screen.getByText('success.desc')).toBeInTheDocument();
      expect(screen.getByText('success.msg')).toBeInTheDocument();
    });
  });

  it('renders success view with Card (not AuthCard) on success', async () => {
    mockResetPasswordForEmail.mockResolvedValue({ error: null });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('success.title')).toBeInTheDocument();
    });

    // Success view should not have AuthCard (which uses title/desc from auth.forgot)
    // It should have a raw Card with success-specific content
    expect(screen.queryByText('title')).not.toBeInTheDocument();
  });

  it('displays error message on reset failure', async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: new Error('Email not found'),
    });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'unknown@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Email not found')).toBeInTheDocument();
    });
  });

  it('displays generic error message on non-Error throw', async () => {
    mockResetPasswordForEmail.mockRejectedValue('unexpected');

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.AUTH)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    let resolveReset: (value: any) => void;
    mockResetPasswordForEmail.mockReturnValue(
      new Promise((resolve) => {
        resolveReset = resolve;
      })
    );

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'submitPending' })
      ).toBeInTheDocument();
    });

    resolveReset!({ error: null });
  });

  it('applies className to outer wrapper', () => {
    const { container } = render(
      <ForgotPasswordForm className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('does not show success state on failure', async () => {
    mockResetPasswordForEmail.mockResolvedValue({
      error: new Error('Failed'),
    });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText('email.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed')).toBeInTheDocument();
    });

    expect(screen.queryByText('success.title')).not.toBeInTheDocument();
  });
});
