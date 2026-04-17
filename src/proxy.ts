/**
 * Root proxy — delegates to the active auth provider.
 * In Next.js 16, this file replaces middleware.ts.
 * The named export must be 'proxy'.
 *
 * Clerk: re-exports clerkMiddleware() as 'proxy' (required by Clerk's architecture).
 * Supabase: replace the export below with supabaseProxy from the supabase provider.
 *
 * TO SWITCH FROM CLERK:
 *   Replace the export below with:
 *   export { supabaseProxy as proxy } from '@/modules/auth/providers/supabase/proxy'
 *   export const config = { matcher: [...] }
 */

// ─── Clerk (default) ──────────────────────────────────────────────────────────
// config must be defined directly here — Next.js cannot statically analyze a re-export
export { proxy } from '@/modules/auth/providers/clerk/proxy'

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
