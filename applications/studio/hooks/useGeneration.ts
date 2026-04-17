'use client'

import { useState } from 'react'

import type { GenerationOptions } from '@/lib/generation-options'
import { buildPrompt, QUALITY_STEPS } from '@/lib/generation-options'

type State = 'idle' | 'uploading' | 'generating' | 'completed' | 'error'

export function useGeneration() {
  const [state, setState] = useState<State>('idle')
  const [generationId, setGenerationId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function startGeneration(
    garmentFile: File,
    presetModelId: string,
    options: GenerationOptions
  ) {
    setState('uploading')
    setErrorMessage(null)

    try {
      const formData = new FormData()
      formData.append('garment', garmentFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { garmentPath } = await uploadRes.json()

      setState('generating')
      const sessionId = sessionStorage.getItem('anaqio-session') ?? crypto.randomUUID()
      sessionStorage.setItem('anaqio-session', sessionId)

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentPath,
          presetModelId,
          sessionId,
          description: buildPrompt(options),
          denoiseSteps: QUALITY_STEPS[options.quality],
          aiProvider: options.aiProvider,
        }),
      })
      if (!genRes.ok) throw new Error('Generation request failed')
      const data = await genRes.json()
      setGenerationId(data.generationId)
    } catch (err) {
      setState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  function reset() {
    setState('idle')
    setGenerationId(null)
    setErrorMessage(null)
  }

  return { state, generationId, errorMessage, startGeneration, reset }
}
