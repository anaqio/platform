'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
}

interface GlassBubblesProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
}

/**
 * GlassBubbles component — Interactive, floating glass elements.
 * Responds to mouse-x and mouse-y CSS variables from a parent container.
 */
export const GlassBubbles: React.FC<GlassBubblesProps> = ({
  count,
  minSize = 60,
  maxSize = 180,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const gen = () => {
      const w = window.innerWidth;
      const isSmall = w < 640;
      const actualCount = count ?? (isSmall ? 6 : 12);
      const min = isSmall ? 40 : minSize;
      const max = isSmall ? 100 : maxSize;

      const arr: Bubble[] = [];
      for (let i = 0; i < actualCount; i++) {
        const size = Math.round(min + Math.random() * (max - min));
        arr.push({
          id: `b-${i}`,
          x: Math.round(Math.random() * 100),
          y: Math.round(Math.random() * 100),
          size,
        });
      }
      setBubbles(arr);
    };

    gen();

    const onResize = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        gen();
        rafRef.current = 0;
      });
    };

    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [count, minSize, maxSize]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      aria-hidden="true"
    >
      {bubbles.map((b, i) => (
        <div
          key={b.id}
          className="glass-bubble"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDelay: `${i * -2.5}s`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
};
