import type { Task } from "@homework/types/task.interface"
import { apiFetch } from "~/lib/api.server"

export async function listTasks(request: Request): Promise<Task[]> {
  const result = await apiFetch<Task[]>("/tasks", request)
  return result.data ?? []
}
