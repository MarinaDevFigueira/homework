import { useEffect } from "react"
import { redirect, useLoaderData } from "react-router"
import type { Route } from "./+types/_app"
import { AppShell } from "~/components/layout/app-shell"
import { fetchCurrentUser } from "~/lib/services/auth.service.server"
import { authStore } from "~/lib/stores/auth.store"

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const hasAuthCookie = cookieHeader.includes("auth_token=")
  if (!hasAuthCookie) {
    throw redirect("/login")
  }
  const user = await fetchCurrentUser(request)
  const isUnauthenticated = !user
  if (isUnauthenticated) {
    throw redirect("/login")
  }
  return { user }
}

export default function AppLayout() {
  const { user } = useLoaderData<typeof loader>()

  useEffect(() => {
    authStore.set(user)
  }, [user])

  return <AppShell />
}
