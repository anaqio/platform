import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProgressIndicator } from '@/components/ui/progress-indicator';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('ProgressIndicator', () => {
  it('renders correct number of step buttons', () => {
    render(<ProgressIndicator currentStep={1} totalSteps={3} />);
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('aria-valuenow reflects currentStep and aria-valuemax reflects totalSteps', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={4} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '2');
    expect(bar).toHaveAttribute('aria-valuemax', '4');
  });

  it('current step button has aria-current="step"', () => {
    render(<ProgressIndicator currentStep={2} totalSteps={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1]).toHaveAttribute('aria-current', 'step');
    expect(buttons[0]).not.toHaveAttribute('aria-current');
    expect(buttons[2]).not.toHaveAttribute('aria-current');
  });

  it('completed step buttons have cursor-pointer class', () => {
    render(
      <ProgressIndicator currentStep={3} totalSteps={3} onStepClick={vi.fn()} />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons[0].className).toContain('cursor-pointer');
    expect(buttons[1].className).toContain('cursor-pointer');
  });

  it('upcoming step buttons have bg-muted-foreground/20 class', () => {
    render(<ProgressIndicator currentStep={1} totalSteps={3} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons[1].className).toContain('bg-muted-foreground/20');
    expect(buttons[2].className).toContain('bg-muted-foreground/20');
  });

  it('calls onStepClick with correct step number when a completed dot is clicked', async () => {
    const user = userEvent.setup();
    const onStepClick = vi.fn();
    render(
      <ProgressIndicator
        currentStep={3}
        totalSteps={3}
        onStepClick={onStepClick}
      />
    );
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(onStepClick).toHaveBeenCalledWith(1);
  });
});
