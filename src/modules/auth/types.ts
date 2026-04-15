export type AuthProviderName = 'clerk' | 'supabase' | 'firebase' | 'custom'

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
