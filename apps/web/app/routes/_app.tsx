import { redirect } from "react-router"
import type { Route } from "./+types/_app"
import { AppShell } from "~/components/layout/app-shell"

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie") ?? ""
  const hasAuthCookie = cookieHeader.includes("auth_token=")
  if (!hasAuthCookie) {
    throw redirect("/login")
  }
  return null
}

export default function AppLayout() {
  return <AppShell />
}
