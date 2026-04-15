import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

export const publicPaths = ['/sign-in(.*)', '/sign-up(.*)', '/']

const isPublicRoute = createRouteMatcher(publicPaths)

// Named 'proxy' to match Next.js 16 file convention (middleware.ts is deprecated)
export const proxy = clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
