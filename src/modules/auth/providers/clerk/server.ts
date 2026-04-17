import { auth, clerkClient, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import type { AuthServerOps } from '../../interface'
import type { User } from '../../types'
import { publicPaths } from './proxy'

// Call-time check so tests and hot-reloaded dev sessions see the current env.
// Module-scope capture froze false into the module before tests set env vars.
const hasClerkKeys = () =>
  Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY)

function toUser(clerkUser: {
  id: string
  emailAddresses: Array<{ emailAddress: string }>
  firstName: string | null
  lastName: string | null
}): User {
  const nameParts = [clerkUser.firstName, clerkUser.lastName].filter(Boolean)
  return {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: nameParts.length > 0 ? nameParts.join(' ') : undefined,
  }
}

const clerkServerOps: AuthServerOps = {
  async getUser() {
    // When keys are missing, the proxy no-ops and ClerkProvider isn't mounted —
    // calling currentUser() would throw about missing middleware. Return null so
    // pages that call getUser() render as 'logged out' instead of 500ing.
    if (!hasClerkKeys()) return null
    const user = await currentUser()
    return user ? toUser(user) : null
  },

  async requireUser() {
    const user = await clerkServerOps.getUser()
    if (!user) redirect('/sign-in')
    return user
  },

  async signOut() {
    if (!hasClerkKeys()) {
      redirect('/sign-in')
    }
    const { sessionId } = await auth()
    if (sessionId) {
      const client = await clerkClient()
      await client.sessions.revokeSession(sessionId)
    }
    redirect('/sign-in')
  },

  async middleware(_req: NextRequest) {
    // Clerk proxy logic is in providers/clerk/proxy.ts
    return undefined
  },

  publicPaths,
}

export default clerkServerOps
