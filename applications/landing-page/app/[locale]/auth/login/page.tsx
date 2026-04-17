import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { LoginForm } from '@/components/login-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.login' })
  return { title: t('title'), robots: 'noindex, nofollow' }
}

export default function LoginPage() {
  return <LoginForm />
}
