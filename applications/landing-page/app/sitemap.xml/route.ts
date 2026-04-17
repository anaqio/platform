import { NextResponse } from 'next/server'

/**
 * Canonical /sitemap.xml route — redirects to the Next.js-generated
 * sitemap produced by app/[locale]/sitemap.ts.
 */
export function GET() {
  return NextResponse.redirect(new URL('/sitemap.xml', 'https://anaqio.com'), {
    status: 301,
  })
}
