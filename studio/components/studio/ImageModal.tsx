'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ImageModalProps {
  src: string
  onClose: () => void
}

export function ImageModal({ src, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="relative max-h-full max-w-full" onClick={(e) => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Fullscreen view"
          className="block max-h-[90vh] max-w-full rounded-lg object-contain shadow-2xl"
        />
        <button
          onClick={onClose}
          className="bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground absolute -top-3 -right-3 rounded-full p-1.5 transition-all duration-200 active:scale-90"
          aria-label="Close image viewer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
