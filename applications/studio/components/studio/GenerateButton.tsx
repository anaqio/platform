'use client'

import { Button } from '@anaqio/ui'
import { Loader2, Sparkles } from 'lucide-react'

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
