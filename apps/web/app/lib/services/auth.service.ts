import { apiRequest } from "~/lib/api.client"

async function logout(): Promise<void> {
  await apiRequest("/auth/logout", { method: "POST" })
}

export const authService = { logout }
