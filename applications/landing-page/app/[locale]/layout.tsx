import { Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import type { Metadata, Viewport } from 'next';

import { GrainOverlay } from '@/components/ui/GrainOverlay';
import { HashScrollSuppressor } from '@/components/ui/HashScrollSuppressor';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { isRTL, locales, type Locale } from '@/i18n/config';
import {
  appConstants,
  appFonts,
  appFounders,
  appViewport,
  defaultUrl,
  orgLd,
  softwareLd,
  webpageLd,
  websiteLd,
} from '@/lib/app';
import '../globals.css';

const notoArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: false,
});

export const viewport: Viewport = appViewport;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta.home' });

  return {
    metadataBase: new URL(defaultUrl),
    title: t('title'),
    description: t('desc'),
    alternates: {
      canonical: defaultUrl,
    },
    openGraph: {
      title: t('title'),
      description: t('desc'),
      url: defaultUrl,
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
      title: t('title'),
      description: t('desc'),
      images: ['/twitter-image.png'],
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Structured data is trusted static JSON from lib/app — not user input
const structuredData = [
  { id: 'org-jsonld', data: orgLd },
  { id: 'software-jsonld', data: softwareLd },
  { id: 'website-jsonld', data: websiteLd },
  { id: 'webpage-jsonld', data: webpageLd },
];

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = isRTL(locale as Locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="ANAQIO" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        {/* Structured Data — trusted static JSON, not user input */}
        {structuredData.map(({ id, data }) => (
          <script
            key={id}
            id={id}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
          />
        ))}
      </head>
      <body
        className={`${appFonts.syne.variable} ${appFonts.jakartaSans.variable} ${appFonts.instrumentSerif.variable} ${notoArabic.variable} relative antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>

        <div
          className="sr-only"
          aria-hidden
          itemScope
          itemType="https://schema.org/Organization"
        >
          <meta itemProp="name" content={appConstants.name} />
          <meta itemProp="url" content={defaultUrl} />
          <meta itemProp="foundingDate" content={appConstants.foundingDate} />
          {appFounders.map((founder, i) => (
            <div
              key={i}
              itemProp="founder"
              itemScope
              itemType="https://schema.org/Person"
            >
              <meta itemProp="name" content={founder.name} />
              <meta itemProp="sameAs" content={founder.linkedin} />
            </div>
          ))}
          <div
            itemProp="contactPoint"
            itemScope
            itemType="https://schema.org/ContactPoint"
          >
            <meta itemProp="contactType" content="customer support" />
            <link itemProp="url" href={`${defaultUrl}/contact`} />
          </div>
        </div>

        <NextIntlClientProvider messages={messages}>
          <HashScrollSuppressor />
          <NavigationProgress />
          {children}
        </NextIntlClientProvider>
        <GrainOverlay />
      </body>
    </html>
  );
}
