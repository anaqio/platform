# skill: testing

# load when: Vitest · unit tests · Playwright · E2E · TDD · coverage

## SCOPE (pre-freeze priority — surgical only)

```
MUST test (before March 28):
  ✓ validateGarmentFile() — file validation util
  ✓ useGeneration hook — state machine transitions
  ✓ generations insert helper — server-side logging
  ✓ Playwright critical path — upload → select → generate → download

DO NOT add (post-expo backlog):
  ✗ UI snapshot tests
  ✗ Visual regression
  ✗ Full auth flow E2E
  ✗ Component rendering tests
```

## VITEST SETUP

```typescript
// vitest.config.ts
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, functions: 80 },
      include: ['lib/utils/**', 'hooks/**', 'lib/inference/**'],
      exclude: ['lib/supabase/**', '**/*.test.ts', 'types/**'],
    },
  },
})
```

```typescript
// vitest.setup.ts
import '@testing-library/jest-dom'

// Mock Supabase client globally
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(),
    storage: { from: vi.fn() },
    channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })),
    removeChannel: vi.fn(),
  })),
}))
```

## UNIT TESTS — FILE VALIDATION

```typescript
// lib/utils/__tests__/upload.test.ts
import { describe, expect, it } from 'vitest'

import { validateGarmentFile } from '../upload'

const makeFile = (type: string, sizeMB: number) =>
  new File(['x'.repeat(sizeMB * 1024 * 1024)], 'test.jpg', { type })

describe('validateGarmentFile', () => {
  it('accepts valid JPEG under 10MB', () => {
    expect(validateGarmentFile(makeFile('image/jpeg', 5))).toEqual({ ok: true })
  })
  it('accepts WebP', () => {
    expect(validateGarmentFile(makeFile('image/webp', 1))).toEqual({ ok: true })
  })
  it('rejects PDF', () => {
    const r = validateGarmentFile(makeFile('application/pdf', 1))
    expect(r.ok).toBe(false)
    expect((r as { ok: false; error: string }).error).toMatch(/format/i)
  })
  it('rejects file over 10MB', () => {
    const r = validateGarmentFile(makeFile('image/jpeg', 11))
    expect(r.ok).toBe(false)
    expect((r as { ok: false; error: string }).error).toMatch(/10MB/i)
  })
})
```

## UNIT TESTS — GENERATION STATE MACHINE

```typescript
// hooks/__tests__/useGeneration.test.ts
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock fetch
global.fetch = vi.fn()

describe('useGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts in idle state', async () => {
    const { useGeneration } = await import('../useGeneration')
    const { result } = renderHook(() => useGeneration())
    expect(result.current.state).toBe('idle')
    expect(result.current.generationId).toBeNull()
  })

  it('transitions idle → uploading → generating on startGeneration', async () => {
    const { useGeneration } = await import('../useGeneration')
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: () => ({ garmentPath: 'path/to/garment.webp' }),
      } as Response)
      .mockResolvedValueOnce({ ok: true, json: () => ({ generationId: 'gen-123' }) } as Response)

    const { result } = renderHook(() => useGeneration())
    const file = new File([''], 'garment.jpg', { type: 'image/jpeg' })

    await act(async () => {
      await result.current.startGeneration(file, 'f-01-moderne')
    })

    expect(result.current.state).toBe('generating')
    expect(result.current.generationId).toBe('gen-123')
  })

  it('transitions to error state on upload failure', async () => {
    const { useGeneration } = await import('../useGeneration')
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response)

    const { result } = renderHook(() => useGeneration())
    const file = new File([''], 'garment.jpg', { type: 'image/jpeg' })

    await act(async () => {
      await result.current.startGeneration(file, 'f-01-moderne')
    })

    expect(result.current.state).toBe('error')
    expect(result.current.errorMessage).toMatch(/upload/i)
  })

  it('reset() returns to idle', async () => {
    const { useGeneration } = await import('../useGeneration')
    const { result } = renderHook(() => useGeneration())

    act(() => {
      result.current.reset()
    })
    expect(result.current.state).toBe('idle')
    expect(result.current.generationId).toBeNull()
  })
})
```

## PLAYWRIGHT — CRITICAL PATH E2E

```typescript
// e2e/studio-flow.spec.ts
import path from 'path'
import { expect, test } from '@playwright/test'

const TEST_GARMENT = path.join(__dirname, 'fixtures/test-garment.jpg')

test.describe('Studio — Critical Path', () => {
  test.beforeEach(async ({ page }) => {
    // Use kiosk mode to skip auth in tests
    await page.goto('http://localhost:3000/studio?kiosk=true')
  })

  test('complete generation flow', async ({ page }) => {
    // 1. Upload garment
    const uploader = page.locator('[data-testid="garment-uploader"] input[type="file"]')
    await uploader.setInputFiles(TEST_GARMENT)
    await expect(page.locator('[data-testid="garment-preview"]')).toBeVisible()

    // 2. Select preset model
    await page.locator('[data-testid="preset-model-f-01-moderne"]').click()
    await expect(page.locator('[data-testid="preset-model-f-01-moderne"]')).toHaveAttribute(
      'aria-selected',
      'true',
    )

    // 3. Click generate — verify loading state
    await page.locator('[data-testid="generate-button"]').click()
    await expect(page.locator('[data-testid="generation-status"]')).toBeVisible()
    await expect(page.locator('[data-testid="generation-status"]')).toContainText('Génération')

    // 4. Wait for completion (long timeout — HF Spaces is slow)
    await expect(page.locator('[data-testid="generation-output"]')).toBeVisible({
      timeout: 120_000,
    })

    // 5. Download button enabled
    await expect(page.locator('[data-testid="download-button"]')).toBeEnabled()
  })

  test('shows error on invalid file type', async ({ page }) => {
    const uploader = page.locator('[data-testid="garment-uploader"] input[type="file"]')
    await uploader.setInputFiles({
      name: 'doc.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from(''),
    })
    await expect(page.locator('[data-testid="upload-error"]')).toContainText('format')
  })
})
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 180_000, // 3min — HF Spaces inference
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } }, // Morocco is mobile-first
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

## DATA-TESTID CONVENTION

```
garment-uploader          → GarmentUploader root div
garment-preview           → preview image after upload
preset-model-{id}         → each preset model button
generate-button           → GenerateButton
generation-status         → GenerationStatus component
generation-output         → GenerationOutput component
download-button           → download anchor
upload-error              → error message in uploader
```

## RUN COMMANDS

```bash
# Unit tests
npm run test                    # vitest run
npm run test:watch              # vitest --watch
npm run test:coverage           # vitest --coverage

# E2E
npm run test:e2e                # playwright test
npm run test:e2e:ui             # playwright test --ui
npm run test:e2e:headed         # playwright test --headed

# Add to package.json scripts
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```
