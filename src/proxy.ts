/**
 * Root proxy (Next.js 16 — replaces middleware.ts).
 *
 * Delegates to the active auth provider's proxy via @/modules/auth.
 * Switching provider: set AUTH_PROVIDER in .env.local and restart.
 * No code edits here when adding new providers — they register themselves
 * in the module's proxyProviders map.
 */
import { authProxy } from '@/modules/auth'

export const proxy = authProxy

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
