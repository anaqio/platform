import { create } from 'zustand'

import type {
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
  outputBase64: string | null
  outputMimeType: string | null
  errorMessage: string | null

  // Inputs
  garmentFile: File | null
  selectedPresetId: string | null

  // Options
  mode: GenerationMode
  description: string
  backgroundColor: string
  quality: ImageQuality
  fitStyle: FitStyle
  artisticStyle: ArtisticStyle
  fashionPose: string
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
  setMode: (mode: GenerationMode) => void
  setDescription: (desc: string) => void
  setBackgroundColor: (color: string) => void
  setQuality: (quality: ImageQuality) => void
  setFitStyle: (fitStyle: FitStyle) => void
  setArtisticStyle: (style: ArtisticStyle) => void
  setFashionPose: (pose: string) => void

  // Generation
  startGeneration: () => Promise<void>
  setOutputPath: (path: string) => void
  setGenerationFailed: (error: string) => void
  reset: () => void

  // Validation
  canProceed: (step: number) => boolean
}

const TOTAL_STEPS = 5

const initialState: StudioState = {
  step: 1,
  workflowState: 'idle',
  generationId: null,
  outputPath: null,
  outputBase64: null,
  outputMimeType: null,
  errorMessage: null,
  garmentFile: null,
  selectedPresetId: null,
  mode: DEFAULT_OPTIONS.mode,
  description: DEFAULT_OPTIONS.description,
  backgroundColor: DEFAULT_OPTIONS.backgroundColor,
  quality: DEFAULT_OPTIONS.quality,
  fitStyle: DEFAULT_OPTIONS.fitStyle,
  artisticStyle: DEFAULT_OPTIONS.artisticStyle,
  fashionPose: '',
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
  setMode: (mode) => set({ mode }),
  setDescription: (description) => set({ description }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setQuality: (quality) => set({ quality }),
  setFitStyle: (fitStyle) => set({ fitStyle }),
  setArtisticStyle: (artisticStyle) => set({ artisticStyle }),
  setFashionPose: (fashionPose) => set({ fashionPose }),

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
            mode: state.mode,
            description: state.description,
            backgroundColor: state.backgroundColor,
            quality: state.quality,
            fitStyle: state.fitStyle,
            artisticStyle: state.artisticStyle,
            presetModelId: state.selectedPresetId,
            fashionPose: state.fashionPose,
            aiProvider: 'gemini',
          }),
          denoiseSteps: QUALITY_STEPS[state.quality],
        }),
      })
      if (!genRes.ok) {
        const body = await genRes.json().catch(() => null)
        throw new Error(body?.error ?? `Generation failed (${genRes.status})`)
      }
      const data = await genRes.json()
      set({
        generationId: data.generationId,
        outputBase64: data.outputBase64 ?? null,
        outputMimeType: data.outputMimeType ?? null,
      })
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

  canProceed: (step) => {
    const state = get()
    switch (step) {
      case 1:
        return true
      case 2:
        return !!state.garmentFile
      case 3:
        return !!state.fashionPose
      case 4:
        return true
      case 5:
        return !!state.selectedPresetId
      default:
        return true
    }
  },
}))

export const TOTAL_STUDIO_STEPS = TOTAL_STEPS
