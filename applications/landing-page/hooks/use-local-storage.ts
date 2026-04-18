'use client'

import { useCallback, useEffect, useState } from 'react'

function readStoredValue<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue
  }

  try {
    const item = window.localStorage?.getItem?.(key)

    if (!item) {
      return initialValue
    }

    return JSON.parse(item) as T
  } catch {
    return initialValue
  }
}

/**
 * Hook to persist state in localStorage.
 * Falls back to in-memory state when storage is unavailable.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => readStoredValue(key, initialValue))

  useEffect(() => {
    setStoredValue(readStoredValue(key, initialValue))
  }, [key])

  const setValue = useCallback<React.Dispatch<React.SetStateAction<T>>>(
    (value) => {
      setStoredValue((currentValue) => {
        const nextValue = value instanceof Function ? value(currentValue) : value

        try {
          window.localStorage?.setItem?.(key, JSON.stringify(nextValue))
        } catch {
          // Ignore storage write failures and keep local state usable.
        }

        return nextValue
      })
    },
    [key]
  )

  return [storedValue, setValue]
}
