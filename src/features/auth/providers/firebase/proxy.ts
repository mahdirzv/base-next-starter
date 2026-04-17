import { NextResponse, type NextRequest } from 'next/server'

export const publicPaths = ['/sign-in', '/sign-up', '/']

/**
 * Firebase provider proxy — no-op stub.
 * When you implement firebase auth, replace this with real session logic
 * and mirror the clerk/supabase proxy patterns (call-time env guard,
 * console.warn when keys are missing, protect non-public routes).
 */
export function firebaseProxy(_req: NextRequest): NextResponse {
  if (typeof console !== 'undefined') {
    console.warn(
      '[auth] AUTH_PROVIDER=firebase is set but the firebase proxy is a no-op stub. ' +
        'Implement src/modules/auth/providers/firebase/proxy.ts to enable real auth.',
    )
  }
  return NextResponse.next()
}
