import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { StudioShell } from '../components/studio/StudioShell'
import { TOTAL_STUDIO_STEPS, useStudioStore } from '../stores/studio-store'

const initialState = useStudioStore.getState()

beforeEach(() => {
  useStudioStore.setState(initialState)
})

// Feature: gemini-only-studio, Property 9: Wizard step count invariant
describe('Property 9: Wizard step count invariant', () => {
  it('TOTAL_STUDIO_STEPS constant equals 5', () => {
    // Validates: Requirements 2.1, 2.3, 8.4
    expect(TOTAL_STUDIO_STEPS).toBe(5)
  })

  it('progress bar shows "Step 1 of 5" on initial render', () => {
    useStudioStore.setState({ outputPath: null, workflowState: 'idle' })
    render(<StudioShell presets={[]} />)
    expect(screen.getByText('Step 1 of 5')).toBeInTheDocument()
  })
})

describe('StudioShell navigation guards', () => {
  it('Back button is disabled on step 1', () => {
    useStudioStore.setState({ step: 1, outputPath: null, workflowState: 'idle' })
    render(<StudioShell presets={[]} />)
    const backButton = screen.getByRole('button', { name: /back/i })
    expect(backButton).toBeDisabled()
  })

  it('Next button is disabled on step 2 when no garment file is set', () => {
    useStudioStore.setState({ step: 2, garmentFile: null, outputPath: null, workflowState: 'idle' })
    render(<StudioShell presets={[]} />)
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('Next button is disabled on step 3 when fashionPose is empty', () => {
    useStudioStore.setState({
      step: 3,
      fashionPose: '',
      outputPath: null,
      workflowState: 'idle',
    })
    render(<StudioShell presets={[]} />)
    const nextButton = screen.getByRole('button', { name: /next/i })
    expect(nextButton).toBeDisabled()
  })

  it('Generate button is disabled when fashionPose is empty (on step 5)', () => {
    useStudioStore.setState({
      step: 5,
      fashionPose: '',
      garmentFile: new File([''], 'garment.jpg'),
      selectedPresetId: 'preset-1',
      outputPath: null,
      workflowState: 'idle',
    })
    render(<StudioShell presets={[]} />)
    const generateButton = screen.getByRole('button', { name: /generate/i })
    expect(generateButton).toBeDisabled()
  })
})
