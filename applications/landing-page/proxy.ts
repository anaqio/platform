import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'

import { routing } from '@/i18n/routing'

// Create next-intl middleware handler
const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // First, run next-intl locale routing to get the response
  const response = intlMiddleware(request)

  // Then, run Supabase session management on the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set({ name, value, ...options })
            response.cookies.set({ name, value, ...options })
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes logic
  if (request.nextUrl.pathname.startsWith('/protected') && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Auth routes logic (redirect to protected if already logged in)
  if (request.nextUrl.pathname.startsWith('/auth') && user) {
    if (
      !request.nextUrl.pathname.includes('/auth/confirm') &&
      !request.nextUrl.pathname.includes('/auth/error')
    ) {
      return NextResponse.redirect(new URL('/protected', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    // Match all paths except static assets and Next.js internals
    '/((?!_next/static|_next/image|favicon.ico|icon.*|apple-icon.*|manifest.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm|ogv|mov|woff2?|ttf|eot|otf|css|js|map|txt|xml|pdf)$).*)',
  ],
}
