'use client'

import { Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface GenerateButtonProps {
  disabled: boolean
  loading: boolean
  onClick: () => void
}

export function GenerateButton({ disabled, loading, onClick }: GenerateButtonProps) {
  return (
    <Button size="lg" className="w-full gap-2" disabled={disabled || loading} onClick={onClick}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Try-On
        </>
      )}
    </Button>
  )
}
