'use client';
import { useSyncExternalStore } from 'react';

type Tier = 'high' | 'mid' | 'low';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection;
  if (connection) {
    connection.addEventListener('change', callback);
    return () => connection.removeEventListener('change', callback);
  }
  return () => {};
};

const getSnapshot = (): Tier => {
  if (typeof window === 'undefined') return 'high';

  const cores = navigator.hardwareConcurrency ?? 4;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const memory = (navigator as any).deviceMemory ?? 4;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connection = (navigator as any).connection?.effectiveType ?? '4g';

  if (
    cores <= 2 ||
    memory <= 1 ||
    connection === '2g' ||
    connection === 'slow-2g'
  ) {
    return 'low';
  } else if (cores <= 4 || memory <= 2 || connection === '3g') {
    return 'mid';
  } else {
    return 'high';
  }
};

const getServerSnapshot = (): Tier => 'high';

export function useDeviceTier(): Tier {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
