import { defaultUrl, appConstants, appFounders, appSocials } from './constants'

export const orgLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: appConstants.name,
  url: defaultUrl,
  logo: `${defaultUrl}/logo.svg`,
  description:
    'Anaqio is an AI-powered virtual studio empowering fashion brands with cutting-edge digital tools for modern commerce.',
  sameAs: Object.values(appSocials),
  legalName: appConstants.name,
  founders: appFounders.map((founder) => ({
    '@type': 'Person',
    name: founder.name,
  })),
  foundingDate: appConstants.foundingDate,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${defaultUrl}/contact`,
      availableLanguage: ['en'],
      areaServed: 'MA',
    },
  ],
}

export const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: `${appConstants.name} AI Visual Studio`,
  operatingSystem: 'Web',
  applicationCategory: 'DesignApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'MAD',
  },
  author: {
    '@type': 'Organization',
    name: appConstants.name,
    url: defaultUrl,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '120',
  },
}

export const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: appConstants.name,
  url: defaultUrl,
  inLanguage: 'en',
  publisher: { '@type': 'Organization', name: appConstants.name },
}

export const webpageLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: appConstants.title,
  url: defaultUrl,
  isPartOf: { '@type': 'WebSite', url: defaultUrl },
  about: { '@type': 'Organization', name: appConstants.name },
  description: "Generate studio-quality fashion imagery instantly with Anaqio's AI Visual Studio.",
  inLanguage: 'en',
}
