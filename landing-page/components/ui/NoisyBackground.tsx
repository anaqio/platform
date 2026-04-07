'use client';

import React from 'react';

interface NoisyBackgroundProps {
  opacity?: number;
  baseFrequency?: string;
  numOctaves?: number;
}

/**
 * Reusable SVG noise overlay component.
 * Uses feTurbulence for high-quality fractal noise.
 */
export const NoisyBackground: React.FC<NoisyBackgroundProps> = ({
  opacity = 0.035,
  baseFrequency = '0.65',
  numOctaves = 4,
}) => {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="abstract-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#abstract-noise)" />
      </svg>
    </div>
  );
};
