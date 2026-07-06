import type { User } from "@homework/types/user.interface"
import { apiFetch } from "~/lib/api.server"

export async function fetchCurrentUser(request: Request): Promise<User | null> {
  const result = await apiFetch<User>("/auth/me", request)
  return result.data
}
