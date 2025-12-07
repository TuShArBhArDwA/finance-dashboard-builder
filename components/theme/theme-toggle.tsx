"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

/**
 * Theme toggle component using next-themes
 * Handles theme switching between light and dark modes
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 border-slate-700 hover:bg-slate-800 bg-transparent"
        disabled
      >
        <Sun className="h-4 w-4 text-slate-400" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  const isDark = theme === "dark" || theme === undefined // Default to dark if undefined

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newTheme = isDark ? "light" : "dark"
    setTheme(newTheme)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="h-9 w-9 border-slate-700 hover:bg-slate-800 bg-transparent"
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="button"
    >
      {isDark ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
