import { getTranslations } from 'next-intl/server'

import type { Metadata } from 'next'

import { SignUpForm } from '@/components/sign-up-form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.signup' })
  return { title: t('title'), robots: 'noindex, nofollow' }
}

export default function SignUpPage() {
  return <SignUpForm />
}
