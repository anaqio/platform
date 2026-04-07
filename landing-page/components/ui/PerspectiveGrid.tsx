'use client';

import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export function PerspectiveGrid({ className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-0 bottom-0 h-[260px] overflow-hidden',
        className
      )}
    >
      <div className="perspective-grid mx-auto h-[160%] w-[120%]" />
      {/* Shimmer sweep */}
      <div className="grid-shimmer" />
    </div>
  );
}

export default PerspectiveGrid;
