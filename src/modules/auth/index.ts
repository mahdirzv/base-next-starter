/**
 * AUTH MODULE — PUBLIC API
 * ─────────────────────────────────────────────────────────────────────────────
 * Import everything auth-related from here. Never import from providers directly.
 *
 * Switching providers is fully env-driven:
 *   1. Set AUTH_PROVIDER=<name> in .env.local (clerk | supabase | firebase | custom)
 *   2. Fill in the provider's env vars (see .env.example)
 *   3. Restart the dev server
 *
 * Both server ops and UI components dispatch at runtime — no code edits needed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { config } from '@/config'
import type { AuthServerOps } from './interface'

import clerkOps    from './providers/clerk/server'
import supabaseOps from './providers/supabase/server'
import firebaseOps from './providers/firebase/server'
import customOps   from './providers/custom/server'

import * as clerkUI    from './providers/clerk/components'
import * as supabaseUI from './providers/supabase/components'
import * as firebaseUI from './providers/firebase/components'
import * as customUI   from './providers/custom/components'

const serverProviders: Record<string, AuthServerOps> = {
  clerk:    clerkOps,
  supabase: supabaseOps,
  firebase: firebaseOps,
  custom:   customOps,
}

const componentProviders = {
  clerk:    clerkUI,
  supabase: supabaseUI,
  firebase: firebaseUI,
  custom:   customUI,
} as const

const provider = serverProviders[config.auth.provider]
if (!provider) {
  throw new Error(
    `Unknown AUTH_PROVIDER: "${config.auth.provider}". Valid options: clerk | supabase | firebase | custom`
  )
}

const ui = componentProviders[config.auth.provider as keyof typeof componentProviders]
if (!ui) {
  throw new Error(
    `Unknown AUTH_PROVIDER: "${config.auth.provider}". Valid options: clerk | supabase | firebase | custom`
  )
}

// ─── Server ops (runtime-dispatched) ──────────────────────────────────────────
export const getUser     = () => provider.getUser()
export const requireUser = () => provider.requireUser()
export const signOut     = () => provider.signOut()
// authProxy: called by root proxy.ts to run auth logic on each request
export const authProxy   = provider.middleware.bind(provider)
export const publicPaths = provider.publicPaths

// ─── Components (runtime-dispatched, same pattern as server ops) ──────────────
export const SignInForm = ui.SignInForm
export const SignUpForm = ui.SignUpForm
