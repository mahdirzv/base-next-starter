import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { config } from '@/config'
import { getTheme } from '@/lib/design/themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Starter',
  description: 'Base Next.js starter',
}

// ClerkProvider requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to be set.
// Read at call time so dev hot-reloads and prod builds with different envs
// behave correctly. Matches the call-time guard pattern used in provider code.
const getClerkKey = () => process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getTheme(config.theme.preset)
  const clerkKey = getClerkKey()

  // Convert theme object to inline CSS custom properties. Values come from
  // our own themes/*.ts files (hex + units), so `;` and `<` cannot appear.
  const themeVars = Object.entries(theme)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')

  return (
    <html lang="en">
      <head>
        <style>{`:root { ${themeVars} }`}</style>
      </head>
      <body>
        {clerkKey ? (
          <ClerkProvider publishableKey={clerkKey}>{children}</ClerkProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
