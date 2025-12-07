"use client"

import type React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Theme provider using next-themes for proper theme management
 * Supports system preference detection and smooth transitions
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  )
}
