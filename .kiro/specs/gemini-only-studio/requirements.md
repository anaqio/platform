# Requirements Document

## Introduction

Refactor the studio app (`applications/studio/`) to use Gemini as the sole inference provider,
simplify the wizard by removing the AI provider selection step, add a text-based fashion pose
selection step, and introduce a client-side iterative image modification loop that lets users
refine a generated result without creating additional database rows.

## Glossary

- **Studio**: The Next.js application at `applications/studio/`.
- **Wizard**: The multi-step UI flow in `StudioShell` that guides the user through generation options.
- **Gemini**: Google's multimodal generative AI model used for fashion try-on image generation.
- **Generation**: A single initial try-on request that is persisted to the `generations` table in Supabase.
- **Modification**: A follow-up refinement request applied to the current output image; purely client-side, not persisted.
- **Pose**: A text string describing the desired body position of the model in the generated image (e.g. "a confident walking pose").
- **Store**: The Zustand store (`studio-store.ts`) that holds wizard state and triggers generation.
- **Generate API**: The Next.js route at `/api/generate` that runs Gemini inference and saves the result to the database.
- **Modify API**: A new Next.js route at `/api/modify` that runs Gemini inference on an existing base64 image and returns a new base64 image without touching the database.
- **Output Image**: The base64-encoded image returned by Gemini after a generation or modification call.
- **AIProviderSelector**: The existing Step 1 component that lets users pick between IDM-VTON, Gemini, and fal.ai — to be removed.
- **FashionPoseSelector**: A new wizard step component that presents categorised pose options.

---

## Requirements

### Requirement 1: Gemini as the Only Inference Provider

**User Story:** As a developer, I want the studio app to support only Gemini, so that the codebase is simplified and all generation paths use a single, consistent provider.

#### Acceptance Criteria

1. THE Studio SHALL define `aiProvider` as a literal type with only the value `'gemini'`, removing `'idm_vton'` and `'fal_ai'` from `aiProviderSchema`.
2. THE Studio SHALL set `DEFAULT_OPTIONS.aiProvider` to `'gemini'`.
3. THE Generate_API SHALL route all inference requests to the Gemini provider without consulting a provider map or environment variable fallback.
4. THE Studio SHALL delete the `hf-spaces.ts` and `fal.ts` files from `lib/inference/`.
5. WHEN the `aiProvider` field is absent from a generate request body, THE Generate_API SHALL treat it as `'gemini'`.
6. IF a generate request body contains an `aiProvider` value other than `'gemini'`, THEN THE Generate_API SHALL return a 400 Bad Request response.

---

### Requirement 2: Remove AI Provider Selector Step

**User Story:** As a user, I want the wizard to skip the provider selection step, so that I can reach the generation options faster without making a choice that no longer exists.

#### Acceptance Criteria

1. THE Wizard SHALL contain exactly 5 steps after this change (down from 6).
2. THE Studio SHALL remove the `AIProviderSelector` component from the wizard step renderer.
3. THE Store SHALL set `TOTAL_STEPS` to `5`.
4. THE Store SHALL remove the `setAiProvider` action and the `aiProvider` state field, or hard-code `aiProvider` to `'gemini'` internally without exposing it as a user-settable option.
5. WHEN the user is on step 1 of the wizard, THE Wizard SHALL render the Mode Selector (previously step 2).

---

### Requirement 3: Fashion Pose Selection Step

**User Story:** As a user, I want to choose a pose for the model from a categorised list, so that the generated image reflects the body position I have in mind.

#### Acceptance Criteria

1. THE Wizard SHALL include a Pose Selector as one of its 5 steps, positioned after the Garment Upload step and before the Garment Description step.
2. THE FashionPoseSelector SHALL present poses grouped into the following categories: "Back & Detail Shots", "Formal & Elegant", "Athletic & Activewear", "Casual & Relaxed", "Bohemian & Artisanal", "Dresses & Gowns", and "Dynamic & Action Poses".
3. WHEN a user selects a pose, THE Store SHALL store the selected pose's English text string in a `fashionPose` field.
4. THE Store SHALL initialise `fashionPose` to an empty string.
5. WHEN the user has not selected a pose, THE Wizard SHALL prevent advancing past the Pose Selector step (the Next button SHALL be disabled).
6. THE FashionPoseSelector step SHALL be marked as required (not optional) in the step header.

---

### Requirement 4: Pose Value Integrated into Gemini Prompt

**User Story:** As a user, I want my selected pose to be reflected in the generated image, so that the model appears in the position I chose.

