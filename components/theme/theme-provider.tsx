"use client"

import type React from "react"

import { useEffect } from "react"
import { useThemeStore } from "@/store/theme-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const htmlElement = document.documentElement

    if (theme === "light") {
      htmlElement.classList.remove("dark")
    } else {
      htmlElement.classList.add("dark")
    }
  }, [theme])

  return <>{children}</>
}
