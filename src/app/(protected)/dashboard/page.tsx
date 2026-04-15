import { requireUser, signOut } from '@/modules/auth'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@/modules/ui'

export default async function DashboardPage() {
  const user = await requireUser()

  async function handleSignOut() {
    'use server'
    await signOut()
  }

  return (
    <main className="min-h-screen p-8 bg-[var(--color-background)]">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Dashboard
          </h1>
          <form action={handleSignOut}>
            <Button variant="outline" size="sm" type="submit">
              Sign out
            </Button>
          </form>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Your account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-muted)] w-16">Email</span>
                <span className="text-[var(--color-text-primary)]">{user.email}</span>
              </div>
              {user.name && (
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-text-muted)] w-16">Name</span>
                  <span className="text-[var(--color-text-primary)]">{user.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-muted)] w-16">ID</span>
                <code className="text-xs text-[var(--color-text-muted)]">{user.id}</code>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 flex-wrap">
          <Badge>Auth: {process.env.AUTH_PROVIDER ?? 'clerk'}</Badge>
          <Badge variant="outline">Theme: {process.env.THEME_PRESET ?? 'neutral'}</Badge>
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          This dashboard is a placeholder. Replace it with your product main screen.
          The auth module (<code>@/modules/auth</code>) and UI module (<code>@/modules/ui</code>)
          are ready to use.
        </p>
      </div>
    </main>
  )
}
