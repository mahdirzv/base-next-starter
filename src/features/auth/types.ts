// AuthProviderName is owned by @/config (single source of truth for env-driven names).
// Re-exported here for convenience so the auth module can be read standalone.
export type { AuthProviderName } from '@/config'

export type User = {
  id: string
  email: string
  name?: string
}

export type SignInInput = {
  email: string
  password: string
}

export type SignUpInput = {
  email: string
  password: string
  name?: string
}

export type AuthResult =
  | { success: true;  user: User }
  | { success: false; error: string }
