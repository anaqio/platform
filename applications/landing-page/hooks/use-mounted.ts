'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to track component mount status.
 * Useful for resolving hydration mismatches by delaying client-only rendering.
 *
 * @returns {boolean} True if the component is mounted on the client.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
