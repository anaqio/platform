import { cookies } from 'next/headers'

import { BrandIdentityContent } from './brand-content'
import { BrandGate } from './brand-gate'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Brand Identity Guidelines — Anaqio',
  description:
    'Official Brand Identity Guidelines for Anaqio — logos, typography, colors, and usage. Publicly available brand assets.',
  robots: {
    index: true,
    follow: true,
  },
}

export default async function BrandIdentityPage() {
  const cookieStore = await cookies()
  const isAuthorized = cookieStore.get('brand_authorized')?.value === 'true'

  if (!isAuthorized) {
    return <BrandGate />
  }

  return <BrandIdentityContent />
}
