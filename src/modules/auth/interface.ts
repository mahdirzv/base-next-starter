import type { NextRequest, NextResponse } from 'next/server'
import type { User } from './types'

/**
 * Every auth provider must implement this interface.
 * Screens import from @/modules/auth — never from providers directly.
 */
export interface AuthServerOps {
  /** Returns the current user, or null if not authenticated. */
  getUser(): Promise<User | null>

  /**
   * Returns the current user.
   * Redirects to /sign-in if not authenticated (never returns null).
   */
  requireUser(): Promise<User>

  /** Signs the current user out and clears the session. */
  signOut(): Promise<void>

  /**
   * Called by the root proxy.ts on every request.
   * In Next.js 16, 'middleware' is renamed to 'proxy' at the file level,
   * but this method is internal and keeps the name 'middleware' for clarity.
   */
  middleware(req: NextRequest): Promise<NextResponse | void>

  /** Paths that bypass auth protection (no redirect to sign-in). */
  publicPaths: string[]
}

export interface AuthComponentOps {
  /**
   * Sign-in form component.
   * Handles all provider-specific logic internally.
   * On success: redirects to /dashboard (or CLERK after-sign-in URL).
   */
  SignInForm: React.ComponentType

  /**
   * Sign-up form component.
   * On success: redirects to /dashboard.
   */
  SignUpForm: React.ComponentType
}

export type AuthProvider = AuthServerOps & AuthComponentOps
