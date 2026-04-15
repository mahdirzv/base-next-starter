import Link from 'next/link'
import { getUser } from '@/modules/auth'
import { Button } from '@/modules/ui'

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const user = await getUser()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8 bg-[var(--color-background)]">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">
          Starter
        </h1>
        <p className="text-[var(--color-text-secondary)]">
          Base Next.js project. Replace this with your product description.
        </p>
      </div>

      <div className="flex gap-3">
        {user ? (
          <Link href="/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        ) : (
          <>
            <Link href="/sign-in">
              <Button>Sign in</Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline">Create account</Button>
            </Link>
          </>
        )}
      </div>

      <p className="text-xs text-[var(--color-text-muted)]">
        Auth: <code>{process.env.AUTH_PROVIDER ?? 'clerk'}</code> ·
        Theme: <code>{process.env.THEME_PRESET ?? 'neutral'}</code>
      </p>
    </main>
  )
}
