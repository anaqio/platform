// __spec__/components/atoms/MarqueeTickerAtom.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MarqueeTickerAtom } from '@/components/atoms/MarqueeTickerAtom';
import { MARQUEE_ITEMS } from '@/lib/data/marquee-content';

describe('MarqueeTickerAtom', () => {
  it('should render all marquee items', () => {
    render(
      <MarqueeTickerAtom items={MARQUEE_ITEMS} background="bg-slate-900" />
    );
    MARQUEE_ITEMS.forEach((item) => {
      expect(screen.getAllByText(item.text).length).toBe(2);
    });
  });

  it('should render emoji for each item', () => {
    render(
      <MarqueeTickerAtom items={MARQUEE_ITEMS} background="bg-slate-900" />
    );
    MARQUEE_ITEMS.forEach((item) => {
      expect(screen.getAllByText(item.emoji).length).toBe(2);
    });
  });

  it('should apply background class', () => {
    const { container } = render(
      <MarqueeTickerAtom items={MARQUEE_ITEMS} background="bg-white" />
    );
    expect(container.firstChild).toHaveClass('bg-white');
  });

  it('should duplicate items for seamless loop', () => {
    const { container } = render(
      <MarqueeTickerAtom items={MARQUEE_ITEMS} background="bg-slate-900" />
    );
    const itemElements = container.querySelectorAll('[data-marquee-item]');
    expect(itemElements.length).toBe(MARQUEE_ITEMS.length * 2);
  });
});
