import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';

import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('should render correctly', () => {
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('should toggle state when clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox data-testid="test-checkbox" />);
    const checkbox = screen.getByTestId('test-checkbox');

    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
  });

  it('should apply custom classes', () => {
    render(<Checkbox data-testid="custom-checkbox" className="custom-class" />);
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toHaveClass('custom-class');
  });

  it('should handle disabled state', () => {
    render(<Checkbox disabled data-testid="disabled-checkbox" />);
    const checkbox = screen.getByTestId('disabled-checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should forward refs correctly', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} data-testid="ref-checkbox" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current?.getAttribute('data-testid')).toBe('ref-checkbox');
  });
});
