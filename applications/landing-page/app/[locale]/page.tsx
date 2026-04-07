import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

import { Header } from '@/components/layout/Header';
import { NewLandingPage } from '@/components/sections/NewLandingPage';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('home.title', {
      defaultValue: 'ANAQIO — AI Fashion Studio | Visual Infrastructure',
    }),
    description: t('home.desc', {
      defaultValue:
        'ANAQIO is an AI-powered fashion studio for the Moroccan luxury market. Generate lookbooks, swap backgrounds, adjust lighting, and produce cinematic fashion videos.',
    }),
  };
}

export default async function HomePage() {
  return (
    <main id="main-content" className="relative">
      <Header />
      <NewLandingPage />
    </main>
  );
}
