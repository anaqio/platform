'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthCard } from '@/components/ui/auth-card'
import { AuthField } from '@/components/ui/auth-field'
import { Button } from '@anaqio/ui'
import { Link, useRouter } from '@/i18n/routing'
import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/client'

export function SignUpForm({ className }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('auth.signup')
  const tLogin = useTranslations('auth.login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.AUTH)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title={t('title')} description={t('desc')} className={className}>
      <form onSubmit={handleSignUp}>
        <div className="relative z-10 flex flex-col gap-6">
          <AuthField
            id="email"
            label={tLogin('email.label')}
            type="email"
            placeholder={tLogin('email.placeholder')}
            required
            value={email}
            onChange={setEmail}
          />
          <AuthField
            id="password"
            label={tLogin('password.label')}
            type="password"
            required
            value={password}
            onChange={setPassword}
          />
          <AuthField
            id="repeat-password"
            label={t('passwordRepeat')}
            type="password"
            required
            value={repeatPassword}
            onChange={setRepeatPassword}
          />
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          <Button type="submit" variant="brand" className="h-11 w-full" disabled={isLoading}>
            {isLoading ? t('submitPending') : t('submit')}
          </Button>
        </div>
        <div className="mt-6 text-center font-body text-sm text-muted-foreground">
          {t('loginIntro')}{' '}
          <Link
            href="/auth/login"
            className="font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-aq-blue"
          >
            {t('loginLink')}
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
