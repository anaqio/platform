import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  // Strip console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  reactCompiler: true,

  // Image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.anaqio.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      // Defense-in-depth: prevent indexing of legal mentions
      {
        source: '/legal-mentions/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noimageindex, nosnippet, noarchive',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://images.unsplash.com https://amal.anaqio.com https://avatars.githubusercontent.com; connect-src 'self' https://*.supabase.co https://www.google-analytics.com; frame-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  experimental: {
    cssChunking: true,
    inlineCss: true,
    viewTransition: true,
  },
  turbopack: {},
} satisfies NextConfig;

export default withNextIntl(nextConfig);
