'use client';

import { useDebounce } from '@uidotdev/usehooks';

/**
 * Hook to debounce a value.
 * Useful for search inputs, filtering, and any state update
 * that shouldn't trigger expensive operations on every keystroke.
 *
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
export { useDebounce };
