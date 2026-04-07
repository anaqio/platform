import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

import { ForgotPasswordForm } from '@/components/forgot-password-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.forgot' });
  return { title: t('title'), robots: 'noindex, nofollow' };
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
