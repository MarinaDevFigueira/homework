export type RecurringRow = {
  id: string
  title: string
  description: string | null
  frequency: string
  nextDue: Date
  isActive: boolean
  assignedToId: string
  assignedTo: { name: string }
  createdAt: Date
}

export type RecurringCreateData = {
  title: string
  description?: string
  assignedToId: string
  frequency: string
  nextDue: Date
  isActive?: boolean
}

export type RecurringUpdateData = {
  title?: string
  description?: string
  frequency?: string
  nextDue?: Date
  isActive?: boolean
  assignedToId?: string
}
