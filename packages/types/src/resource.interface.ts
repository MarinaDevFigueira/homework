import type { ResourceCategory } from "./resource-category.enum"

export interface ResourceInstance {
  id: string
  resourceId: string
  capacity: number
  notes: string | null
  updatedAt: string
}

export interface Resource {
  id: string
  name: string
  category: ResourceCategory
  unit: string
  notes: string | null
  minUnits: number
  instances: ResourceInstance[]
  createdById: string
  createdAt: string
}
