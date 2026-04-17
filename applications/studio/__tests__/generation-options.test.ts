import fc from 'fast-check'
import { describe, expect, it } from 'vitest'

import { buildPrompt, DEFAULT_OPTIONS } from '../lib/generation-options'

describe('buildPrompt pose behaviour', () => {
  // Feature: gemini-only-studio, Property 3: Pose included in prompt when non-empty
  it('Property 3: includes fashionPose string in output when non-empty', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (fashionPose) => {
        const result = buildPrompt({ ...DEFAULT_OPTIONS, fashionPose })
        expect(result).toContain(fashionPose)
      })
    )
  })

  // Feature: gemini-only-studio, Property 4: Pose omitted from prompt when empty
  it('Property 4: does not contain pose instruction keyword when fashionPose is empty', () => {
    fc.assert(
      fc.property(fc.constant(''), (_fashionPose) => {
        const result = buildPrompt({ ...DEFAULT_OPTIONS, fashionPose: '' })
        expect(result).not.toContain('following pose')
      })
    )
  })

  // Feature: gemini-only-studio, Property 5: Pose ordering in prompt
  it('Property 5: pose appears after fit instruction and fit appears before scene instruction', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (fashionPose) => {
        const result = buildPrompt({
          ...DEFAULT_OPTIONS,
          fashionPose,
          artisticStyle: 'default',
        })
        // Use the pose step marker to locate the pose instruction reliably
        const poseIndex = result.indexOf('**Pose:**')
        const fitIndex = result.indexOf('Define Garment Fit')
        const sceneIndex = result.indexOf('Set the Scene')

        expect(poseIndex).toBeGreaterThan(fitIndex)
        expect(fitIndex).toBeLessThan(sceneIndex)
      })
    )
  })
})
