'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export function useRealtimeCampaigns() {
  const router = useRouter()
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('realtime:campaigns')
      .on('postgres_changes', { event: '*', schema: 'landing', table: 'campaigns' }, () => {
        router.refresh()
      })
      .subscribe()

    channelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
    }
  }, [router])
}
