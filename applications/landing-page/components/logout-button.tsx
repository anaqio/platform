'use client'

import { useTranslations } from 'next-intl'

import { Button } from '@anaqio/ui'
import { useRouter } from '@/i18n/routing'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const t = useTranslations('auth.button')
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>{t('logout')}</Button>
}
