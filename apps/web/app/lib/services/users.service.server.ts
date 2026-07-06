import type { User } from "@homework/types/user.interface"
import { apiFetch } from "~/lib/api.server"

export async function listUsers(request: Request): Promise<User[]> {
  const result = await apiFetch<User[]>("/users", request)
  return result.data ?? []
}
