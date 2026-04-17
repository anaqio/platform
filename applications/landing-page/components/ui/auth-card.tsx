import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type AuthCardProps = {
  title: string
  description: string
  children: ReactNode
  className?: string
}

export function AuthCard({ title, description, children, className }: AuthCardProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <Card className="noise-overlay border-white/5">
        <CardHeader>
          <CardTitle className="font-display text-3xl font-bold">{title}</CardTitle>
          <CardDescription className="font-body">{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
