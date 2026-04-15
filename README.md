# Base Next.js Starter

A production-ready Next.js 16 starter with a config-driven auth module and a token-based UI system. Swap auth providers and themes via environment variables — no code changes needed.

---

## Quick start

```bash
pnpm install
cp .env.example .env.local   # fill in your keys
pnpm dev
```

## Auth providers

Set `AUTH_PROVIDER` in `.env.local`. Default is `clerk`.

### Clerk (default)

```env
AUTH_PROVIDER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Supabase

```env
AUTH_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Firebase and Custom providers are stubbed — implement `src/modules/auth/providers/{firebase,custom}/server.ts` to activate.

## Themes

Set `THEME_PRESET` in `.env.local`. Options: `neutral` (default), `vivid`.

```env
THEME_PRESET=vivid
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm test` | Run tests (40 tests) |
| `pnpm lint` | Lint |

## Project structure

```
src/
  config/          # Reads env vars, exports typed config
  lib/             # Shared utilities (cn)
  modules/
    auth/          # Auth module — provider-agnostic public API
      providers/
        clerk/     # Clerk implementation (default)
        supabase/  # Supabase implementation
        firebase/  # Stub
        custom/    # Stub
    ui/            # UI module — tokens, themes, components
      tokens/      # CSS custom property definitions
      themes/      # Preset values (neutral, vivid)
      components/  # shadcn primitives (Button, Card, Badge, Input, Label)
  app/
    (auth)/        # sign-in, sign-up pages
    (protected)/   # dashboard (requires auth)
proxy.ts           # Next.js 16 middleware (replaces middleware.ts)
```

## Working with an AI agent?

Send [`SETUP_FOR_AGENTS.md`](./SETUP_FOR_AGENTS.md) to your agent instead of this file. It contains the full technical context, module contracts, known gotchas, and extension patterns — structured for machine consumption.
