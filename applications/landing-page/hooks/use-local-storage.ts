'use client';

import { useLocalStorage } from '@uidotdev/usehooks';

/**
 * Hook to persist state in localStorage.
 * Useful for saving form progress, user preferences (theme, language),
 * and session-persistent UI states.
 *
 * @example
 * const [value, setValue] = useLocalStorage('key', 'default');
 */
export { useLocalStorage };
