'use client'

import { Download, Maximize2, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { ImageModal } from './ImageModal'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/lib/supabase/client'


interface GenerationOutputProps {
  outputPath: string
  onReset: () => void
}

export function GenerationOutput({ outputPath, onReset }: GenerationOutputProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function getUrl() {
      const supabase = createClient()
      const { data } = await supabase.storage.from('outputs').createSignedUrl(outputPath, 600)
      if (data?.signedUrl) setSignedUrl(data.signedUrl)
      setLoading(false)
    }
    getUrl()
  }, [outputPath])

  if (loading) {
    return <Skeleton className="aspect-[3/4] w-full rounded-lg" />
  }

  if (!signedUrl) {
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
        <img src={signedUrl} alt="Generated try-on result" className="w-full object-contain" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
          <Maximize2 className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button asChild className="flex-1 gap-2">
          <a href={signedUrl} download="anaqio-tryon.webp">
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          New
        </Button>
      </div>
      {showModal && <ImageModal src={signedUrl} onClose={() => setShowModal(false)} />}
    </div>
  )
}
