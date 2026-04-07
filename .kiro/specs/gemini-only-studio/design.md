# Design Document: Gemini-Only Studio Refactor

## Overview

This document describes the technical design for refactoring `applications/studio/` to use Gemini
as the sole inference provider, simplify the wizard from 6 to 5 steps, add a text-based
`FashionPoseSelector` step, and introduce a client-side iterative modification loop backed by a
new `POST /api/modify` route.

The changes are purely additive or subtractive — no database schema migrations are required. The
existing `/api/generate` route and Supabase persistence contract remain intact.

---

## Architecture

### Current state (6-step wizard, 3 providers)

```
Client (StudioShell)
  └─ step 1: AIProviderSelector  ← removed
  └─ step 2: ModeSelector
  └─ step 3: GarmentUploader
  └─ step 4: GarmentDescription
  └─ step 5: ModelPresetGrid
  └─ step 6: StyleQuality
       │
       ▼
POST /api/generate
  └─ PROVIDER_MAP { idm_vton → hf_spaces, gemini, fal_ai }
  └─ runInference(request, resolvedProvider)
       ├─ hf-spaces.ts
       ├─ fal.ts
       └─ gemini.ts
```

### Target state (5-step wizard, Gemini only)

```
Client (StudioShell)
  └─ step 1: ModeSelector
  └─ step 2: GarmentUploader
  └─ step 3: FashionPoseSelector  ← new (required)
  └─ step 4: GarmentDescription   (optional)
  └─ step 5: StyleQuality + ModelPresetGrid
       │
       ▼
POST /api/generate  (Gemini only, no provider map)
  └─ runGeminiVTON(request)

POST /api/modify    ← new (client-side loop, no DB writes)
  └─ runGeminiModify(imageBase64, mimeType, prompt)
```

### Modification loop (client-side)

```
GenerationOutput (extended)
  ├─ displays current image (base64 in memory)
  ├─ ModificationPanel
  │    └─ textarea + submit button
  └─ imageHistory: Array<{ base64, mimeType }>
       │  on submit
       ▼
  POST /api/modify
  { imageBase64, mimeType, modificationPrompt }
       │  on success
       ▼
  push new image to imageHistory, display latest
```

---

## Components and Interfaces

### Modified: `lib/generation-options.ts`

- `aiProviderSchema` becomes `z.literal('gemini')`
- `AIProvider` type becomes `'gemini'`
- `DEFAULT_OPTIONS.aiProvider` set to `'gemini'`
- `generateRequestSchema.aiProvider` becomes `z.literal('gemini').optional()`
- `buildPrompt` removes the `aiProvider !== 'gemini'` short-circuit branch; always builds the
  rich Gemini prompt
- New `fashionPose` field added to `generationOptionsSchema` and `GenerationOptions`
- `buildPrompt` inserts pose instruction between fit and scene instructions when `fashionPose` is
  non-empty

### Modified: `lib/inference/index.ts`

- Remove `InferenceProvider` union type (only `'gemini'` remains)
- Remove `switch` dispatch; call `runGeminiVTON` directly
- Delete `hf-spaces.ts` and `fal.ts` imports

### Deleted files

- `lib/inference/hf-spaces.ts`
- `lib/inference/fal.ts`
- `components/studio/AIProviderSelector.tsx`

### Modified: `stores/studio-store.ts`

- Remove `aiProvider` state field and `setAiProvider` action
- Add `fashionPose: string` (default `''`)
- Add `setFashionPose(pose: string)` action
- `TOTAL_STEPS` → `5`
- `startGeneration` removes `aiProvider` from the `buildPrompt` call; passes `fashionPose`
- `canProceed` for step 3 (FashionPoseSelector) requires `fashionPose !== ''`
- Generate button disabled when `fashionPose === ''`

### New: `components/studio/FashionPoseSelector.tsx`

Adapted from `ai-studio-base/components/FashionPoseSelector.tsx` using the studio's Tailwind/
shadcn design system (replaces the raw Tailwind classes from the base app).

Props:

```ts
interface FashionPoseSelectorProps {
  value: string
  onChange: (pose: string) => void
}
```

Pose categories (exact strings from base app):

| Category               | Poses   |
| ---------------------- | ------- |
| Back & Detail Shots    | 5 poses |
| Formal & Elegant       | 5 poses |
| Athletic & Activewear  | 5 poses |
| Casual & Relaxed       | 5 poses |
| Bohemian & Artisanal   | 5 poses |
| Dresses & Gowns        | 4 poses |
| Dynamic & Action Poses | 5 poses |

Accordion-style: one category open at a time. Selected pose highlighted with brand gold ring.

### Modified: `components/studio/StudioShell.tsx`

- Remove `AIProviderSelector` import and case 1
- Renumber steps: ModeSelector→1, GarmentUploader→2, FashionPoseSelector→3,
  GarmentDescription→4, StyleQuality+ModelPreset→5
