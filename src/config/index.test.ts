import { describe, it, expect, vi } from 'vitest'

describe('config', () => {
  it('defaults auth provider to clerk', async () => {
    vi.resetModules()
    delete process.env.AUTH_PROVIDER
    const { config } = await import('./index')
    expect(config.auth.provider).toBe('clerk')
  })

  it('defaults theme preset to neutral', async () => {
    vi.resetModules()
    delete process.env.THEME_PRESET
    const { config } = await import('./index')
    expect(config.theme.preset).toBe('neutral')
  })

  it('reads AUTH_PROVIDER from env', async () => {
    vi.resetModules()
    process.env.AUTH_PROVIDER = 'supabase'
    const { config } = await import('./index')
    expect(config.auth.provider).toBe('supabase')
    delete process.env.AUTH_PROVIDER
  })
})
