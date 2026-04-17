<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Auth conventions

- `src/proxy.ts` is the root middleware (Next.js 16 renamed `middleware.ts` → `proxy.ts`). It delegates to the active provider under `src/modules/auth/providers/<provider>/proxy.ts`.
- Every provider is required to **no-op gracefully when its API keys are missing** — proxy returns `NextResponse.next()`, `server.getUser()` returns `null`, and the sign-in/sign-up components render a `MissingKeysNotice` with instructions. This keeps `pnpm dev` usable on a fresh scaffold before the user has configured `.env.local`.
- If you add a new provider, mirror the `hasXxxKeys` guard pattern in all three files (`proxy.ts`, `server.ts`, `components.tsx`).
