import type { Task, CreateTaskInput } from "@homework/types/task.interface"
import { apiRequest } from "~/lib/api.client"

interface ResourceSnapshot {
  instanceId: string
  resourceId: string
  capacityBefore: number
  capacityAfter: number
}

async function complete(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/finish`, { method: "POST", body: JSON.stringify({ resourceSnapshots: [] }) })
  return result.data
}

async function create(data: CreateTaskInput): Promise<Task | null> {
  const result = await apiRequest<Task>("/tasks", { method: "POST", body: JSON.stringify(data) })
  return result.data
}

async function start(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/start`, { method: "POST" })
  return result.data
}

async function pause(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/pause`, { method: "POST" })
  return result.data
}

async function resume(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/resume`, { method: "POST" })
  return result.data
}

async function cancel(taskId: string): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/cancel`, { method: "POST" })
  return result.data
}

async function finish(taskId: string, snapshots: ResourceSnapshot[]): Promise<Task | null> {
  const result = await apiRequest<Task>(`/tasks/${taskId}/finish`, { method: "POST", body: JSON.stringify({ resourceSnapshots: snapshots }) })
  return result.data
}

export const tasksService = { complete, create, start, pause, resume, cancel, finish }
