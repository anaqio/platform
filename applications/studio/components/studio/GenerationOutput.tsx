'use client'

import { useEffect, useState } from 'react'
import { Button, Skeleton } from '@anaqio/ui'
import { Download, Maximize2, RotateCcw } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'

import { ImageModal } from './ImageModal'
import { ModificationPanel } from './ModificationPanel'

interface ImageSnapshot {
  base64: string
  mimeType: string
}

interface GenerationOutputProps {
  outputPath: string
  onReset: () => void
  initialBase64?: string
  initialMimeType?: string
}

export function GenerationOutput({
  outputPath,
  onReset,
  initialBase64 = '',
  initialMimeType = '',
}: GenerationOutputProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [imageHistory, setImageHistory] = useState<ImageSnapshot[]>(() =>
    initialBase64 ? [{ base64: initialBase64, mimeType: initialMimeType }] : []
  )

  useEffect(() => {
    async function getUrl() {
      const supabase = createClient()
      const { data } = await supabase.storage.from('outputs').createSignedUrl(outputPath, 600)
      if (data?.signedUrl) setSignedUrl(data.signedUrl)
      setLoading(false)
    }
    getUrl()
  }, [outputPath])

  const latestSnapshot = imageHistory.length > 0 ? imageHistory[imageHistory.length - 1] : null
  const displaySrc = latestSnapshot
    ? `data:${latestSnapshot.mimeType};base64,${latestSnapshot.base64}`
    : signedUrl

  function handleModified(base64: string, mimeType: string) {
    setImageHistory((prev) => [...prev, { base64, mimeType }])
  }

  if (loading) {
    return <Skeleton className="aspect-3/4 w-full rounded-lg" />
  }

  if (!displaySrc) {
    return (
      <div className="py-8 text-center">
        <p className="text-destructive text-sm">Could not load output image</p>
        <Button variant="outline" size="sm" className="mt-2" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className="border-border group relative cursor-pointer overflow-hidden rounded-lg border"
        onClick={() => setShowModal(true)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={displaySrc} alt="Generated try-on result" className="w-full object-contain" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <Maximize2 className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild className="flex-1 gap-2">
          <a href={displaySrc} download="anaqio-tryon.webp">
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New
        </Button>
      </div>
      {latestSnapshot && (
        <ModificationPanel
          currentImageBase64={latestSnapshot.base64}
          currentMimeType={latestSnapshot.mimeType}
          onModified={handleModified}
        />
      )}
      {showModal && <ImageModal src={displaySrc} onClose={() => setShowModal(false)} />}
    </div>
  )
}
