import { useEffect, useState } from "react"
import type { UserSession } from "@homework/types/user.interface"
import { authStore } from "~/lib/stores/auth.store"

export function useAuth() {
  const [session, setSession] = useState<UserSession | null>(authStore.state)

  useEffect(() => {
    const subscription = authStore.subject.subscribe((nextSession) => {
      setSession(nextSession)
    })
    return () => subscription.unsubscribe()
  }, [])

  const isAuthenticated = !!session

  return { session, isAuthenticated }
}
