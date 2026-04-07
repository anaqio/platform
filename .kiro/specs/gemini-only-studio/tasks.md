# Implementation Plan: Gemini-Only Studio Refactor

## Overview

Refactor `applications/studio/` to use Gemini as the sole inference provider, simplify the
wizard from 6 to 5 steps, add a `FashionPoseSelector` step, and introduce a client-side
iterative modification loop backed by a new `POST /api/modify` route.

All tasks are TypeScript/React. No database migrations required.

## Tasks

- [x] 1. Simplify `lib/generation-options.ts` to Gemini-only with pose support
  - [x] 1.1 Narrow `aiProviderSchema` to `z.literal('gemini')`, update `AIProvider` type, set `DEFAULT_OPTIONS.aiProvider` to `'gemini'`
    - Remove `'idm_vton'` and `'fal_ai'` from the enum
    - _Requirements: 1.1, 1.2_
  - [x] 1.2 Add `fashionPose: z.string().default('')` to `generationOptionsSchema` and `GenerationOptions`
    - _Requirements: 3.3, 3.4_
  - [x] 1.3 Update `buildPrompt` to always build the rich Gemini prompt (remove the `aiProvider !== 'gemini'` short-circuit branch) and insert pose instruction between fit and scene steps when `fashionPose` is non-empty
    - Pose instruction text: `"The model must be in the following pose: {fashionPose}."`
    - Insert after fit step, before scene/background step
    - _Requirements: 4.1, 4.2, 4.3_
  - [x] 1.4 Write property tests for `buildPrompt` pose behaviour
    - **Property 3: Pose included in prompt when non-empty** — arbitrary non-empty `fashionPose` strings → output contains the string
    - **Validates: Requirements 4.1**
    - **Property 4: Pose omitted from prompt when empty** — `fashionPose: ''` → output never contains pose instruction keyword
    - **Validates: Requirements 4.3**
    - **Property 5: Pose ordering in prompt** — non-empty pose → pose substring index > fit index, fit index < scene index
    - **Validates: Requirements 4.2**
    - Place in `applications/studio/__tests__/generation-options.test.ts`

- [x] 2. Simplify `lib/inference/index.ts` and delete dead provider files
  - [x] 2.1 Rewrite `lib/inference/index.ts` to remove `InferenceProvider` union and `switch` dispatch; export `runGeminiVTON` directly as `runInference`
    - _Requirements: 1.3, 1.4_
  - [x] 2.2 Delete `lib/inference/hf-spaces.ts` and `lib/inference/fal.ts`
    - _Requirements: 1.4_

- [x] 3. Update `stores/studio-store.ts` for 5-step Gemini-only wizard
  - [x] 3.1 Set `TOTAL_STEPS` to `5`, remove `aiProvider` state field and `setAiProvider` action, add `fashionPose: string` (default `''`) and `setFashionPose(pose: string)` action
    - _Requirements: 2.1, 2.3, 2.4, 3.3, 3.4_
  - [x] 3.2 Update `startGeneration` to remove `aiProvider` from the `buildPrompt` call and pass `fashionPose`; update `canProceed` logic for the new step numbering (step 2: garment, step 3: pose required, step 5: preset)
    - _Requirements: 3.5, 4.4, 8.3_
  - [x] 3.3 Write unit tests for `canProceed` step logic and Generate button disabled states
    - Verify step 3 returns false when `fashionPose` is empty, true when non-empty
    - **Property 10: Generate button disabled without pose** — arbitrary store states with `fashionPose: ''` → `canProceed(3)` returns false
    - **Validates: Requirements 3.5, 8.3**
    - Place in `applications/studio/__tests__/studio-store.test.ts`

- [x] 4. Create `components/studio/FashionPoseSelector.tsx`
  - [x] 4.1 Implement the component adapted from `ai-studio-base/components/FashionPoseSelector.tsx` using the studio's shadcn/Tailwind design system
    - Props: `value: string`, `onChange: (pose: string) => void`
    - Accordion-style: one category open at a time (default: first category open)
    - All 7 categories with exact pose `en` strings from the base app
    - Selected pose highlighted with brand gold ring (`ring-2 ring-[#D4AF37]`)
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 4.2 Write unit tests for `FashionPoseSelector`
    - Renders all 7 category headings
    - Clicking a pose fires `onChange` with the correct `en` string
    - Accordion open/close behaviour
    - _Requirements: 3.2_

- [x] 5. Update `components/studio/StudioShell.tsx` for 5-step wizard
  - [x] 5.1 Remove `AIProviderSelector` import and case 1; renumber steps: ModeSelector→1, GarmentUploader→2, FashionPoseSelector→3, GarmentDescription→4, StyleQuality+ModelPreset→5
    - Remove `isGemini` flag (always Gemini)
    - Step 3 header: no `optional` prop (required)
    - _Requirements: 2.1, 2.2, 2.5, 3.1, 3.6, 8.1_
  - [x] 5.2 Update `canProceed` and Generate button disabled condition to include `!store.fashionPose`
    - _Requirements: 3.5, 8.2, 8.3_
  - [x] 5.3 Write unit tests for `StudioShell` step rendering and navigation guards
    - **Property 9: Wizard step count invariant** — progress bar denominator and `TOTAL_STEPS` both equal 5
    - **Validates: Requirements 2.1, 2.3, 8.4**
    - _Requirements: 8.4, 8.5_

