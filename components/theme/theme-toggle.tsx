"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeStore } from "@/store/theme-store"

export function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 border-slate-700 hover:bg-slate-800 bg-transparent"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
