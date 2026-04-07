import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ResultCard } from '@/lib/data/results-section';

import { ResultCardAtom } from '@/components/atoms/ResultCardAtom';

describe('ResultCardAtom', () => {
  const mockResult: ResultCard = {
    metric: 'Cost per Shoot',
    traditional: '5,000 MAD',
    anaqio: '500 MAD',
    improvement: '90% reduction',
  };

  it('renders metric name', () => {
    render(<ResultCardAtom result={mockResult} />);
    const metric = screen.getByText('Cost per Shoot');
    expect(metric).toBeInTheDocument();
  });

  it('renders traditional value', () => {
    render(<ResultCardAtom result={mockResult} />);
    const traditional = screen.getByText('5,000 MAD');
    expect(traditional).toBeInTheDocument();
  });

  it('renders anaqio value', () => {
    render(<ResultCardAtom result={mockResult} />);
    const anaqio = screen.getByText('500 MAD');
    expect(anaqio).toBeInTheDocument();
  });

  it('renders improvement', () => {
    render(<ResultCardAtom result={mockResult} />);
    const improvement = screen.getByText('90% reduction');
    expect(improvement).toBeInTheDocument();
  });

  it('renders all comparison labels', () => {
    render(<ResultCardAtom result={mockResult} />);
    expect(screen.getByText('Traditional')).toBeInTheDocument();
    expect(screen.getByText('ANAQIO')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<ResultCardAtom result={mockResult} />);
    const card = container.firstChild;
    expect(card).toHaveClass('overflow-hidden', 'rounded-lg', 'border');
  });
});
