'use client'

/**
 * Root error boundary. Catches errors thrown in the route subtree and
 * renders a retry UI. Must be a client component — Next.js requires it.
 *
 * Replace the default UI with your product's branded error page.
 *
 * ⚠ Important: Next.js uses thrown sentinel errors for control flow
 * (`redirect()` → `NEXT_REDIRECT`, `notFound()` → `NEXT_NOT_FOUND`).
 * These reach `error.tsx` before the framework's built-in handler — if we
 * render our error UI for them, the redirect/not-found is swallowed
 * (e.g. a protected page would 200 with the error UI instead of 307ing to
 * /sign-in). Re-throw them so Next.js handles them upstream.
 */
import { useEffect } from 'react'
import { Button } from '@/modules/ui'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Re-throw framework sentinel errors so Next.js handles them (redirect → 307,
  // notFound → not-found.tsx). Checked during render so the error UI never
  // renders for these cases.
  if (
    error.digest?.startsWith('NEXT_REDIRECT') ||
    error.digest?.startsWith('NEXT_NOT_FOUND')
  ) {
    throw error
  }

  useEffect(() => {
    // TODO: forward to Sentry / your logger of choice.
    console.error('[app error]', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-[var(--color-background)]">
      <div className="w-full max-w-md flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Something went wrong
        </h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {error.message || 'An unexpected error occurred.'}
          {error.digest && (
            <>
              <br />
              <code className="text-xs">Digest: {error.digest}</code>
            </>
          )}
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => reset()}>Try again</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go home
          </Button>
        </div>
      </div>
    </main>
  )
}