- [x] 6. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Update `app/api/generate/route.ts` to Gemini-only with base64 response
  - [x] 7.1 Remove `PROVIDER_MAP`, remove `aiProvider` from destructuring, always call `runGeminiVTON` directly; add 400 guard when `aiProvider` is present and not `'gemini'`
    - _Requirements: 1.3, 1.5, 1.6_
  - [x] 7.2 Capture `outputBase64` and `outputMimeType` from the Gemini result and return them alongside `generationId` and `outputPath` in the success response
    - Extract base64 from the `data:` URL returned by `runGeminiVTON`
    - _Requirements: 5.4, 6.1_
  - [x] 7.3 Write property tests for the generate route schema and provider guard
    - **Property 1: Gemini-only provider enforcement** — requests with `aiProvider !== 'gemini'` → 400, no DB write
    - **Validates: Requirements 1.6**
    - **Property 2: Absent provider defaults to Gemini** — absent `aiProvider` behaves identically to `'gemini'`
    - **Validates: Requirements 1.5**
    - Place in `applications/studio/__tests__/api-generate.test.ts`

- [x] 8. Create `app/api/modify/route.ts`
  - [x] 8.1 Implement `POST /api/modify` with `modifyRequestSchema` (zod: `imageBase64`, `mimeType`, `modificationPrompt` max 500 chars), same auth pattern as `/api/generate` (kiosk bypass or authenticated user)
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.7, 7.8_
  - [x] 8.2 Call Gemini with the provided base64 image and modification prompt; return `{ imageBase64, mimeType }` on success; return 500 with descriptive error when Gemini returns no image
    - Use `GOOGLE_AI_API_KEY` env var; never write to `generations` table
    - _Requirements: 7.3, 7.6, 7.7, 7.8_
  - [x] 8.3 Write property tests for `modifyRequestSchema` and the modify route
    - **Property 7: Modify API round-trip returns an image** — valid `ModifyRequest` shapes → response has non-empty `imageBase64`
    - **Validates: Requirements 7.3**
    - **Property 8: Modify API rejects invalid requests** — `modificationPrompt` > 500 chars → schema parse fails / 400 response
    - **Validates: Requirements 7.4**
    - **Property 6: Modification loop does not write to DB** — `generations` row count unchanged before and after call
    - **Validates: Requirements 6.7, 7.7**
    - Place in `applications/studio/__tests__/api-modify.test.ts`

- [x] 9. Create `components/studio/ModificationPanel.tsx`
  - [x] 9.1 Implement `ModificationPanel` with props `currentImageBase64: string`, `currentMimeType: string`, `onModified: (base64: string, mimeType: string) => void`
    - Textarea (max 500 chars) for modification prompt
    - Submit button disabled while loading or prompt is empty
    - Calls `POST /api/modify`, shows loading spinner on submit button
    - On error: displays error message inline, preserves current image, re-enables input
    - _Requirements: 6.2, 6.5, 6.6_
  - [x] 9.2 Write unit tests for `ModificationPanel`
    - Submit disabled when prompt is empty
    - Error message displayed inline on API failure
    - Input re-enabled after error
    - _Requirements: 6.5, 6.6_

- [x] 10. Extend `components/studio/GenerationOutput.tsx` for the modification loop
  - [x] 10.1 Add `initialBase64: string` and `initialMimeType: string` props; maintain `imageHistory: Array<{ base64: string; mimeType: string }>` in local state; display the latest image from history (base64 data URL) rather than the signed URL when history is non-empty
    - _Requirements: 6.1, 6.3, 6.4_
  - [x] 10.2 Render `ModificationPanel` below the image, wired to push new snapshots onto `imageHistory` via `onModified`
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 11. Wire `initialBase64`/`initialMimeType` from store through `StudioShell` to `GenerationOutput`
  - [x] 11.1 Add `outputBase64: string | null` and `outputMimeType: string | null` to `StudioState`; populate them from the `/api/generate` response in `startGeneration`
    - _Requirements: 6.1_
  - [x] 11.2 Pass `outputBase64` and `outputMimeType` as props to `GenerationOutput` in `StudioShell`
    - _Requirements: 6.1_

- [x] 12. Final checkpoint — Ensure all tests pass
  - All 41 tests across 7 files pass (vitest run 2026-04-07).

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Property tests use Vitest + fast-check; tag each with `// Feature: gemini-only-studio, Property N: title`
- `AIProviderSelector.tsx` can be deleted once step 1 is removed from `StudioShell`
- The `fashionPose` field flows: store → `buildPrompt` → `description` field in `/api/generate` body
- Modification history is in-memory only; never persisted to Supabase
