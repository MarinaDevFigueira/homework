export type TaskRow = {
  id: string
  title: string
  description: string | null
  status: string
  assignedToId: string
  createdById: string
  dueDate: Date | null
  completedAt: Date | null
  startedAt: Date | null
  finishedAt: Date | null
  durationMinutes: number | null
  isRecurring: boolean
  recurringTemplateId: string | null
  createdAt: Date
  assignedTo: { name: string }
  taskResources: { resourceId: string }[]
}

export type TaskCreateData = {
  title: string
  description?: string
  assignedToId: string
  createdById: string
  dueDate?: Date
}

export type TaskUpdateData = {
  title?: string
  description?: string
  status?: string
  completedAt?: Date | null
  startedAt?: Date | null
  finishedAt?: Date | null
  durationMinutes?: number | null
  assignedToId?: string
  dueDate?: Date | null
}

export type TaskListFilters = {
  status?: string
  assignedToId?: string
}

export type ResourceSnapshotData = {
  instanceId: string
  resourceId: string
  capacityBefore: number
  capacityAfter: number
}
