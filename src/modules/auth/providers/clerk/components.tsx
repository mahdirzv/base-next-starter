'use client'

import { SignIn, SignUp } from '@clerk/nextjs'

export function SignInForm() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none border border-[var(--color-border)] rounded-[var(--radius)]',
        },
      }}
    />
  )
}

export function SignUpForm() {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: 'w-full',
          card: 'shadow-none border border-[var(--color-border)] rounded-[var(--radius)]',
        },
      }}
    />
  )
}
