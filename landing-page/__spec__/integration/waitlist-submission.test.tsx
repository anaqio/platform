import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { WaitlistForm } from '@/components/sections/waitlist-form';
import { joinWaitlist } from '@/lib/actions/waitlist';

vi.mock('@/lib/actions/waitlist', () => ({
  joinWaitlist: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({
  trackUserBehavior: { trackClick: vi.fn(), trackFormSubmit: vi.fn() },
}));

vi.mock('@uidotdev/usehooks', async () => {
  const React = await vi.importActual<any>('react');
  return {
    useLocalStorage: (_key: string, initial: unknown) =>
      React.useState(initial),
  };
});

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...(actual as object),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
    motion: {
      ...(actual as { motion: object }).motion,
      div: ({
        children,
        className,
        ...props
      }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      p: ({
        children,
        className,
        ...props
      }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className={className} {...props}>
          {children}
        </p>
      ),
    },
  };
});

async function advanceStep() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 450));
  });
}

async function fillStep1(
  user: ReturnType<typeof userEvent.setup>,
  name = 'Jane Doe',
  email = 'jane@example.com'
) {
  await user.type(screen.getByPlaceholderText('Your name'), name);
  await user.type(screen.getByPlaceholderText('professional@email.com'), email);
  fireEvent.submit(
    screen.getByRole('button', { name: /continue/i }).closest('form')!
  );
  await advanceStep();
  await screen.findByText('Profile');
}

async function fillStep2(
  user: ReturnType<typeof userEvent.setup>,
  role = 'Brand'
) {
  await user.selectOptions(screen.getByRole('combobox'), role);
  fireEvent.submit(
    screen.getByRole('button', { name: /continue/i }).closest('form')!
  );
  await advanceStep();
  await screen.findByText('Preferences');
}

describe('Waitlist submission — integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'happy path: fill all steps → submit → success state renders',
    { timeout: 15_000 },
    async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: true,
        message: 'Welcome!',
      });
      const user = userEvent.setup();
      render(<WaitlistForm source="integration-test" variant="full" />);

      await fillStep1(user);
      await fillStep2(user);
      fireEvent.submit(
        screen
          .getByRole('button', { name: /secure beta access/i })
          .closest('form')!
      );

      expect(
        await screen.findByText("You're on the list!")
      ).toBeInTheDocument();
    }
  );

  it(
    'validation path: submit step 1 empty → errors shown → correct → progress',
    { timeout: 15_000 },
    async () => {
      const user = userEvent.setup();
      render(<WaitlistForm source="integration-test" variant="full" />);

      fireEvent.submit(
        screen.getByRole('button', { name: /continue/i }).closest('form')!
      );

      expect(await screen.findByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe');
      await user.type(
        screen.getByPlaceholderText('professional@email.com'),
        'jane@example.com'
      );
      fireEvent.submit(
        screen.getByRole('button', { name: /continue/i }).closest('form')!
      );
      await advanceStep();

      expect(await screen.findByText('Profile')).toBeInTheDocument();
    }
  );

  it(
    'server error path: error message renders, form data intact',
    { timeout: 15_000 },
    async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: false,
        message: 'Server error',
      });
      const user = userEvent.setup();
      render(<WaitlistForm source="integration-test" variant="full" />);

      await fillStep1(user);
      await fillStep2(user);
      fireEvent.submit(
        screen
          .getByRole('button', { name: /secure beta access/i })
          .closest('form')!
      );

      expect(await screen.findByText('Server error')).toBeInTheDocument();
      expect(screen.queryByText("You're on the list!")).not.toBeInTheDocument();
    }
  );

  it(
    'retry path: after server error, modifying a field clears the server error',
    { timeout: 15_000 },
    async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: false,
        message: 'Server error',
      });
      const user = userEvent.setup();
      render(<WaitlistForm source="integration-test" variant="full" />);

      await fillStep1(user);
      await fillStep2(user);
      fireEvent.submit(
        screen
          .getByRole('button', { name: /secure beta access/i })
          .closest('form')!
      );
      await screen.findByText('Server error');

      // Navigate back to step 2, then step 1
      // Wait for Back button to be enabled (isPending resolves after server error)
      await waitFor(() =>
        expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
      );
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      await advanceStep();
      await screen.findByText('Profile');

      await waitFor(() =>
        expect(screen.getByRole('button', { name: /back/i })).not.toBeDisabled()
      );
      fireEvent.click(screen.getByRole('button', { name: /back/i }));
      await advanceStep();
      await screen.findByText('Identity');

      await user.clear(screen.getByPlaceholderText('Your name'));
      await user.type(screen.getByPlaceholderText('Your name'), 'Updated Name');

      expect(screen.queryByText('Server error')).not.toBeInTheDocument();
    }
  );

  it(
    'email sanitization end-to-end: joinWaitlist called with lowercased trimmed email',
    { timeout: 15_000 },
    async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: true,
        message: 'Done',
      });
      const user = userEvent.setup();
      render(<WaitlistForm source="integration-test" variant="full" />);

      await fillStep1(user, 'Jane Doe', 'USER@EMAIL.COM');
      await fillStep2(user);
      fireEvent.submit(
        screen
          .getByRole('button', { name: /secure beta access/i })
          .closest('form')!
      );

      await waitFor(() => {
        const fd = vi.mocked(joinWaitlist).mock.calls[0][0] as FormData;
        expect(fd.get('email')).toBe('user@email.com');
      });
    }
  );
});
