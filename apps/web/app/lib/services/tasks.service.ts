import type { Task } from "@homework/types/task.interface"
import { TaskStatus } from "@homework/types/task.enum"
import { apiRequest } from "~/lib/api.client"

async function complete(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify({ status: TaskStatus.Done }),
  })
  return result.data
}

async function create(data: {
  title: string
  description?: string
  assignedToId: string
}): Promise<Task | null> {
  const result = await apiRequest<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result.data
}

export const tasksService = { complete, create }
