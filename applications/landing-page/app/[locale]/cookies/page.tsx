import { getTranslations } from 'next-intl/server'

import { CookiePolicyContent } from './cookies-content'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta.cookies' })
  return { title: t('title'), description: t('desc') }
}

export default function CookiePolicyPage() {
  return <CookiePolicyContent />
}
