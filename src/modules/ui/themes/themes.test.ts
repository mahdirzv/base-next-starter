import { describe, it, expect } from 'vitest'
import { neutralTheme } from './neutral'
import { vividTheme } from './vivid'
import { getTheme } from './index'

const REQUIRED_TOKENS = [
  '--color-background',
  '--color-surface',
  '--color-border',
  '--color-text-primary',
  '--color-text-secondary',
  '--color-text-muted',
  '--color-accent',
  '--color-success',
  '--color-warning',
  '--color-error',
  '--radius',
  '--font-sans',
]

function checkTheme(theme: Record<string, string>, name: string) {
  for (const token of REQUIRED_TOKENS) {
    expect(
      token in theme,
      `${name} is missing required token: ${token}`
    ).toBe(true)
    expect(typeof theme[token]).toBe('string')
    expect(theme[token].length).toBeGreaterThan(0)
  }
}

describe('neutralTheme', () => {
  it('contains all required tokens', () => checkTheme(neutralTheme, 'neutralTheme'))
})

describe('vividTheme', () => {
  it('contains all required tokens', () => checkTheme(vividTheme, 'vividTheme'))
})

describe('getTheme', () => {
  it('returns neutralTheme for "neutral"', () => {
    expect(getTheme('neutral')).toBe(neutralTheme)
  })

  it('returns vividTheme for "vivid"', () => {
    expect(getTheme('vivid')).toBe(vividTheme)
  })

  it('throws for unknown preset', () => {
    expect(() => getTheme('unknown' as never)).toThrow()
  })
})
