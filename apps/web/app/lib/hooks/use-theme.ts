import { useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

const STORAGE_KEY = "homework-theme"

function getSystemTheme(): "light" | "dark" {
  const isServer = typeof window === "undefined"
  if (isServer) return "light"
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  return prefersDark ? "dark" : "light"
}

function applyTheme(theme: Theme): void {
  const isServer = typeof window === "undefined"
  if (isServer) return
  const resolved = theme === "system" ? getSystemTheme() : theme
  const isDark = resolved === "dark"
  if (isDark) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

function getStoredTheme(): Theme {
  const isServer = typeof window === "undefined"
  if (isServer) return "system"
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
  return stored ?? "system"
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const stored = getStoredTheme()
    setTheme(stored)
    applyTheme(stored)
  }, [])

  useEffect(() => {
    applyTheme(theme)
    const isServer = typeof window === "undefined"
    if (!isServer) {
      localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  useEffect(() => {
    const isSystemTheme = theme === "system"
    if (!isSystemTheme) return
    const isServer = typeof window === "undefined"
    if (isServer) return

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => applyTheme("system")
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const resolvedTheme = theme === "system" ? getSystemTheme() : theme

  return { theme, setTheme, resolvedTheme }
}
