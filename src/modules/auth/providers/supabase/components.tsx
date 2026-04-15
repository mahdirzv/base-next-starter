'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export function SignInForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="sb-email" className="text-sm font-medium text-[var(--color-text-primary)]">
          Email
        </label>
        <input
          id="sb-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="sb-password" className="text-sm font-medium text-[var(--color-text-primary)]">
          Password
        </label>
        <input
          id="sb-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      {error && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-[var(--radius)] font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

export function SignUpForm() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState<string | null>(null)
  const [message, setMessage]   = useState<string | null>(null)
  const [loading, setLoading]   = useState(false)
  const router = useRouter()

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)

    if (!data.session) {
      // Email confirmation is required — user is not yet authenticated
      setMessage('Check your email to confirm your account.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex flex-col gap-1">
        <label htmlFor="sb-signup-email" className="text-sm font-medium text-[var(--color-text-primary)]">
          Email
        </label>
        <input
          id="sb-signup-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="sb-signup-password" className="text-sm font-medium text-[var(--color-text-primary)]">
          Password
        </label>
        <input
          id="sb-signup-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
          className="px-3 py-2 border border-[var(--color-border)] rounded-[var(--radius)] bg-[var(--color-surface)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />
      </div>
      {error   && <p className="text-sm text-[var(--color-error)]">{error}</p>}
      {message && <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-[var(--radius)] font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
