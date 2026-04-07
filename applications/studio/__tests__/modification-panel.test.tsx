import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ModificationPanel } from '../components/studio/ModificationPanel'

const defaultProps = {
  currentImageBase64: 'base64data',
  currentMimeType: 'image/png',
  onModified: vi.fn(),
}

beforeEach(() => {
  vi.resetAllMocks()
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// Validates: Requirements 6.5, 6.6
describe('ModificationPanel', () => {
  it('submit button is disabled when prompt is empty (initial state)', () => {
    render(<ModificationPanel {...defaultProps} />)
    const button = screen.getByRole('button', { name: /modify/i })
    expect(button).toBeDisabled()
  })

  it('submit button is enabled when prompt has text', () => {
    render(<ModificationPanel {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Make it red' } })
    const button = screen.getByRole('button', { name: /modify/i })
    expect(button).toBeEnabled()
  })

  it('displays error message inline when API returns an error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Gemini failed' }),
    })

    render(<ModificationPanel {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Make it red' } })
    fireEvent.click(screen.getByRole('button', { name: /modify/i }))

    await waitFor(() => {
      expect(screen.getByText('Gemini failed')).toBeInTheDocument()
    })
  })

  it('input (textarea) is re-enabled after an error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Gemini failed' }),
    })

    render(<ModificationPanel {...defaultProps} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Make it red' } })
    fireEvent.click(screen.getByRole('button', { name: /modify/i }))

    await waitFor(() => {
      expect(textarea).toBeEnabled()
    })
  })

  it('calls onModified with correct args on success', async () => {
    const onModified = vi.fn()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ imageBase64: 'newbase64', mimeType: 'image/png' }),
    })

    render(<ModificationPanel {...defaultProps} onModified={onModified} />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Make it red' } })
    fireEvent.click(screen.getByRole('button', { name: /modify/i }))

    await waitFor(() => {
      expect(onModified).toHaveBeenCalledWith('newbase64', 'image/png')
    })
  })
})
