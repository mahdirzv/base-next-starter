/**
 * AUTH MODULE — PUBLIC API
 * ─────────────────────────────────────────────────────────────────────────────
 * Import everything auth-related from here. Never import from providers directly.
 *
 * Active provider: controlled by AUTH_PROVIDER env var (default: clerk)
 *
 * TO SWITCH PROVIDERS:
 *   1. Set AUTH_PROVIDER=<name> in .env.local
 *   2. Fill in the provider's env vars (see .env.example)
 *   3. Change the components re-export below to point to the new provider
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { config } from '@/config'
import type { AuthServerOps } from './interface'

import clerkOps    from './providers/clerk/server'
import supabaseOps from './providers/supabase/server'
import firebaseOps from './providers/firebase/server'
import customOps   from './providers/custom/server'

const serverProviders: Record<string, AuthServerOps> = {
  clerk:    clerkOps,
  supabase: supabaseOps,
  firebase: firebaseOps,
  custom:   customOps,
}

const provider = serverProviders[config.auth.provider]

if (!provider) {
  throw new Error(
    `Unknown AUTH_PROVIDER: "${config.auth.provider}". Valid options: clerk | supabase | firebase | custom`
  )
}

// ─── Server ops (config-driven at runtime) ────────────────────────────────────
export const getUser     = () => provider.getUser()
export const requireUser = () => provider.requireUser()
export const signOut     = () => provider.signOut()
// authProxy: called by root proxy.ts to run auth logic on each request
export const authProxy   = provider.middleware.bind(provider)
export const publicPaths = provider.publicPaths

// ─── Components (change this import to switch provider's UI) ─────────────────
// To switch: update this line to: import { SignInForm, SignUpForm } from './providers/<name>/components'
export { SignInForm, SignUpForm } from './providers/clerk/components'