- Remove `isGemini` flag (always true)
- `canProceed` step 3 → `!!store.fashionPose`
- Generate button disabled condition adds `!store.fashionPose`
- Step 3 header: no `optional` prop (required)

### Modified: `components/studio/GenerationOutput.tsx`

Extended to support the modification loop. New responsibilities:

- Accept `initialBase64` and `initialMimeType` props (from generate response) in addition to
  `outputPath` (for the signed URL display of the persisted image)
- Render `ModificationPanel` below the image
- Maintain `imageHistory: Array<{ base64: string; mimeType: string }>` in local state
- Display the latest image from history (or the signed URL for the initial generation)

### New: `components/studio/ModificationPanel.tsx`

```ts
interface ModificationPanelProps {
  currentImageBase64: string
  currentMimeType: string
  onModified: (base64: string, mimeType: string) => void
}
```

- Textarea (max 500 chars) for modification prompt
- Submit button disabled while loading or prompt is empty
- Calls `POST /api/modify`, shows loading spinner
- On error: displays error message inline, preserves current image

### New: `app/api/modify/route.ts`

```ts
// Request body schema
const modifyRequestSchema = z.object({
  imageBase64: z.string().min(1),
  mimeType: z.string().min(1),
  modificationPrompt: z.string().min(1).max(500),
})

// Response
{ imageBase64: string, mimeType: string }
```

Auth: same pattern as `/api/generate` — kiosk bypass or authenticated user required.

### Modified: `app/api/generate/route.ts`

- Remove `PROVIDER_MAP`
- Remove `aiProvider` from destructuring; always call `runGeminiVTON` directly
- Validate that if `aiProvider` is present in body it equals `'gemini'`; return 400 otherwise
- Return `outputBase64` and `outputMimeType` alongside `generationId` and `outputPath` so the
  client can seed the modification loop without a second round-trip

---

## Data Models

### `GenerationOptions` (updated)

```ts
{
  mode: 'single_item' | 'full_outfit'
  description: string // max 200
  backgroundColor: string
  quality: 'draft' | 'standard' | 'high'
  aiProvider: 'gemini' // literal, not user-settable
  fitStyle: 'standard' | 'loose' | 'oversized' | 'slim'
  artisticStyle: 'default' | 'cinematic' | 'ethereal' | 'minimalist' | 'street'
  presetModelId: string
  fashionPose: string // new — required non-empty for generation
}
```

### `GenerateRequest` (updated)

```ts
{
  garmentPath: string
  presetModelId: string
  sessionId?: string | null
  description?: string         // built by buildPrompt (includes pose)
  denoiseSteps?: number
  aiProvider?: 'gemini'        // optional; 400 if present and !== 'gemini'
}
```

### `ModifyRequest` (new)

```ts
{
  imageBase64: string // base64-encoded image data (no data: prefix)
  mimeType: string // e.g. 'image/png'
  modificationPrompt: string // max 500 chars
}
```

### `ModifyResponse` (new)

```ts
{
  imageBase64: string
  mimeType: string
}
```

### `GenerateResponse` (extended)

```ts
{
  generationId: string
  outputPath: string
  outputBase64: string // new — seeds modification loop
  outputMimeType: string // new
}
```

### In-memory modification history (client only)

```ts
type ImageSnapshot = { base64: string; mimeType: string }
// Stored in GenerationOutput local state; never persisted
imageHistory: ImageSnapshot[]
```

### `buildPrompt` pose insertion point

