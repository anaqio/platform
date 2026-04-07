import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('should apply variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button', { name: /delete/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('should support asChild prop to render as a different element', () => {
    render(
      <Button asChild>
        <span data-testid="child-span">Link Button</span>
      </Button>
    );
    const span = screen.getByTestId('child-span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('Link Button');
  });
});
