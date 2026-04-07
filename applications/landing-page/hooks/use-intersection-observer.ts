'use client';

import { useIntersectionObserver } from '@uidotdev/usehooks';

/**
 * Hook to observe element intersection with the viewport.
 * Useful for lazy-loading images/videos, triggering scroll animations,
 * and infinite scrolling implementations.
 *
 * @example
 * const [ref, entry] = useIntersectionObserver({ threshold: 0.1 });
 */
export { useIntersectionObserver };
