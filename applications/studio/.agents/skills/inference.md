# skill: inference

# load when: HF Spaces · IDM-VTON · Gradio · fal.ai · generation pipeline · /api/generate

## CURRENT PROVIDER: HuggingFace Spaces (IDM-VTON)

## FUTURE PROVIDER: fal.ai (upgrade when payment available)

## MIGRATION COST: only lib/inference/hf-spaces.ts changes — all callers stay the same

---

## PROVIDER ABSTRACTION

```typescript
// lib/inference/types.ts
export interface InferenceRequest {
  garmentUrl: string // signed Supabase Storage URL, TTL ≥ 5min
  presetModelId: string // slug from preset_models table
  description?: string // optional garment description
  seed?: number // for reproducible results
}

export interface InferenceResult {
  outputUrl: string // URL of generated image (HF temporary or fal.ai CDN)
  inferenceMs?: number // latency tracking
}

// All callers import from types.ts — never import hf-spaces.ts directly
export type InferenceProvider = 'hf_spaces' | 'fal_ai'
```

```typescript
// lib/inference/index.ts — provider router
import type { InferenceRequest, InferenceResult } from './types'

export async function runInference(request: InferenceRequest): Promise<InferenceResult> {
  const provider = process.env.INFERENCE_PROVIDER ?? 'hf_spaces'
  if (provider === 'fal_ai') {
    const { runFalVTON } = await import('./fal')
    return runFalVTON(request)
  }
  const { runVTON } = await import('./hf-spaces')
  return runVTON(request)
}
```

---

## HF SPACES IMPLEMENTATION (active)

```typescript
// lib/inference/hf-spaces.ts
// @gradio/client — install: npm install @gradio/client
import type { InferenceRequest, InferenceResult } from './types'

export async function runVTON(request: InferenceRequest): Promise<InferenceResult> {
  const { Client } = await import('@gradio/client')

  const client = await Client.connect(process.env.HF_SPACE_URL!, {
    hf_token: process.env.HF_API_TOKEN as `hf_${string}`,
  })

  const start = Date.now()

  const result = await client.predict('/tryon', {
    dict: {
      background: request.garmentUrl,
      layers: [],
      composite: null,
    },
    garm_img: request.garmentUrl,
    garment_des: request.description ?? '',
    is_checked: true,
    is_checked_crop: false,
    denoise_steps: 30,
    seed: request.seed ?? 42,
  })

  const outputData = (result.data as Array<{ url: string }>)[0]
  if (!outputData?.url) throw new Error('[hf-spaces] No output URL in response')

  return {
    outputUrl: outputData.url,
    inferenceMs: Date.now() - start,
  }
}
```

---

## FAL.AI STUB (implement post-expo)

```typescript
// lib/inference/fal.ts — stub, wire up when FAL_API_KEY available
import type { InferenceRequest, InferenceResult } from './types'

export async function runFalVTON(_request: InferenceRequest): Promise<InferenceResult> {
  throw new Error('[fal] Not yet implemented. Set INFERENCE_PROVIDER=hf_spaces.')
  // Future implementation:
  // import * as fal from '@fal-ai/client'
  // fal.config({ credentials: process.env.FAL_API_KEY })
  // const result = await fal.subscribe('fal-ai/idm-vton', { input: { ... } })
  // return { outputUrl: result.data.images[0].url, inferenceMs: ... }
}
```

---

## /api/generate ROUTE — FULL FLOW

```typescript
// app/api/generate/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { runInference } from '@/lib/inference'
import { createClient as createAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { getSignedUrl } from '@/lib/utils/storage'

export async function POST(request: NextRequest) {
  // 1. Auth check
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isKiosk = process.env.NEXT_PUBLIC_KIOSK_MODE === 'true'
  if (!isKiosk && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Validate input
  const { garmentPath, presetModelId, sessionId } = await request.json()
  if (!garmentPath || !presetModelId) {
    return NextResponse.json({ error: 'garmentPath and presetModelId required' }, { status: 400 })
  }

  const admin = createAdmin()

  // 3. Create pending row — return ID immediately
  const { data: gen, error: insertErr } = await admin
    .from('generations')
    .insert({
      user_id: user?.id ?? null,
      session_id: sessionId ?? null,
      status: 'pending',
      garment_path: garmentPath,
      preset_model_id: presetModelId,
      inference_provider: (process.env.INFERENCE_PROVIDER ?? 'hf_spaces') as 'hf_spaces' | 'fal_ai',
    })
    .select('id')
    .single()

  if (insertErr || !gen) {
    return NextResponse.json({ error: 'Failed to create generation record' }, { status: 500 })
  }

  // 4. Set processing (Realtime notifies client)
  await admin.from('generations').update({ status: 'processing' }).eq('id', gen.id)

  // 5. Get signed garment URL for inference provider
  let garmentUrl: string
  try {
    garmentUrl = await getSignedUrl('garments', garmentPath, 300)
  } catch (e) {
    await admin
      .from('generations')
      .update({
        status: 'failed',
        error_message: 'Cannot read garment from storage',
      })
      .eq('id', gen.id)
    return NextResponse.json({ error: 'Storage error' }, { status: 500 })
  }

  // 6. Run inference (slow: ~30-60s on HF Spaces)
  try {
    const result = await runInference({ garmentUrl, presetModelId })

    // 7. Download output and upload to Supabase Storage
    const outputBlob = await fetch(result.outputUrl).then((r) => r.blob())
    const outputPath = `${user?.id ?? sessionId ?? 'anon'}/${gen.id}.webp`
    await admin.storage.from('outputs').upload(outputPath, outputBlob, {
      contentType: 'image/webp',
      upsert: false,
    })

    // 8. Mark completed — Realtime notifies client
    await admin
      .from('generations')
      .update({
        status: 'completed',
        output_path: outputPath,
        inference_ms: result.inferenceMs ?? null,
      })
      .eq('id', gen.id)

    return NextResponse.json({ generationId: gen.id })
  } catch (err) {
    await admin
      .from('generations')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Inference failed',
      })
      .eq('id', gen.id)
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}
```

---

## PERFORMANCE NOTES

| Provider               | Latency | Cost              | Status       |
| ---------------------- | ------- | ----------------- | ------------ |
| HF Spaces (shared GPU) | 30–90s  | Free (queue wait) | Active       |
| HF Spaces (dedicated)  | 15–30s  | ~$50/mo           | Upgrade path |
| fal.ai IDM-VTON        | 10–20s  | Pay-per-call      | Post-payment |

**UX implication:** Generation takes 30–90s. Client must show:

1. "Téléchargement..." (upload: ~2s)
2. "Traitement en cours..." (processing: 30–90s, Realtime-driven)
3. Progress indicator — not a spinner (users abandon spinners after 20s)
4. Estimated wait time: "~45 secondes"

---

## TIMEOUT HANDLING

Vercel function timeout: 60s (Pro), 300s (Enterprise).
HF Spaces can exceed 60s on shared GPU.

Mitigation for Vercel Pro (default):

```typescript
// In route.ts — respond immediately with generationId,
// run inference in background via Vercel Cron or Edge background
// OR upgrade to Vercel Enterprise for 300s timeout
// OR use Supabase Edge Function (no timeout) as inference caller

// Quick fix for demo: increase timeout in vercel.json
```

```json
// vercel.json
{
  "functions": {
    "app/api/generate/route.ts": {
      "maxDuration": 300
    }
  }
}
```
