# Agent Setup Guide

This file is the single source of truth for AI agents working on this codebase. Read it fully before writing any code.

---

## Stack (exact versions)

| Package | Version | Notes |
|---|---|---|
| Next.js | 16.x | Breaking changes vs 14/15 — see section below |
| React | 19.x | Breaking changes vs 18 — see section below |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | 4.x | New config format — no `tailwind.config.js` |
| Clerk | 6.x | `@clerk/nextjs` v6 |
| Supabase SSR | 0.9.x | `@supabase/ssr` |
| Vitest | 3.x | `environment: 'node'` (no jsdom) |
| pnpm | workspace | Single package at `starter/` |

---

## Next.js 16 breaking changes you must know

**`proxy.ts` replaces `middleware.ts`**
- File must be at the project root: `proxy.ts`
- Named export must be `proxy` (not `middleware`)
- `config` matcher must be defined DIRECTLY in `proxy.ts` — Next.js cannot statically analyze a re-export

```typescript
// proxy.ts — correct
export { proxy } from '@/modules/auth/providers/clerk/proxy'
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }

// WRONG — will silently fail
export { proxy, config } from '@/modules/auth/providers/clerk/proxy'
```

**`cookies()` from `next/headers` must be awaited**
```typescript
// WRONG (sync, removed in Next.js 16)
const cookieStore = cookies()

// Correct
const cookieStore = await cookies()
```

**All pages that call auth or use Clerk components must be force-dynamic**
```typescript
export const dynamic = 'force-dynamic'
```
Without this, Next.js attempts static prerendering and Clerk's `useSession` throws because there is no `ClerkProvider` at build time.

---

## React 19 breaking changes you must know

**`React.FormEvent` is removed**
```typescript
// WRONG
function handler(e: React.FormEvent) { ... }

// Correct — use structural type
function handler(e: { preventDefault(): void }) { ... }
```

---

## Project architecture

```
src/
  config/index.ts          # Typed config — reads AUTH_PROVIDER, THEME_PRESET env vars
  lib/utils.ts             # cn() utility (clsx + tailwind-merge)
  modules/
    auth/                  # Auth module
      types.ts             # User, SignInInput, SignUpInput, AuthResult
      interface.ts         # AuthServerOps, AuthComponentOps interfaces
      index.ts             # PUBLIC API — import from here only
      providers/
        clerk/
          server.ts        # Implements AuthServerOps
          components.tsx   # SignInForm, SignUpForm using Clerk's hosted components
          proxy.ts         # clerkMiddleware export + config
        supabase/
          server.ts        # Implements AuthServerOps
          components.tsx   # SignInForm, SignUpForm with email/password forms
          proxy.ts         # no-op proxy (Supabase uses server-side cookie logic)
        firebase/
          server.ts        # STUB — throws "not implemented"
        custom/
          server.ts        # STUB — throws "not implemented"
    ui/                    # UI module
      tokens/              # CSS custom property names (var(--*) only — no hex values)
        colors.ts
        typography.ts
        spacing.ts
        radius.ts
        shadows.ts
        index.ts           # barrel
      themes/
        neutral.ts         # Hex values mapped to CSS var names
        vivid.ts
        index.ts           # getTheme(preset) → Record<string, string>
      components/          # shadcn-style primitives
        button.tsx
        card.tsx
        badge.tsx
        input.tsx
        label.tsx
        index.ts           # barrel
      index.ts             # PUBLIC API — import from here only
  app/
    layout.tsx             # Injects theme CSS vars into :root; wraps with ClerkProvider if key present
    page.tsx               # Landing — calls getUser(), force-dynamic
    (auth)/
      sign-in/page.tsx     # Renders <SignInForm />, force-dynamic
      sign-up/page.tsx     # Renders <SignUpForm />, force-dynamic
    (protected)/
      dashboard/page.tsx   # Calls requireUser(), force-dynamic
proxy.ts                   # Root middleware (Next.js 16)
```

---

## Auth module contract

**Public API** (`src/modules/auth/index.ts`):
```typescript
getUser(): Promise<User | null>          // null = not authenticated
requireUser(): Promise<User>             // redirects to /sign-in if not authed
signOut(): Promise<void>                 // clears session, redirects to /sign-in
SignInForm: React.ComponentType          // provider-specific sign-in UI
SignUpForm: React.ComponentType          // provider-specific sign-up UI
```

**User type**:
```typescript
type User = { id: string; email: string; name?: string }
```

**Rule**: Screens NEVER import from providers directly. Always import from `@/modules/auth`.

---

## UI module contract

**Public API** (`src/modules/ui/index.ts`):
```typescript
Button, Card, CardHeader, CardTitle, CardContent, Badge, Input, Label
```

