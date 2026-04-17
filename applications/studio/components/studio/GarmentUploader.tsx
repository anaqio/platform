'use client'

import { useCallback, useState } from 'react'
import { Upload, X } from 'lucide-react'

import { cn } from '@/lib/utils/cn'
import { validateGarmentFile } from '@/lib/utils/upload'
import { Button } from '@/components/ui/button'

interface GarmentUploaderProps {
  onFileSelect: (file: File) => void
  selectedFile: File | null
  onClear: () => void
}

export function GarmentUploader({ onFileSelect, selectedFile, onClear }: GarmentUploaderProps) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      setError(null)
      const validation = validateGarmentFile(file)
      if (!validation.valid) {
        setError(validation.error ?? 'Invalid file')
        return
      }
      const url = URL.createObjectURL(file)
      setPreview(url)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleClear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setError(null)
    onClear()
  }, [preview, onClear])

  if (selectedFile && preview) {
    return (
      <div className="border-border relative overflow-hidden rounded-lg border">
        <img
          src={preview}
          alt="Garment preview"
          className="bg-muted aspect-[3/4] w-full object-contain"
        />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
        <p className="text-muted-foreground truncate p-2 text-xs">{selectedFile.name}</p>
      </div>
    )
  }

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        )}
      >
        <Upload className="text-muted-foreground h-8 w-8" />
        <p className="text-muted-foreground text-sm">
          Drag & drop your garment image, or{' '}
          <span className="text-primary font-medium">browse</span>
        </p>
        <p className="text-muted-foreground text-xs">JPEG, PNG, WebP — max 10MB</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />
      </label>
      {error && <p className="text-destructive mt-2 text-sm">{error}</p>}
    </div>
  )
}
