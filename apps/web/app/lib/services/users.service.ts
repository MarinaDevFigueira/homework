import type { User } from "@homework/types/user.interface"
import type { UserRole } from "@homework/types/user.enum"
import { apiRequest } from "~/lib/api.client"

async function updateRole(userId: string, role: UserRole): Promise<User | null> {
  const result = await apiRequest<User>(`/users/${userId}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  })
  return result.data
}

async function remove(userId: string): Promise<void> {
  await apiRequest(`/users/${userId}`, { method: "DELETE" })
}

export const usersService = { updateRole, remove }