**How theming works**:
1. Token files (`src/modules/ui/tokens/*.ts`) define CSS var names as TypeScript constants
2. Theme preset files (`neutral.ts`, `vivid.ts`) map those var names to actual hex/value strings
3. `layout.tsx` calls `getTheme(preset)` and injects a `<style>:root { ... }</style>` block
4. Components use `var(--color-*)`, `var(--radius)`, etc. — never hardcoded values

**Adding a theme**:
1. Copy `src/modules/ui/themes/neutral.ts` → `src/modules/ui/themes/yourtheme.ts`
2. Change the hex values
3. Register it in `src/modules/ui/themes/index.ts`
4. Add the name to `ThemePresetName` in `src/config/index.ts`

**Adding a component**:
1. Create `src/modules/ui/components/yourcomponent.tsx`
2. Use only `var(--*)` CSS tokens — no hardcoded colors or sizes
3. Export from `src/modules/ui/components/index.ts`

---

## Switching auth providers

To activate a different provider:

1. Set `AUTH_PROVIDER=<name>` in `.env.local`
2. Provide the provider's env vars (see `.env.example`)
3. In `src/modules/auth/index.ts`, update the components import:
   ```typescript
   // Change this line:
   export { SignInForm, SignUpForm } from './providers/clerk/components'
   // To:
   export { SignInForm, SignUpForm } from './providers/supabase/components'
   ```
4. Server ops (getUser, requireUser, signOut) switch automatically via the `AUTH_PROVIDER` env var

**Implementing a stub provider** (Firebase or Custom):
- Implement `AuthServerOps` in `src/modules/auth/providers/{firebase,custom}/server.ts`
- Create a `components.tsx` with `SignInForm` and `SignUpForm`
- The routing and session protection work automatically once the interface is satisfied

---

## Adding a protected page

```typescript
// src/app/(protected)/your-page/page.tsx
import { requireUser } from '@/modules/auth'

export const dynamic = 'force-dynamic'

export default async function YourPage() {
  const user = await requireUser()  // redirects to /sign-in if not authenticated
  return <div>Hello {user.email}</div>
}
```

---

## Adding a public page

No special setup needed. Just don't call `requireUser()`. If the page uses auth state:
```typescript
export const dynamic = 'force-dynamic'

export default async function YourPage() {
  const user = await getUser()  // returns null if not authenticated
  return <div>{user ? `Hi ${user.email}` : 'Not logged in'}</div>
}
```

---

## Testing

- Framework: Vitest 3, `environment: 'node'`
- No jsdom — components are not unit tested, only server logic
- Each provider has tests in `server.test.ts`
- UI token and theme tests enforce CSS var invariants

Run tests: `pnpm test`

Test files:
```
src/config/index.test.ts
src/lib/utils.test.ts
src/modules/auth/index.test.ts
src/modules/auth/providers/clerk/server.test.ts
src/modules/auth/providers/supabase/server.test.ts
src/modules/auth/providers/firebase/server.test.ts
src/modules/auth/providers/custom/server.test.ts
src/modules/ui/tokens/tokens.test.ts
src/modules/ui/themes/themes.test.ts
```

---

## Environment variables

```env
# Auth — pick one provider
AUTH_PROVIDER=clerk              # clerk | supabase | firebase | custom (default: clerk)

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Theme
THEME_PRESET=neutral             # neutral | vivid (default: neutral)
```

---

## Commands

```bash
pnpm dev        # dev server (Turbopack)
pnpm build      # production build
pnpm test       # vitest run
pnpm lint       # eslint
```

---

## Known gotchas

1. **Static prerendering + Clerk**: Any page that calls `getUser()`, `requireUser()`, or renders Clerk components (`<SignIn />`, `<SignUp />`) must export `export const dynamic = 'force-dynamic'`. Missing this causes a build-time crash: "useSession can only be used within ClerkProvider."

2. **ClerkProvider is conditional**: `layout.tsx` only wraps with `<ClerkProvider>` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set. Builds without Clerk keys are valid (for Supabase/Firebase/Custom usage).

3. **`proxy.ts` config cannot be re-exported**: Next.js statically analyzes the `config` export in `proxy.ts`. It must be defined inline — not imported or re-exported from another module.

4. **`cookies()` is async**: In Next.js 16, `cookies()` from `next/headers` returns a Promise. Always `await` it.

5. **Supabase `signUp` session**: `supabase.auth.signUp()` returns `data.session = null` when email confirmation is required. Check before redirecting.

6. **Clerk `currentUser()` fields**: Clerk v6 uses `firstName`/`lastName` (not `fullName`). Name is `[firstName, lastName].filter(Boolean).join(' ') || undefined`.

7. **`proxy.ts` export name**: The named export must be `proxy`, not `middleware`. The internal `AuthServerOps.middleware()` method keeps the old name for clarity, but the file-level export is `proxy`.
