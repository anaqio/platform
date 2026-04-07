import { create } from 'zustand'

import type {
  AIProvider,
  ArtisticStyle,
  FitStyle,
  GenerationMode,
  ImageQuality,
} from '@/lib/generation-options'
import { buildPrompt, DEFAULT_OPTIONS, QUALITY_STEPS } from '@/lib/generation-options'

type WorkflowState = 'idle' | 'uploading' | 'generating' | 'completed' | 'error'

interface StudioState {
  // Workflow
  step: number
  workflowState: WorkflowState
  generationId: string | null
  outputPath: string | null
  errorMessage: string | null

  // Inputs
  garmentFile: File | null
  selectedPresetId: string | null

  // Options
  aiProvider: AIProvider
  mode: GenerationMode
  description: string
  backgroundColor: string
  quality: ImageQuality
  fitStyle: FitStyle
  artisticStyle: ArtisticStyle
}

interface StudioActions {
  // Navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void

  // Inputs
  setGarmentFile: (file: File | null) => void
  setSelectedPresetId: (id: string | null) => void

  // Options
  setAiProvider: (provider: AIProvider) => void
  setMode: (mode: GenerationMode) => void
  setDescription: (desc: string) => void
  setBackgroundColor: (color: string) => void
  setQuality: (quality: ImageQuality) => void
  setFitStyle: (fitStyle: FitStyle) => void
  setArtisticStyle: (style: ArtisticStyle) => void

  // Generation
  startGeneration: () => Promise<void>
  setOutputPath: (path: string) => void
  setGenerationFailed: (error: string) => void
  reset: () => void
}

const TOTAL_STEPS = 6

const initialState: StudioState = {
  step: 1,
  workflowState: 'idle',
  generationId: null,
  outputPath: null,
  errorMessage: null,
  garmentFile: null,
  selectedPresetId: null,
  aiProvider: DEFAULT_OPTIONS.aiProvider,
  mode: DEFAULT_OPTIONS.mode,
  description: DEFAULT_OPTIONS.description,
  backgroundColor: DEFAULT_OPTIONS.backgroundColor,
  quality: DEFAULT_OPTIONS.quality,
  fitStyle: DEFAULT_OPTIONS.fitStyle,
  artisticStyle: DEFAULT_OPTIONS.artisticStyle,
}

export const useStudioStore = create<StudioState & StudioActions>((set, get) => ({
  ...initialState,

  // Navigation
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, TOTAL_STEPS) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  goToStep: (step) => set({ step: Math.max(1, Math.min(step, TOTAL_STEPS)) }),

  // Inputs
  setGarmentFile: (file) => set({ garmentFile: file }),
  setSelectedPresetId: (id) => set({ selectedPresetId: id }),

  // Options
  setAiProvider: (provider) => set({ aiProvider: provider }),
  setMode: (mode) => set({ mode }),
  setDescription: (description) => set({ description }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setQuality: (quality) => set({ quality }),
  setFitStyle: (fitStyle) => set({ fitStyle }),
  setArtisticStyle: (artisticStyle) => set({ artisticStyle }),

  // Generation
  startGeneration: async () => {
    const state = get()
    if (!state.garmentFile || !state.selectedPresetId) return

    set({ workflowState: 'uploading', errorMessage: null })

    try {
      // 1. Upload garment
      const formData = new FormData()
      formData.append('garment', state.garmentFile)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Upload failed')
      const { garmentPath } = await uploadRes.json()

      // 2. Generate
      set({ workflowState: 'generating' })
      const sessionId = sessionStorage.getItem('anaqio-session') ?? crypto.randomUUID()
      sessionStorage.setItem('anaqio-session', sessionId)

      const genRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentPath,
          presetModelId: state.selectedPresetId,
          sessionId,
          description: buildPrompt({
            aiProvider: state.aiProvider,
            mode: state.mode,
            description: state.description,
            backgroundColor: state.backgroundColor,
            quality: state.quality,
            fitStyle: state.fitStyle,
            artisticStyle: state.artisticStyle,
            presetModelId: state.selectedPresetId,
          }),
          denoiseSteps: QUALITY_STEPS[state.quality],
          aiProvider: state.aiProvider,
        }),
      })
      if (!genRes.ok) {
        const body = await genRes.json().catch(() => null)
        throw new Error(body?.error ?? `Generation failed (${genRes.status})`)
      }
      const data = await genRes.json()
      set({ generationId: data.generationId })
    } catch (err) {
      set({
        workflowState: 'error',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      })
    }
  },

  setOutputPath: (path) => set({ outputPath: path, workflowState: 'completed' }),
  setGenerationFailed: (error) => set({ errorMessage: error, workflowState: 'error' }),
  reset: () => set(initialState),
}))

export const TOTAL_STUDIO_STEPS = TOTAL_STEPS
