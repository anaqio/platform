'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ModificationPanelProps {
  currentImageBase64: string
  currentMimeType: string
  onModified: (base64: string, mimeType: string) => void
}

export function ModificationPanel({
  currentImageBase64,
  currentMimeType,
  onModified,
}: ModificationPanelProps) {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: currentImageBase64,
          mimeType: currentMimeType,
          modificationPrompt: prompt,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Modification failed')
      } else {
        onModified(data.imageBase64, data.mimeType)
        setPrompt('')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modification failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-2')}>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        maxLength={500}
        placeholder="Describe your modification..."
        disabled={isLoading}
        rows={3}
      />
      {error !== null && <p className="text-destructive text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading || !prompt.trim()} className="w-full gap-2">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Modify'}
      </Button>
    </form>
  )
}
