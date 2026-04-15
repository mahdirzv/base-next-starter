import type { NextRequest } from 'next/server'

const NOT_CONFIGURED = 'Custom auth not configured. Implement the auth methods in providers/custom/server.ts.'

const customServerOps = {
  async getUser() {
    throw new Error(NOT_CONFIGURED)
  },

  async requireUser() {
    throw new Error(NOT_CONFIGURED)
  },

  async signOut() {
    throw new Error(NOT_CONFIGURED)
  },

  async middleware(_req: NextRequest) {
    throw new Error(NOT_CONFIGURED)
  },

  publicPaths: ['/sign-in', '/sign-up', '/'],
}

export default customServerOps
