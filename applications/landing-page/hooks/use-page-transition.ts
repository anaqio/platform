'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useTransition } from 'react';

import { NAV_START_EVENT } from '@/components/ui/NavigationProgress';

/**
 * Wraps Next.js navigation with three enhancements:
 *
 * 1. Fires `NAV_START_EVENT` BEFORE routing so NavigationProgress starts
 *    during the actual wait (chunk fetch, server round-trip) not after commit.
 * 2. Uses React's `startTransition` to keep the current page interactive.
 * 3. Opts into the View Transition API when available.
 *
 * Usage:
 *   const { navigate, isPending, prefetch } = usePageTransition();
 *   <button onMouseEnter={() => prefetch('/about')} onClick={() => navigate('/about')}>
 *     About
 *   </button>
 */
export function usePageTransition() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback(
    (href: string) => {
      // Signal the progress bar BEFORE the route change begins
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(NAV_START_EVENT));
      }

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document
      ) {
        (
          document as Document & {
            startViewTransition: (cb: () => void) => void;
          }
        ).startViewTransition(() => {
          startTransition(() => {
            router.push(href);
          });
        });
      } else {
        startTransition(() => {
          router.push(href);
        });
      }
    },

    [router]
  );

  const prefetch = useCallback(
    (href: string) => router.prefetch(href),
    [router]
  );

  return { navigate, isPending, prefetch };
}
