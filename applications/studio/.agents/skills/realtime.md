# skill: realtime

# load when: Supabase Realtime · subscriptions · live status · channels · postgres_changes

## PATTERN FOR ANAQIO: generation status tracking

```typescript
// hooks/useRealtimeGeneration.ts
'use client'

import { useEffect, useRef, useState } from 'react'

import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'

type Generation = Database['public']['Tables']['generations']['Row']
type Status = Generation['status']

export interface RealtimeGenerationState {
  status: Status
  outputPath: string | null
  error: string | null
  inferenceMs: number | null
}

export function useRealtimeGeneration(generationId: string | null): RealtimeGenerationState {
  const [state, setState] = useState<RealtimeGenerationState>({
    status: 'pending',
    outputPath: null,
    error: null,
    inferenceMs: null,
  })
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    if (!generationId) return

    const supabase = createClient()

    // Clean up previous subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }

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
          setState({
            status: row.status,
            outputPath: row.output_path ?? null,
            error: row.error_message ?? null,
            inferenceMs: row.inference_ms ?? null,
          })
        }
      )
      .subscribe((status, err) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('[realtime] Channel error:', err)
        }
      })

    channelRef.current = channel

    // Cleanup on unmount or generationId change
    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
  }, [generationId])

  return state
}
```

## USAGE IN STUDIO SHELL

```typescript
// In StudioShell.tsx
const { generationId, state: genState, startGeneration } = useGeneration()
const realtime = useRealtimeGeneration(generationId)

// Sync realtime status back to local state when completed/failed
useEffect(() => {
  if (realtime.status === 'completed' || realtime.status === 'failed') {
    // Update parent state — generation is done
  }
}, [realtime.status])
```

## REQUIRED: ENABLE REALTIME ON TABLE

```sql
-- Run once in Supabase Dashboard > Database > Replication
-- OR in migration file
alter publication supabase_realtime add table public.generations;

-- Verify
select * from pg_publication_tables where pubname = 'supabase_realtime';
```

## STATUS DISPLAY COMPONENT

```typescript
// components/studio/GenerationStatus.tsx
'use client'
import { useRealtimeGeneration } from '@/hooks/useRealtimeGeneration'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/studio/StatusBadge'

const STATUS_LABELS: Record<string, { fr: string; progress: number }> = {
  pending:    { fr: 'En attente...',        progress: 10 },
  processing: { fr: 'Génération en cours...', progress: 60 },
  completed:  { fr: 'Terminé !',            progress: 100 },
  failed:     { fr: 'Échec de la génération', progress: 0 },
}

const ESTIMATED_WAIT = '~45 secondes'

interface Props {
  generationId: string
  onCompleted: (outputPath: string) => void
  onFailed: (error: string) => void
}

export function GenerationStatus({ generationId, onCompleted, onFailed }: Props) {
  const { status, outputPath, error } = useRealtimeGeneration(generationId)
  const label = STATUS_LABELS[status] ?? STATUS_LABELS.pending

  useEffect(() => {
    if (status === 'completed' && outputPath) onCompleted(outputPath)
    if (status === 'failed' && error) onFailed(error)
  }, [status, outputPath, error, onCompleted, onFailed])

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label.fr}</span>
        <StatusBadge status={status} />
      </div>
      <Progress value={label.progress} className="h-2" />
      {status === 'processing' && (
        <p className="text-xs text-muted-foreground">Temps estimé : {ESTIMATED_WAIT}</p>
      )}
      {status === 'failed' && error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}
```

## CHANNEL NAMING CONVENTION

```
generation:{id}           — single generation status (used in studio)
user-generations:{userId} — all generations for a user (future dashboard)
```

## IMPORTANT GOTCHAS

```
1. Realtime requires table added to supabase_realtime publication (see SQL above)
2. RLS applies to Realtime — user can only receive updates for rows they can SELECT
3. Always use useRef for channel cleanup — avoid re-subscribing on every render
4. createClient() in useEffect is fine — createBrowserClient is lightweight
5. filter syntax: 'column=eq.value' — column must be indexed for performance
6. postgres_changes delivers FULL row in payload.new — no need for additional fetch
7. On CHANNEL_ERROR — log but don't crash; fall back to polling if critical
```

## POLLING FALLBACK (if Realtime unreliable on expo venue network)

```typescript
// hooks/useGenerationPolling.ts — fallback for degraded networks
'use client'

import { useEffect, useState } from 'react'

import type { Database } from '@/types/supabase'
import { createClient } from '@/lib/supabase/client'

type Status = Database['public']['Tables']['generations']['Row']['status']

export function useGenerationPolling(generationId: string | null, intervalMs = 3000) {
  const [status, setStatus] = useState<Status>('pending')
  const [outputPath, setOutputPath] = useState<string | null>(null)

  useEffect(() => {
    if (!generationId) return
    if (status === 'completed' || status === 'failed') return

    const supabase = createClient()
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('generations')
        .select('status, output_path, error_message')
        .eq('id', generationId)
        .single()
      if (data) {
        setStatus(data.status)
        if (data.output_path) setOutputPath(data.output_path)
        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval)
        }
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [generationId, status, intervalMs])

  return { status, outputPath }
}
```
