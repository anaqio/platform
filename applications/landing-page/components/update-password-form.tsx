'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { AuthCard } from '@/components/ui/auth-card'
import { AuthField } from '@/components/ui/auth-field'
import { Button } from '@anaqio/ui'
import { useRouter } from '@/i18n/routing'
import { ERROR_MESSAGES } from '@/lib/constants/errors'
import { createClient } from '@/lib/supabase/client'

export function UpdatePasswordForm({ className }: React.ComponentPropsWithoutRef<'div'>) {
  const t = useTranslations('auth.update')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      router.push('/protected')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : ERROR_MESSAGES.AUTH)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title={t('title')} description={t('desc')} className={className}>
      <form onSubmit={handleForgotPassword}>
        <div className="relative z-10 flex flex-col gap-6">
          <AuthField
            id="password"
            label={t('password.label')}
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={setPassword}
          />
          {error && <p className="text-xs font-medium text-destructive">{error}</p>}
          <Button type="submit" variant="brand" className="h-11 w-full" disabled={isLoading}>
            {isLoading ? t('submitPending') : t('submit')}
          </Button>
        </div>
      </form>
    </AuthCard>
  )
}
