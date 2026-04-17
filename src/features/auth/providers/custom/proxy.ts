import { NextResponse, type NextRequest } from 'next/server'

export const publicPaths = ['/sign-in', '/sign-up', '/']

/**
 * Custom provider proxy — no-op stub.
 * Replace with your own session/cookie logic. Mirror the clerk/supabase
 * proxy patterns: call-time env guard, console.warn when not configured,
 * protect non-public routes.
 */
export function customProxy(_req: NextRequest): NextResponse {
  if (typeof console !== 'undefined') {
    console.warn(
      '[auth] AUTH_PROVIDER=custom is set but the custom proxy is a no-op stub. ' +
        'Implement src/modules/auth/providers/custom/proxy.ts.',
    )
  }
  return NextResponse.next()
}
