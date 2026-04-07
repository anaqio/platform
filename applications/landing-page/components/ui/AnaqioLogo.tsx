'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';

interface AnaqioLogoProps {
  className?: string;
  theme?: 'light' | 'dark';
  /** Height in pixels for the graphic mark (wordmark scales proportionally) */
  size?: number;
}

export function AnaqioLogo({
  className,
  theme = 'light',
  size = 40,
}: AnaqioLogoProps) {
  // GraphicLogo.svg viewBox: 713 × 587 → aspect ≈ 1.215
  const graphicWidth = Math.round(size * (713.056 / 586.869));
  // Typography logo viewBox: 1123 × 794 → aspect ≈ 1.414
  const typoHeight = Math.round(size * 0.55); // wordmark sits a bit smaller
  const typoWidth = Math.round(typoHeight * (1123 / 794));

  return (
    <div
      className={cn('flex items-center gap-3', className)}
      aria-label="Anaqio"
      role="img"
    >
      {/* Graphic mark */}
      <Image
        src="/brand/anaqio-graphic-logo.svg"
        alt=""
        width={graphicWidth}
        height={size}
        className={cn(
          'shrink-0',
          theme === 'dark' ? 'brightness-0 invert' : ''
        )}
        priority
      />

      {/* Wordmark */}
      <Image
        src="/brand/anaqio-typography-logo.svg"
        alt="Anaqio"
        width={typoWidth}
        height={typoHeight}
        className={cn(
          'shrink-0',
          theme === 'dark' ? 'brightness-0 invert' : ''
        )}
        priority
      />
    </div>
  );
}
