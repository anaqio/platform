import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { Feature } from '@/lib/data/features-section';

vi.mock('@/hooks/use-animation-ready', () => ({
  useAnimationReady: () => ({ reduced: false, tier: 'high', animated: true }),
}));

import { FeatureCardAtom } from '@/components/atoms/FeatureCardAtom';

describe('FeatureCardAtom', () => {
  const mockFeature: Feature = {
    icon: '🎨',
    title: 'AI Virtual Try-On',
    description: 'Let customers visualize products before purchase.',
  };

  it('renders feature icon', () => {
    render(<FeatureCardAtom feature={mockFeature} />);
    const icon = screen.getByText('🎨');
    expect(icon).toBeInTheDocument();
  });

  it('renders feature title', () => {
    render(<FeatureCardAtom feature={mockFeature} />);
    const title = screen.getByText('AI Virtual Try-On');
    expect(title).toBeInTheDocument();
  });

  it('renders feature description', () => {
    render(<FeatureCardAtom feature={mockFeature} />);
    const description = screen.getByText(
      'Let customers visualize products before purchase.'
    );
    expect(description).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<FeatureCardAtom feature={mockFeature} />);
    const card = container.firstChild;
    expect(card).toHaveClass('rounded-lg', 'border', 'p-6');
  });

  it('accepts index prop for staggered animation', () => {
    const { container } = render(
      <FeatureCardAtom feature={mockFeature} index={2} />
    );
    expect(container.firstChild).toBeInTheDocument();
  });
});
