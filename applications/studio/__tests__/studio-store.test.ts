import fc from 'fast-check'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useStudioStore } from '../stores/studio-store'

const initialState = useStudioStore.getState()

beforeEach(() => {
  useStudioStore.setState(initialState)
})

describe('canProceed step logic', () => {
  it('step 1: always returns true', () => {
    expect(useStudioStore.getState().canProceed(1)).toBe(true)
  })

  it('step 2: returns false when garmentFile is null', () => {
    useStudioStore.setState({ garmentFile: null })
    expect(useStudioStore.getState().canProceed(2)).toBe(false)
  })

  it('step 2: returns true when garmentFile is set', () => {
    useStudioStore.setState({ garmentFile: new File([''], 'garment.jpg') })
    expect(useStudioStore.getState().canProceed(2)).toBe(true)
  })

  it('step 3: returns false when fashionPose is empty string', () => {
    useStudioStore.setState({ fashionPose: '' })
    expect(useStudioStore.getState().canProceed(3)).toBe(false)
  })

  it('step 3: returns true when fashionPose is non-empty', () => {
    useStudioStore.setState({ fashionPose: 'Standing upright, arms at sides' })
    expect(useStudioStore.getState().canProceed(3)).toBe(true)
  })

  it('step 4: always returns true', () => {
    expect(useStudioStore.getState().canProceed(4)).toBe(true)
  })

  it('step 5: returns false when selectedPresetId is null', () => {
    useStudioStore.setState({ selectedPresetId: null })
    expect(useStudioStore.getState().canProceed(5)).toBe(false)
  })

  it('step 5: returns true when selectedPresetId is set', () => {
    useStudioStore.setState({ selectedPresetId: 'preset-abc' })
    expect(useStudioStore.getState().canProceed(5)).toBe(true)
  })
})

describe('Generate button disabled states', () => {
  // Feature: gemini-only-studio, Property 10: Generate button disabled without pose
  it('Property 10: canProceed(3) returns false for any store state with fashionPose empty', () => {
    fc.assert(
      fc.property(
        fc.option(fc.string({ minLength: 1 }), { nil: null }),
        fc.option(fc.string({ minLength: 1 }), { nil: null }),
        (garmentFileName, selectedPresetId) => {
          const garmentFile = garmentFileName ? new File([''], garmentFileName) : null
          useStudioStore.setState({ fashionPose: '', garmentFile, selectedPresetId })
          expect(useStudioStore.getState().canProceed(3)).toBe(false)
        }
      )
    )
  })
})

describe('startGeneration error handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('surfaces upload API errors instead of using a generic message', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: 'Bucket not found' }),
    }) as typeof fetch

    useStudioStore.setState({
      garmentFile: new File(['image'], 'garment.png', { type: 'image/png' }),
      selectedPresetId: 'preset-1',
    })

    await useStudioStore.getState().startGeneration()

    const state = useStudioStore.getState()
    expect(state.workflowState).toBe('error')
    expect(state.errorMessage).toBe('Bucket not found')
  })
})
