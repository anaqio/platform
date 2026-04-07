import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AuthCard } from '@/components/ui/auth-card';

describe('AuthCard', () => {
  const defaultProps = {
    title: 'Sign In',
    description: 'Enter your credentials',
  };

  it('renders the title', () => {
    render(<AuthCard {...defaultProps}>Content</AuthCard>);

    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<AuthCard {...defaultProps}>Content</AuthCard>);

    expect(screen.getByText('Enter your credentials')).toBeInTheDocument();
  });

  it('renders children inside CardContent', () => {
    render(
      <AuthCard {...defaultProps}>
        <button type="button">Click me</button>
      </AuthCard>
    );

    expect(
      screen.getByRole('button', { name: 'Click me' })
    ).toBeInTheDocument();
  });

  it('applies custom className to outer wrapper', () => {
    const { container } = render(
      <AuthCard {...defaultProps} className="custom-class">
        Content
      </AuthCard>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('merges custom className with default classes', () => {
    const { container } = render(
      <AuthCard {...defaultProps} className="my-class">
        Content
      </AuthCard>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-6', 'my-class');
  });

  it('renders without className prop', () => {
    const { container } = render(
      <AuthCard {...defaultProps}>Content</AuthCard>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('flex', 'flex-col', 'gap-6');
  });

  it('has correct card structure with noise-overlay class', () => {
    const { container } = render(
      <AuthCard {...defaultProps}>Content</AuthCard>
    );

    const card = container.querySelector('.noise-overlay');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('border-white/5');
  });
});