```
1. Isolate Garment
2. Place on Model
3. Define Garment Fit          ← existing
4. Pose Instruction            ← new (only when fashionPose !== '')
   "The model must be in the following pose: {fashionPose}."
5. Set the Scene / Background
6. Final Aesthetic
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a
system — essentially, a formal statement about what the system should do. Properties serve as the
bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Gemini-only provider enforcement

_For any_ generate request body where `aiProvider` is present and not equal to `'gemini'`, the
Generate API must return a 400 response and must not call Gemini or write to the database.

**Validates: Requirements 1.6**

### Property 2: Absent provider defaults to Gemini

_For any_ generate request body where `aiProvider` is absent, the Generate API must behave
identically to a request where `aiProvider` is `'gemini'`.

**Validates: Requirements 1.5**

### Property 3: Pose included in prompt when non-empty

_For any_ `GenerationOptions` where `fashionPose` is a non-empty string, the string returned by
`buildPrompt` must contain that exact `fashionPose` value.

**Validates: Requirements 4.1**

### Property 4: Pose omitted from prompt when empty

_For any_ `GenerationOptions` where `fashionPose` is an empty string, the string returned by
`buildPrompt` must not contain any pose instruction text.

**Validates: Requirements 4.3**

### Property 5: Pose ordering in prompt

_For any_ `GenerationOptions` with a non-empty `fashionPose`, the pose instruction must appear
after the fit instruction and before the scene/background instruction in the output of
`buildPrompt`.

**Validates: Requirements 4.2**

### Property 6: Modification loop does not write to DB

_For any_ call to `POST /api/modify` with valid inputs, the `generations` table row count must
remain unchanged before and after the call.

**Validates: Requirements 6.7, 7.7**

### Property 7: Modify API round-trip returns an image

_For any_ valid `ModifyRequest` (non-empty base64, valid mimeType, non-empty prompt ≤ 500 chars),
the Modify API must return a response containing a non-empty `imageBase64` field.

**Validates: Requirements 7.3**

### Property 8: Modify API rejects invalid requests

_For any_ `ModifyRequest` where any required field is missing or `modificationPrompt` exceeds 500
characters, the Modify API must return a 400 response.

**Validates: Requirements 7.4**

### Property 9: Wizard step count invariant

_For any_ render of `StudioShell`, the progress bar denominator and `TOTAL_STEPS` constant must
both equal 5.

**Validates: Requirements 2.1, 2.3, 8.4**

### Property 10: Generate button disabled without pose

_For any_ wizard state where `fashionPose` is an empty string, the Generate button must be
disabled regardless of the values of `garmentFile` and `selectedPresetId`.

**Validates: Requirements 3.5, 8.3**

---

## Error Handling

### `/api/generate`

| Condition                               | Response                                             |
| --------------------------------------- | ---------------------------------------------------- |
| `aiProvider` present and not `'gemini'` | 400 `{ error: 'Only gemini provider is supported' }` |
| Missing required fields                 | 400 with Zod issue details                           |
| Unauthenticated (non-kiosk)             | 401                                                  |
| DB insert failure                       | 500                                                  |
| Garment signed URL failure              | 500, generation marked `failed`                      |
| Preset not found                        | 404, generation marked `failed`                      |
| Gemini returns no image                 | 500, generation marked `failed`                      |
| Gemini refusal text                     | 500 with refusal message, generation marked `failed` |

### `/api/modify`

| Condition                        | Response                                          |
| -------------------------------- | ------------------------------------------------- |
| Missing/invalid fields           | 400 with descriptive message                      |
| `modificationPrompt` > 500 chars | 400                                               |
| Unauthenticated (non-kiosk)      | 401                                               |
| Gemini returns no image          | 500 `{ error: 'Gemini did not return an image' }` |
| Gemini refusal                   | 500 with refusal text                             |

### Client-side modification loop

- Error displayed inline below the modification input
- Current output image is preserved on error (not discarded)
- Input and submit button re-enabled after error so user can retry
- Loading state disables input and shows spinner on submit button

### Wizard navigation

- Back button disabled on step 1
- Next button disabled when `canProceed()` returns false (step 2: no garment, step 3: no pose,
  step 5: no preset)
- Generate button disabled when `garmentFile`, `selectedPresetId`, or `fashionPose` is falsy

---

## Testing Strategy

### Unit tests (Vitest)

Located in `applications/studio/__tests__/` or co-located `*.test.ts`.

Focus areas:

- `buildPrompt` — pose insertion, pose omission, ordering relative to fit/scene
- `generateRequestSchema` — accepts `'gemini'`, rejects other values, accepts absent field
- `modifyRequestSchema` — field validation, 500-char limit on prompt
- `FashionPoseSelector` — renders all 7 categories, fires `onChange` with correct `en` string,
  accordion open/close behaviour
- `StudioShell` — `canProceed` logic for each step, Generate button disabled states

### Property-based tests (Vitest + fast-check)

Each property test runs a minimum of 100 iterations.

Tag format: `// Feature: gemini-only-studio, Property {N}: {title}`

| Property | Test description                                                                              |
| -------- | --------------------------------------------------------------------------------------------- |
| P3       | Generate arbitrary non-empty `fashionPose` strings → `buildPrompt` output contains the string |
| P4       | `buildPrompt` with `fashionPose: ''` → output never contains pose instruction keyword         |
| P5       | Non-empty pose → pose substring index > fit substring index, fit index < scene index          |
| P7       | Arbitrary valid `ModifyRequest` shapes → schema parse succeeds, response has `imageBase64`    |
| P8       | Arbitrary strings > 500 chars as `modificationPrompt` → schema parse fails                    |
| P10      | Arbitrary store states with `fashionPose: ''` → `canProceed(3)` returns false                 |

### Integration / E2E (Playwright)

Located in `applications/studio/e2e/`.

Key scenarios:

- Full 5-step wizard flow: mode → garment upload → pose select → description → style → generate
- Verify step 3 Next button is disabled until a pose is selected
- Verify Generate button is disabled without pose
- Verify modification panel appears after generation completes
- Verify modification error preserves current image
- Verify `/api/modify` returns 400 for oversized prompt (API-level test)
- Verify `/api/generate` returns 400 for `aiProvider: 'idm_vton'`
