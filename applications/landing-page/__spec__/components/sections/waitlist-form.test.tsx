import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import { WaitlistForm } from '@/components/sections/waitlist-form'
import { joinWaitlist } from '@/lib/actions/waitlist'

vi.mock('@/lib/actions/waitlist', () => ({
  joinWaitlist: vi.fn(),
}))

vi.mock('@/lib/analytics', () => ({
  trackUserBehavior: {
    trackClick: vi.fn(),
    trackFormSubmit: vi.fn(),
  },
}))

vi.mock('@uidotdev/usehooks', async () => {
  const React = await vi.importActual<any>('react')
  return {
    useLocalStorage: (_key: string, initial: unknown) => React.useState(initial),
  }
})

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion')
  return {
    ...(actual as object),
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    motion: {
      ...(actual as { motion: object }).motion,
      div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className={className} {...props}>
          {children}
        </p>
      ),
    },
  }
})

// Helper: advance past the 400ms setTimeout used for step transitions
async function advanceStep() {
  await act(async () => {
    await new Promise((r) => setTimeout(r, 450))
  })
}

describe('WaitlistForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Simple Variant', () => {
    it('should render the simple form correctly', () => {
      render(<WaitlistForm source="test" variant="simple" />)

      expect(screen.getByPlaceholderText('professional@email.com')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /get access/i })).toBeInTheDocument()
    })

    it('should submit the simple form and show success state', async () => {
      const user = userEvent.setup()
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: true,
        message: 'Successfully joined!',
      })

      render(<WaitlistForm source="test" variant="simple" />)

      const input = screen.getByPlaceholderText('professional@email.com')
      const button = screen.getByRole('button', { name: /get access/i })

      await user.type(input, 'test@example.com')
      fireEvent.submit(button.closest('form')!)

      await waitFor(() => {
        expect(joinWaitlist).toHaveBeenCalled()
      })

      expect(await screen.findByText("You're on the list!")).toBeInTheDocument()
      expect(screen.getByText('Successfully joined!')).toBeInTheDocument()
    })

    it('should show error message on simple form submission failure', async () => {
      const user = userEvent.setup()
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: false,
        message: 'Email already exists',
      })

      render(<WaitlistForm source="test" variant="simple" />)

      const input = screen.getByPlaceholderText('professional@email.com')
      const button = screen.getByRole('button', { name: /get access/i })

      await user.type(input, 'test@example.com')
      fireEvent.submit(button.closest('form')!)

      expect(await screen.findByText('Email already exists')).toBeInTheDocument()
    })
  })

  describe('Full Variant', () => {
    it('should render the first step of the full form', () => {
      render(<WaitlistForm source="test" variant="full" />)

      expect(screen.getByText('Identity')).toBeInTheDocument()
      expect(screen.getByText("Let's start with the basics")).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('professional@email.com')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    it('should prevent advancing if validation fails', async () => {
      render(<WaitlistForm source="test" variant="full" />)

      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)

      expect(await screen.findByText('Name is required')).toBeInTheDocument()
      expect(await screen.findByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Identity')).toBeInTheDocument()
    })

    it('back button returns to step 1 and preserves step 1 data', async () => {
      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'jane@example.com')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      fireEvent.click(screen.getByRole('button', { name: /back/i }))
      await advanceStep()

      expect(await screen.findByDisplayValue('Jane Doe')).toBeInTheDocument()
      expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument()
    })

    it('shows loading state during submission', async () => {
      let resolveSubmit!: (value: { success: boolean; message: string }) => void
      vi.mocked(joinWaitlist).mockReturnValueOnce(
        new Promise((r) => {
          resolveSubmit = r
        }) as ReturnType<typeof joinWaitlist>
      )

      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'jane@example.com')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      await user.selectOptions(screen.getByRole('combobox'), 'Brand')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Preferences')
      fireEvent.submit(screen.getByRole('button', { name: /secure beta access/i }).closest('form')!)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /securing your spot/i })).toBeDisabled()
      })

      await act(async () => {
        resolveSubmit({ success: true, message: 'Done' })
      })
    })

    it('shows success state on successful submission', async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: true,
        message: 'Welcome!',
      })

      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'jane@example.com')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      await user.selectOptions(screen.getByRole('combobox'), 'Brand')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Preferences')
      fireEvent.submit(screen.getByRole('button', { name: /secure beta access/i }).closest('form')!)

      expect(await screen.findByText("You're on the list!")).toBeInTheDocument()
    })

    it('shows server error message on failed submission', async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: false,
        message: 'Server exploded',
      })

      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'jane@example.com')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      await user.selectOptions(screen.getByRole('combobox'), 'Brand')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Preferences')
      fireEvent.submit(screen.getByRole('button', { name: /secure beta access/i }).closest('form')!)

      expect(await screen.findByText('Server exploded')).toBeInTheDocument()
      expect(screen.queryByText("You're on the list!")).not.toBeInTheDocument()
    })

    it('shows duplicate email error message', async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: false,
        message: 'This email is already on the waitlist!',
      })

      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'dupe@example.com')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      await user.selectOptions(screen.getByRole('combobox'), 'Brand')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Preferences')
      fireEvent.submit(screen.getByRole('button', { name: /secure beta access/i }).closest('form')!)

      expect(await screen.findByText('This email is already on the waitlist!')).toBeInTheDocument()
    })

    it('sanitizes email (lowercase + trim) before calling joinWaitlist', async () => {
      vi.mocked(joinWaitlist).mockResolvedValueOnce({
        success: true,
        message: 'Done',
      })

      const user = userEvent.setup()
      render(<WaitlistForm source="test" variant="full" />)

      await user.type(screen.getByPlaceholderText('Your name'), 'Jane Doe')
      await user.type(screen.getByPlaceholderText('professional@email.com'), 'USER@EMAIL.COM')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Profile')
      await user.selectOptions(screen.getByRole('combobox'), 'Brand')
      fireEvent.submit(screen.getByRole('button', { name: /continue/i }).closest('form')!)
      await advanceStep()

      await screen.findByText('Preferences')
      fireEvent.submit(screen.getByRole('button', { name: /secure beta access/i }).closest('form')!)

      await waitFor(() => {
        const fd = vi.mocked(joinWaitlist).mock.calls[0][0] as FormData
        expect(fd.get('email')).toBe('user@email.com')
      })
    })
  })
})
