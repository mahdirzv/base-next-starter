import { describe, it, expect } from 'vitest'
import { colors } from './colors'
import { typography } from './typography'

describe('color tokens', () => {
  it('all color token values are CSS var references', () => {
    function checkValues(obj: Record<string, unknown>, path = '') {
      for (const [key, val] of Object.entries(obj)) {
        if (typeof val === 'object' && val !== null) {
          checkValues(val as Record<string, unknown>, `${path}.${key}`)
        } else {
          expect(
            typeof val === 'string' && val.startsWith('var(--'),
            `${path}.${key} = "${val}" must be a CSS var reference`
          ).toBe(true)
        }
      }
    }
    checkValues(colors as unknown as Record<string, unknown>)
  })
})

describe('typography tokens', () => {
  it('exports fontSize object', () => {
    expect(typeof typography.fontSize).toBe('object')
  })

  it('fontSize values are CSS var references', () => {
    for (const [key, val] of Object.entries(typography.fontSize)) {
      expect(
        (val as string).startsWith('var(--'),
        `fontSize.${key} must be a CSS var reference`
      ).toBe(true)
    }
  })
})
