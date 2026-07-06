export type TaskRow = {
  id: string
  title: string
  description: string | null
  status: string
  assignedToId: string
  createdById: string
  dueDate: Date | null
  completedAt: Date | null
  isRecurring: boolean
  recurringTemplateId: string | null
  createdAt: Date
  assignedTo: { name: string }
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
  assignedToId?: string
  dueDate?: Date | null
}

export type TaskListFilters = {
  status?: string
  assignedToId?: string
}
