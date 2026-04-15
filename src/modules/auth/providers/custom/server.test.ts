import { describe, it, expect } from 'vitest'
import provider from './server'

describe('custom provider stub', () => {
  it('getUser throws not-configured error', async () => {
    await expect(provider.getUser()).rejects.toThrow('Custom auth not configured')
  })

  it('requireUser throws not-configured error', async () => {
    await expect(provider.requireUser()).rejects.toThrow('Custom auth not configured')
  })

  it('has correct public interface shape', () => {
    expect(typeof provider.getUser).toBe('function')
    expect(typeof provider.requireUser).toBe('function')
    expect(typeof provider.signOut).toBe('function')
    expect(typeof provider.middleware).toBe('function')
    expect(Array.isArray(provider.publicPaths)).toBe(true)
  })
})
