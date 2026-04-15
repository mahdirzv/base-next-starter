/**
 * PROJECT CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 * Auth provider:  set AUTH_PROVIDER env var
 *   Options: clerk | supabase | firebase | custom
 *   Default: clerk
 *   How to switch:
 *     1. Change AUTH_PROVIDER in .env.local
 *     2. Fill in the matching env vars (see .env.example)
 *     3. In src/modules/auth/index.ts, update the components re-export line
 *
 * Theme preset:   set THEME_PRESET env var
 *   Options: neutral | vivid
 *   Default: neutral
 *   How to add a preset: copy src/modules/ui/themes/neutral.ts, register in
 *   src/modules/ui/themes/index.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AuthProviderName = 'clerk' | 'supabase' | 'firebase' | 'custom'
export type ThemePresetName  = 'neutral' | 'vivid'

export const config = {
  auth: {
    provider: (process.env.AUTH_PROVIDER ?? 'clerk') as AuthProviderName,
  },
  theme: {
    preset: (process.env.THEME_PRESET ?? 'neutral') as ThemePresetName,
  },
} as const
