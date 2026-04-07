// dangerouslySetInnerHTML is safe here — contactLd is built from static strings and trusted env vars only, never from user input.
import { getTranslations } from 'next-intl/server';

import type { Metadata } from 'next';

import { Link } from '@/i18n/routing';

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://anaqio.com';
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const baseUrl = getBaseUrl();

  return {
    title: t('contact.title'),
    description: t('contact.desc'),
    alternates: {
      canonical: `${baseUrl}/contact`,
    },
    openGraph: {
      title: t('contact.title'),
      description: t('contact.desc'),
      url: `${baseUrl}/contact`,
      siteName: 'Anaqio',
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'Anaqio',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('contact.title'),
      description: t('contact.desc'),
      images: ['/twitter-image.png'],
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const tSocial = await getTranslations({ locale, namespace: 'social' });
  const baseUrl = getBaseUrl();

  const contactLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Anaqio',
    url: `${baseUrl}/contact`,
    mainEntity: { '@type': 'Organization', name: 'Anaqio', url: baseUrl },
    potentialAction: {
      '@type': 'ContactAction',
      target: `${baseUrl}/contact`,
    },
  };

  return (
    <main
      id="main-content"
      className="relative mx-auto max-w-3xl px-4 py-16 text-foreground"
    >
      <script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />

      {/* Microdata duplication for broader parsing */}
      <div
        className="sr-only"
        aria-hidden
        itemScope
        itemType="https://schema.org/ContactPage"
      >
        <meta itemProp="name" content="Contact Anaqio" />
        <link itemProp="url" href={`${baseUrl}/contact`} />
      </div>

      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        {t('title')}
      </h1>
      <p className="mt-3 max-w-prose text-muted-foreground">
        {t('desc')} {t('waitlistNote')}{' '}
        <Link href="/early-access" className="underline underline-offset-4">
          {t('waitlistLink')}
        </Link>
        .
      </p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-semibold">
          {t('section.heading')}
        </h2>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            {t('labels.website')}:{' '}
            <Link href="/" className="underline">
              anaqio.com
            </Link>
          </li>
          <li>
            {t('labels.social')}:{' '}
            <a
              href="https://twitter.com/anaqio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {tSocial('twitter')}
            </a>{' '}
            ·{' '}
            <a
              href="https://www.linkedin.com/company/anaqio"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {tSocial('linkedin')}
            </a>
          </li>
        </ul>

        {/* Placeholder form (wire backend when ready) */}
        <form className="mt-6 grid grid-cols-1 gap-4" aria-disabled>
          <label className="grid gap-2">
            <span className="text-sm">{t('form.name.label')}</span>
            <input
              type="text"
              className="rounded-md border border-border bg-background px-3 py-2"
              placeholder={t('form.name.placeholder')}
              disabled
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">{t('form.email.label')}</span>
            <input
              type="email"
              className="rounded-md border border-border bg-background px-3 py-2"
              placeholder={t('form.email.placeholder')}
              disabled
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm">{t('form.message.label')}</span>
            <textarea
              className="min-h-32 rounded-md border border-border bg-background px-3 py-2"
              placeholder={t('form.message.placeholder')}
              disabled
            />
          </label>
          <button
            type="button"
            className="cursor-not-allowed rounded-md bg-aq-blue/30 px-4 py-2 text-white"
            disabled
          >
            {t('form.submit')}
          </button>
          <p className="text-xs text-muted-foreground">{t('form.note')}</p>
        </form>
      </section>
    </main>
  );
}