#### Acceptance Criteria

1. WHEN `fashionPose` is a non-empty string, THE `buildPrompt` function SHALL include the pose string in the generated Gemini prompt text.
2. THE `buildPrompt` function SHALL insert the pose instruction after the garment fit instruction and before the scene/background instruction.
3. WHEN `fashionPose` is an empty string, THE `buildPrompt` function SHALL omit the pose instruction from the prompt.
4. THE Generate_API SHALL pass the `fashionPose` value as part of the `description` field (via `buildPrompt`) to the Gemini inference call.

---

### Requirement 5: Initial Generation Persisted to Database

**User Story:** As a user, I want my first generation to be saved to my history, so that I can review past results.

#### Acceptance Criteria

1. WHEN the user triggers a generation from the final wizard step, THE Generate_API SHALL insert a row into the `generations` table with status `'pending'` before calling Gemini.
2. WHEN Gemini returns a successful result, THE Generate_API SHALL update the generation row to status `'completed'` and store the `output_path`.
3. WHEN Gemini returns an error, THE Generate_API SHALL update the generation row to status `'failed'` and store the `error_message`.
4. THE Generate_API SHALL return `{ generationId, outputPath }` to the client on success.
5. THE Generate_API SHALL upload the Gemini output image to Supabase Storage and store the resulting path in `output_path`.

---

### Requirement 6: Client-Side Iterative Modification Loop

**User Story:** As a user, I want to refine a generated image by submitting follow-up text prompts, so that I can iteratively improve the result without starting a new generation.

#### Acceptance Criteria

1. WHEN a generation completes and an output image is available, THE Studio SHALL display a modification prompt input field below the output image.
2. WHEN the user submits a modification prompt, THE Studio SHALL call the Modify_API with the current output image (as base64) and the modification prompt text.
3. WHEN the Modify_API returns a new image, THE Studio SHALL replace the currently displayed output image with the new image in memory (base64), without navigating away or resetting the wizard.
4. THE Studio SHALL maintain a history of output images in memory so the user can see the progression of modifications.
5. WHILE a modification is in progress, THE Studio SHALL disable the modification prompt input and display a loading indicator.
6. IF the Modify_API returns an error, THEN THE Studio SHALL display the error message below the modification input without discarding the current output image.
7. THE Studio SHALL NOT create a new `generations` database row for any modification call.
8. THE Studio SHALL NOT upload modification output images to Supabase Storage.

---

### Requirement 7: Modify API Endpoint

**User Story:** As a developer, I want a dedicated server-side route for iterative modifications, so that the Gemini API key is never exposed to the client and the modification logic is cleanly separated from the initial generation flow.

#### Acceptance Criteria

1. THE Modify_API SHALL be implemented at `POST /api/modify`.
2. THE Modify_API SHALL accept a JSON body with fields: `imageBase64` (string), `mimeType` (string), and `modificationPrompt` (string, max 500 characters).
3. WHEN all required fields are present and valid, THE Modify_API SHALL call Gemini with the provided image and modification prompt and return `{ imageBase64, mimeType }`.
4. IF any required field is missing or invalid, THEN THE Modify_API SHALL return a 400 Bad Request response with a descriptive error.
5. IF the authenticated user is absent and kiosk mode is disabled, THEN THE Modify_API SHALL return a 401 Unauthorized response.
6. IF Gemini does not return an image in its response, THEN THE Modify_API SHALL return a 500 response with a descriptive error message.
7. THE Modify_API SHALL NOT write to or read from the `generations` table.
8. THE Modify_API SHALL use the `GOOGLE_AI_API_KEY` environment variable for authentication with Gemini.

---

### Requirement 8: Wizard Step Ordering and Navigation

**User Story:** As a user, I want the wizard steps to flow logically after the refactor, so that I can complete the generation setup without confusion.

#### Acceptance Criteria

1. THE Wizard SHALL present steps in this order: (1) Mode Selector, (2) Garment Upload, (3) Pose Selector, (4) Garment Description (optional), (5) Style & Quality (optional) — with Model Preset selection integrated into step 5 or as a sub-section.
2. WHEN the user is on the final step, THE Wizard SHALL show a "Generate" button instead of a "Next" button.
3. THE Wizard SHALL disable the "Generate" button when `garmentFile` is null or `selectedPresetId` is null or `fashionPose` is an empty string.
4. THE Wizard progress bar SHALL reflect the updated 5-step total.
5. WHEN the user clicks "Back" on step 1, THE Wizard SHALL keep the Back button disabled.
