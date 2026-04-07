'use client';

import { useEffect } from 'react';

/**
 * Prevents browser's default hash scroll behavior on page load.
 *
 * By default, browsers automatically scroll to elements matching
 * the URL hash when a page loads. This component disables that
 * behavior to allow custom scroll handling.
 *
 * Sets `history.scrollRestoration = 'manual'` to prevent the
 * browser from restoring scroll position on navigation.
 */
export function HashScrollSuppressor() {
  useEffect(() => {
    // Disable browser's automatic scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Prevent default hash scroll behavior on load
    const handleHashChange = () => {
      // Don't prevent default here - let the hash work for accessibility
      // We only suppress the initial load scroll
    };

    // Scroll to top on initial load regardless of hash
    // This prevents auto-scroll to #final-cta on page refresh
    window.scrollTo(0, 0);

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return null;
}
