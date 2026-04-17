'use client'

/**
 * Root error boundary. Catches errors thrown in the route subtree and
 * renders a retry UI. Must be a client component — Next.js requires it.
 *
 * Replace the default UI with your product's branded error page.
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
