'use client'

import { useEffect } from 'react'
import { Badge } from '@anaqio/ui'

import { useRealtimeGeneration } from '@/hooks/useRealtimeGeneration'

interface GenerationStatusProps {
  generationId: string | null
  onCompleted: (outputPath: string) => void
  onFailed: (error: string) => void
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En file d'attente\u2026",
  processing: 'Génération en cours…',
  completed: 'Terminé !',
  failed: 'Échec',
}

export function GenerationStatus({ generationId, onCompleted, onFailed }: GenerationStatusProps) {
  const { status, outputPath, error } = useRealtimeGeneration(generationId)

  useEffect(() => {
    if (status === 'completed' && outputPath) onCompleted(outputPath)
    if (status === 'failed' && error) onFailed(error)
  }, [status, outputPath, error, onCompleted, onFailed])

  if (!generationId) return null

  const isActive = status === 'pending' || status === 'processing'

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {isActive && (
        <>
          {/* Breathing bars animation */}
          <div className="flex items-end gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-brand-gold w-1.5 origin-bottom rounded-full"
                style={{
                  height: '24px',
                  animation: `breathe 1.2s ease-in-out infinite ${i * 0.15}s`,
                }}
              />
            ))}
          </div>
          <p className="font-display text-brand-gold text-sm font-semibold">
            {STATUS_LABELS[status]}
          </p>
          <p className="text-muted-foreground text-xs">Cela prend environ 30 secondes</p>
        </>
      )}
      {status === 'failed' && (
        <div className="text-center">
          <Badge variant="destructive">Échec</Badge>
          {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
        </div>
      )}
    </div>
  )
}
