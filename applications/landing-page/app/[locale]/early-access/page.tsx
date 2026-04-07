import { getTranslations } from 'next-intl/server';

import { EarlyAccessContent } from './early-access-content';

import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'earlyAccess.meta' });

  return {
    title: t('title'),
    description: t('desc'),
  };
}

export default function EarlyAccessPage() {
  return <EarlyAccessContent />;
}
