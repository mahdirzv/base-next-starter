/**
 * UI MODULE — PUBLIC API
 * ─────────────────────────────────────────────────────────────────────────────
 * Import all UI primitives and tokens from here.
 * Never import from tokens/ or themes/ directly in app code.
 *
 * Active theme: controlled by THEME_PRESET env var (default: neutral)
 * To switch themes: set THEME_PRESET=vivid in .env.local
 * ─────────────────────────────────────────────────────────────────────────────
 */

export * from './components'
export * from './tokens'
export { getTheme, neutralTheme, vividTheme } from './themes'
