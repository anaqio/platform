'use client';

import dynamic from 'next/dynamic';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { pageview } from '@/lib/analytics';

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then((mod) => mod.Analytics),
  { ssr: true }
);

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights),
  { ssr: true }
);

const GoogleAnalytics = dynamic(
  () => import('@next/third-parties/google').then((mod) => mod.GoogleAnalytics),
  { ssr: true }
);

const GoogleTagManager = dynamic(
  () =>
    import('@next/third-parties/google').then((mod) => mod.GoogleTagManager),
  { ssr: true }
);

/**
 * Component to track pageviews on route changes in Next.js App Router
 */
function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url =
        pathname +
        (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function AnaqioAnalytica() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </>
  );
}
