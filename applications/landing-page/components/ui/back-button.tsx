'use client'

import { ArrowLeft } from 'lucide-react'

import { Button } from '@anaqio/ui'
import { useRouter } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  className?: string
  label?: string
}

export function BackButton({ className, label = 'Back' }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'group -ml-3 mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground',
        className
      )}
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </Button>
  )
}
