/**
 * Root proxy — dispatches to the active auth provider at runtime.
 * In Next.js 16, this file replaces middleware.ts; the named export must be 'proxy'.
 *
 * Switching provider: set AUTH_PROVIDER in .env.local and restart. No code edits here.
 * Supported providers with their own proxy: clerk (default), supabase.
 * firebase / custom fall back to clerkProxy — implement a proxy.ts in those
 * providers' directories and extend this file to route to it.
 */

import { proxy as clerkProxy } from '@/modules/auth/providers/clerk/proxy'
import { supabaseProxy } from '@/modules/auth/providers/supabase/proxy'

const provider = process.env.AUTH_PROVIDER ?? 'clerk'

export const proxy = provider === 'supabase' ? supabaseProxy : clerkProxy

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
