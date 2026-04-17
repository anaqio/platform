import { defaultUrl, appConstants, appSocials } from './constants'

import type { Metadata, Viewport } from 'next/types'

export const appMeta: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: appConstants.title,
    template: appConstants.titleTemplate,
  },
  description: appConstants.description,
  keywords: appConstants.keywords,
  authors: appConstants.authors,
  creator: appConstants.creator,
  publisher: appConstants.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: appConstants.title,
    description: appConstants.descriptionShort,
    url: defaultUrl,
    siteName: appConstants.name,
    locale: 'en_US',
    alternateLocale: ['ar_MA'],
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: appConstants.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appConstants.title,
    description: appConstants.twitterDescription,
    images: ['/twitter-image.png'],
    creator: appSocials.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: appConstants.name,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
}

export const appViewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
    { media: '(prefers-color-scheme: light)', color: '#3F57AF' },
  ],
}
