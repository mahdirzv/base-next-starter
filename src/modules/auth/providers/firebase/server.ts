import type { AuthServerOps } from '../../interface'

const NOT_CONFIGURED = 'Firebase auth not configured. Set AUTH_PROVIDER=firebase and install firebase/firebase-admin.'

const firebaseServerOps: AuthServerOps = {
  async getUser() {
    throw new Error(NOT_CONFIGURED)
  },

  async requireUser() {
    throw new Error(NOT_CONFIGURED)
  },

  async signOut() {
    throw new Error(NOT_CONFIGURED)
  },

  publicPaths: ['/sign-in', '/sign-up', '/'],
}

export default firebaseServerOps
