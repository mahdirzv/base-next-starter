import { NextResponse, type NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export const publicPaths = ['/sign-in(.*)', '/sign-up(.*)', '/']

const isPublicRoute = createRouteMatcher(publicPaths)

const hasClerkKeys =
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY)

// Named 'proxy' to match Next.js 16 file convention (middleware.ts is deprecated).
// If Clerk keys are missing, we no-op so the app still boots — useful for first-run
// scaffolds before the user has filled in .env.local.
export const proxy = hasClerkKeys
  ? clerkMiddleware(async (auth, req) => {
      if (!isPublicRoute(req)) {
        await auth.protect()
      }
    })
  : (_req: NextRequest) => {
      if (typeof console !== 'undefined') {
        console.warn(
          '[auth] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY are not set. ' +
            'Auth is disabled; add them to .env.local to enable Clerk.',
        )
      }
      return NextResponse.next()
    }

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
