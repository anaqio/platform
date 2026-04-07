'use client';
import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};

  const mql = window.matchMedia('(pointer: coarse)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
};

const getServerSnapshot = () => false;

export function useIsTouch() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
