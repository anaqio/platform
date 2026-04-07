import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

const mockPush = vi.fn();
const mockUpdateUser = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      updateUser: mockUpdateUser,
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

import { UpdatePasswordForm } from '@/components/update-password-form';
import { ERROR_MESSAGES } from '@/lib/constants/errors';

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockUpdateUser.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the update password form with title and description', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
  });

  it('renders the password field', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByLabelText('password.label')).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument();
  });

  it('calls updateUser and redirects on success', async () => {
    mockUpdateUser.mockResolvedValue({ error: null });

    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/protected');
    });
  });

  it('displays error message on update failure', async () => {
    mockUpdateUser.mockResolvedValue({
      error: new Error('Password too weak'),
    });

    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password too weak')).toBeInTheDocument();
    });
  });

  it('displays generic error message on non-Error throw', async () => {
    mockUpdateUser.mockRejectedValue('unexpected');

    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.AUTH)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    let resolveUpdate: (value: any) => void;
    mockUpdateUser.mockReturnValue(
      new Promise((resolve) => {
        resolveUpdate = resolve;
      })
    );

    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'submitPending' })
      ).toBeInTheDocument();
    });

    resolveUpdate!({ error: null });
  });

  it('forwards className to AuthCard', () => {
    const { container } = render(
      <UpdatePasswordForm className="custom-class" />
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('does not redirect on update failure', async () => {
    mockUpdateUser.mockResolvedValue({
      error: new Error('Password too weak'),
    });

    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    const submitButton = screen.getByRole('button', { name: 'submit' });

    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Password too weak')).toBeInTheDocument();
    });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('password input has type password', () => {
    render(<UpdatePasswordForm />);

    const passwordInput = screen.getByLabelText('password.label');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
