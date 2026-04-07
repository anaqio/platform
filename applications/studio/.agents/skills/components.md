# skill: components

# load when: component creation · DRY · cva · Shadcn · TailAdmin · styling patterns

## COMPONENT CLASSIFICATION

```
Server Component (default, no annotation):
  - ModelPresetGrid        reads preset_models, static render
  - StudioPage (shell)     auth check, passes data to client children
  - AuthLayout             layout wrapper

Client Component ('use client'):
  - StudioShell            orchestrates full studio flow
  - GarmentUploader        drag-drop, FileReader, preview
  - GenerateButton         calls /api/generate, loading state
  - GenerationStatus       Realtime subscription
  - GenerationOutput       signed URL fetch, download
  - LoginForm / SignupForm  form state, supabase.auth calls
  - OAuthButton            signInWithOAuth
```

## cn() UTILITY (always use — never raw clsx or string concat)

```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage
<div className={cn('base-class', isActive && 'active-class', className)} />
```

## CVA — VARIANT COMPONENTS

```typescript
// For components with multiple variants
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'

const statusBadge = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      status: {
        pending:    'bg-muted text-muted-foreground',
        processing: 'bg-brand-blue/10 text-brand-blue',
        completed:  'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
        failed:     'bg-destructive/10 text-destructive',
      },
    },
    defaultVariants: { status: 'pending' },
  }
)

interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadge> {}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  return <span className={cn(statusBadge({ status }), className)} {...props} />
}
```

## GARMENT UPLOADER PATTERN

```typescript
// components/studio/GarmentUploader.tsx
'use client'
import { useCallback, useState } from 'react'
import { validateGarmentFile } from '@/lib/utils/upload'
import { cn } from '@/lib/utils/cn'

interface Props {
  onFileSelected: (file: File) => void
  disabled?: boolean
}

export function GarmentUploader({ onFileSelected, disabled }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback((file: File) => {
    const validation = validateGarmentFile(file)
    if (!validation.ok) { setError(validation.error); return }
    setError(null)
    setPreview(URL.createObjectURL(file))
    onFileSelected(file)
  }, [onFileSelected])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      className={cn(
        'relative flex min-h-64 cursor-pointer flex-col items-center justify-center',
        'rounded-xl border-2 border-dashed transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      {preview ? (
        // show preview image
      ) : (
        // show upload prompt
      )}
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="absolute inset-0 cursor-pointer opacity-0"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        disabled={disabled}
      />
    </div>
  )
}
```

## FILE VALIDATION UTILITY

```typescript
// lib/utils/upload.ts
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10
const MIN_DIMENSION = 256
const MAX_DIMENSION = 4096

type ValidationResult = { ok: true } | { ok: false; error: string }

export function validateGarmentFile(file: File): ValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Format non supporté. Utilisez JPG, PNG ou WebP.' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, error: `Fichier trop volumineux. Maximum ${MAX_SIZE_MB}MB.` }
  }
  return { ok: true }
}

export async function validateGarmentDimensions(file: File): Promise<ValidationResult> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        resolve({ ok: false, error: `Image trop petite. Minimum ${MIN_DIMENSION}px.` })
      } else if (img.width > MAX_DIMENSION || img.height > MAX_DIMENSION) {
        resolve({ ok: false, error: `Image trop grande. Maximum ${MAX_DIMENSION}px.` })
      } else {
        resolve({ ok: true })
      }
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ ok: false, error: 'Fichier image invalide.' })
    }
    img.src = url
  })
}
```

## MODEL PRESET GRID

```typescript
// components/studio/ModelPresetGrid.tsx — pure display, no 'use client'
import Image from 'next/image'
import { getPresetPublicUrl } from '@/lib/utils/storage'
import { cn } from '@/lib/utils/cn'
import type { Database } from '@/types/supabase'

type Preset = Database['public']['Tables']['preset_models']['Row']

interface Props {
  presets: Preset[]
  selectedId: string | null
  onSelect: (id: string) => void  // passed from Client parent
}

export function ModelPresetGrid({ presets, selectedId, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.id)}
          className={cn(
            'group relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all',
            selectedId === preset.id
              ? 'border-primary ring-2 ring-primary ring-offset-2'
              : 'border-transparent hover:border-primary/50'
          )}
        >
          <Image
            src={getPresetPublicUrl(preset.preview_path)}
            alt={preset.label}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 33vw, 20vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-2">
            <p className="text-xs font-medium text-white leading-tight">{preset.label}</p>
          </div>
        </button>
      ))}
    </div>
  )
}
```

## TAILADMIN INTEGRATION RULES

```
DO:
- Use TailAdmin's DefaultLayout, Sidebar, Header components as shell
- Override colors via CSS variables in globals.css @theme block
- Use TailAdmin card and table components for studio UI chrome

DON'T:
- Rebuild navigation from scratch
- Import TailAdmin CSS globally — use component imports only
- Modify TailAdmin source files — override via className prop or CSS vars
```

## SHADCN USAGE RULES

```
DO:
- Use Shadcn primitives: Button, Card, Dialog, Input, Label, Progress, Badge, Skeleton, Toast
- Pass className prop to override styles via cn()
- Use Shadcn Toast for generation status notifications

DON'T:
- Modify files in components/ui/ — they're generated by shadcn CLI
- Re-implement what Shadcn provides (dropdowns, dialogs, etc.)
- Use Shadcn Form (react-hook-form) for simple inputs — just controlled state
```

## GENERATION OUTPUT COMPONENT PATTERN

```typescript
// components/studio/GenerationOutput.tsx
'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  outputPath: string | null  // set when generation.status === 'completed'
}

export function GenerationOutput({ outputPath }: Props) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!outputPath) return
    const supabase = createClient()
    supabase.storage.from('outputs').createSignedUrl(outputPath, 3600)
      .then(({ data }) => { if (data) setSignedUrl(data.signedUrl) })
  }, [outputPath])

  if (!outputPath) return null

  if (!signedUrl) return <Skeleton className="aspect-[3/4] w-full rounded-xl" />

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl border">
        <Image src={signedUrl} alt="Résultat généré" fill className="object-contain" sizes="50vw" />
      </div>
      <Button asChild className="w-full">
        <a href={signedUrl} download={`anaqio-${Date.now()}.webp`}>
          Télécharger
        </a>
      </Button>
    </div>
  )
}
```
