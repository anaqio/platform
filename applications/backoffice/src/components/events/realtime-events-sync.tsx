'use client'

import { useRealtimeEvents } from '@/hooks/useRealtimeEvents'

export function RealtimeEventsSync() {
  useRealtimeEvents()
  return null
}
