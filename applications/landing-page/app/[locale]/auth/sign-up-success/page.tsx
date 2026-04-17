import type { Metadata } from 'next'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Registration Successful — Anaqio',
  robots: 'noindex, nofollow',
}

export default function SignUpSuccessPage() {
  return (
    <Card className="noise-overlay border-white/5">
      <CardHeader>
        <CardTitle className="text-brand-gradient font-display text-3xl font-bold tracking-tight">
          Registration Success
        </CardTitle>
        <CardDescription className="pt-2 font-body">Check your email to confirm</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-body text-sm leading-relaxed text-muted-foreground">
          You&apos;ve successfully joined the anaqio studio. We&apos;ve sent a verification link to
          your inbox. Please confirm your email to activate your account.
        </p>
      </CardContent>
    </Card>
  )
}
