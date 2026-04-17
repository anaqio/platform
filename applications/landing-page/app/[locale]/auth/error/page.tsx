import { AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

import type { Metadata } from 'next'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Authentication Error — Anaqio',
  robots: 'noindex, nofollow',
}

async function ErrorContent({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-widest text-destructive">
          Error Details
        </p>
        <p className="font-mono text-sm text-muted-foreground">
          {params?.error || 'unspecified_authentication_error'}
        </p>
      </div>
    </div>
  )
}

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  return (
    <Card className="noise-overlay border-white/5">
      <CardHeader>
        <CardTitle className="font-display text-3xl font-bold tracking-tight">
          System Error
        </CardTitle>
        <CardDescription className="pt-2 font-body">
          An issue occurred during authentication.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Suspense fallback={<div className="h-20 animate-pulse rounded-xl bg-secondary/20" />}>
          <ErrorContent searchParams={searchParams} />
        </Suspense>
        <p className="font-body text-sm leading-relaxed text-muted-foreground">
          Please try signing in again or contact our support team if the problem persists.
        </p>
      </CardContent>
    </Card>
  )
}
