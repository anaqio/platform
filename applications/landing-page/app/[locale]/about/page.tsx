// dangerouslySetInnerHTML is safe here — jsonLd is built from static strings and trusted env vars only, never from user input.
import { getTranslations } from 'next-intl/server'

import AboutContent from './about-content'

import type { Metadata } from 'next'

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'https://anaqio.com'
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  const baseUrl = getBaseUrl()

  return {
    metadataBase: new URL(baseUrl),
    title: t('about.title'),
    description: t('about.desc'),
    alternates: {
      canonical: `${baseUrl}/about`,
    },
    openGraph: {
      title: t('about.title'),
      description: t('about.desc'),
      url: `${baseUrl}/about`,
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
      title: t('about.title'),
      description: t('about.desc'),
      images: ['/twitter-image.png'],
    },
  }
}

const founders = [{ name: 'Amal AIT OUKHARAZ' }, { name: 'Mohamed MOUGHAMIR' }]

export default function AboutPage() {
  const baseUrl = getBaseUrl()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Anaqio',
    url: `${baseUrl}/about`,
    description: 'Anaqio is an AI-powered visual studio for fashion commerce, built in Casablanca.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Anaqio',
      url: baseUrl,
      foundingDate: '2026-02',
      foundingLocation: { '@type': 'Place', name: 'Casablanca, Morocco' },
      founders: founders.map((f) => ({ '@type': 'Person', name: f.name })),
    },
  }

  return (
    <main id="main-content" className="relative text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutContent />
    </main>
  )
}
