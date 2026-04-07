import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ScrollLink } from '@/components/ui/scroll-link';

describe('ScrollLink', () => {
  it('should render an anchor tag with the correct href', () => {
    render(<ScrollLink targetId="target-section">Go to Target</ScrollLink>);
    const link = screen.getByRole('link', { name: /go to target/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#target-section');
  });

  it('should call scrollIntoView on click', async () => {
    const user = userEvent.setup();
    const mockScrollIntoView = vi.fn();
    const mockReplaceState = vi.fn();

    // Mock document.getElementById
    const originalGetElementById = document.getElementById;
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: mockScrollIntoView,
    });

    // Mock window.history.replaceState
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = mockReplaceState;

    render(<ScrollLink targetId="target-section">Go to Target</ScrollLink>);
    const link = screen.getByRole('link', { name: /go to target/i });

    await user.click(link);

    expect(document.getElementById).toHaveBeenCalledWith('target-section');
    expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    expect(mockReplaceState).toHaveBeenCalledWith(
      null,
      '',
      expect.stringMatching(/^\/[^#]*$/)
    );

    // Restore originals
    document.getElementById = originalGetElementById;
    window.history.replaceState = originalReplaceState;
  });

  it('should call custom onClick handler if provided', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    // Mock document.getElementById to prevent errors
    const originalGetElementById = document.getElementById;
    document.getElementById = vi.fn().mockReturnValue({
      scrollIntoView: vi.fn(),
    });

    // Mock window.history.replaceState
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = vi.fn();

    render(
      <ScrollLink targetId="target-section" onClick={mockOnClick}>
        Go to Target
      </ScrollLink>
    );
    const link = screen.getByRole('link', { name: /go to target/i });

    await user.click(link);

    expect(mockOnClick).toHaveBeenCalled();

    // Restore originals
    document.getElementById = originalGetElementById;
    window.history.replaceState = originalReplaceState;
  });
});
