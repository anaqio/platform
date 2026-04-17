import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set({ name, value, ...options })
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set({ name, value, ...options })
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
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
