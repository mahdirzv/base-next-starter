import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import type { AuthServerOps } from '../../interface'
import type { User } from '../../types'

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
    const user = await currentUser()
    return user ? toUser(user) : null
  },

  async requireUser() {
    const user = await clerkServerOps.getUser()
    if (!user) redirect('/sign-in')
    return user
  },

  async signOut() {
    // Clerk sign-out is client-side (useClerk().signOut())
    // Server-side we just redirect; Clerk's session cookie is cleared client-side
    redirect('/sign-in')
  },

  async middleware(_req: NextRequest) {
    // Clerk proxy logic is in providers/clerk/proxy.ts
    return undefined
  },

  publicPaths: ['/sign-in', '/sign-up', '/'],
}

export default clerkServerOps
