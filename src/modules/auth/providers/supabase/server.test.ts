import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/headers and next/navigation before importing the provider
vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    getAll: () => [],
    set: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`redirect:${url}`) }),
}))

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
  })),
}))

import provider from './server'
import { createServerClient } from '@supabase/ssr'

const mockCreateServerClient = vi.mocked(createServerClient)

describe('supabase auth provider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
        signOut: vi.fn().mockResolvedValue({ error: null }),
      },
    } as never)
  })

  it('has correct interface shape', () => {
    expect(typeof provider.getUser).toBe('function')
    expect(typeof provider.requireUser).toBe('function')
    expect(typeof provider.signOut).toBe('function')
    expect(typeof provider.middleware).toBe('function')
    expect(Array.isArray(provider.publicPaths)).toBe(true)
    expect(provider.publicPaths).toContain('/sign-in')
    expect(provider.publicPaths).toContain('/')
  })

  it('getUser returns null when no session', async () => {
    const result = await provider.getUser()
    expect(result).toBeNull()
  })

  it('getUser maps supabase user to User type', async () => {
    mockCreateServerClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: {
            user: {
              id: 'user-123',
              email: 'test@example.com',
              user_metadata: { full_name: 'Test User' },
            },
          },
          error: null,
        }),
        signOut: vi.fn(),
      },
    } as never)

    const result = await provider.getUser()
    expect(result).toEqual({ id: 'user-123', email: 'test@example.com', name: 'Test User' })
  })

  it('requireUser redirects to /sign-in when not authenticated', async () => {
    await expect(provider.requireUser()).rejects.toThrow('redirect:/sign-in')
  })

  it('middleware is a no-op', async () => {
    const result = await provider.middleware({} as never)
    expect(result).toBeUndefined()
  })
})
