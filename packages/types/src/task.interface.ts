import type { TaskStatus } from './task.enum.ts'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  assignedToId: string
  assignedToName: string
  createdById: string
  dueDate: string | null
  completedAt: string | null
  startedAt: string | null
  finishedAt: string | null
  durationMinutes: number | null
  isRecurring: boolean
  recurringTemplateId: string | null
  createdAt: string
  resourceIds: string[]
}

export interface CreateTaskInput {
  title: string
  description?: string
  assignedToId: string
  dueDate?: string
  isRecurring?: boolean
  recurringTemplateId?: string
  resourceIds?: string[]
}

export interface UpdateTaskInput {
  title?: string
  description?: string
  status?: TaskStatus
  assignedToId?: string
  dueDate?: string
}
