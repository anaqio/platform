import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

import { UpdatePasswordForm } from '@/components/update-password-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.update' });
  return { title: t('title'), robots: 'noindex, nofollow' };
}

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
