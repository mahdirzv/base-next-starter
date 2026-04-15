import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { config } from '@/config'
import { getTheme } from '@/modules/ui/themes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Starter',
  description: 'Base Next.js starter',
}

// ClerkProvider requires NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to be set.
// When not configured (e.g. using a different auth provider), render without it.
const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = getTheme(config.theme.preset)

  // Convert theme object to inline CSS custom properties string
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
