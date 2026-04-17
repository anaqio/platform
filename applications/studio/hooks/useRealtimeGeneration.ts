'use client'

import { useEffect, useState } from 'react'

import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'

type Generation = Database['public']['Tables']['generations']['Row']
type GenerationStatus = Generation['status']

export function useRealtimeGeneration(generationId: string | null) {
  const [status, setStatus] = useState<GenerationStatus>('pending')
  const [outputPath, setOutputPath] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!generationId) return
    const supabase = createClient()

    const channel = supabase
      .channel(`generation:${generationId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generations',
          filter: `id=eq.${generationId}`,
        },
        (payload) => {
          const row = payload.new as Generation
          setStatus(row.status)
          if (row.status === 'completed' && row.output_path) {
            setOutputPath(row.output_path)
          }
          if (row.status === 'failed') {
            setError(row.error_message ?? 'Generation failed')
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [generationId])

  return { status, outputPath, error }
}
