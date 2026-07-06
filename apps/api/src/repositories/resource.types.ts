export type ResourceInstanceRow = {
  id: string
  resourceId: string
  capacity: number
  notes: string | null
  updatedAt: Date
}

export type ResourceRow = {
  id: string
  name: string
  category: string
  unit: string
  notes: string | null
  minUnits: number
  createdById: string
  createdAt: Date
  instances: ResourceInstanceRow[]
}

export type ResourceCreateData = {
  name: string
  category: string
  unit: string
  notes?: string
  minUnits?: number
  createdById: string
}

export type ResourceUpdateData = {
  name?: string
  category?: string
  unit?: string
  notes?: string | null
  minUnits?: number
}

export type ResourceInstanceCreateData = {
  resourceId: string
  capacity?: number
  notes?: string
}

export type ResourceInstanceUpdateData = {
  capacity?: number
  notes?: string | null
}
