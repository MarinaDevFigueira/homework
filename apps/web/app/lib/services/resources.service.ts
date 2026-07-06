import type { Resource, ResourceInstance } from "@homework/types/resource.interface"
import type { ResourceCategory } from "@homework/types/resource-category.enum"
import { apiRequest } from "~/lib/api.client"

async function list(): Promise<Resource[]> {
  const result = await apiRequest<Resource[]>("/resources")
  return result.data ?? []
}

async function create(data: {
  name: string
  category: ResourceCategory
  unit: string
  notes?: string
  minUnits?: number
  initialCount?: number
}): Promise<Resource | null> {
  const result = await apiRequest<Resource>("/resources", {
    method: "POST",
    body: JSON.stringify(data),
  })
  return result.data
}

async function addInstance(resourceId: string, capacity: number = 100): Promise<ResourceInstance | null> {
  const result = await apiRequest<ResourceInstance>(`/resources/${resourceId}/instances`, {
    method: "POST",
    body: JSON.stringify({ capacity }),
  })
  return result.data
}

async function updateInstance(instanceId: string, capacity: number): Promise<ResourceInstance | null> {
  const result = await apiRequest<ResourceInstance>(`/resources/instances/${instanceId}`, {
    method: "PATCH",
    body: JSON.stringify({ capacity }),
  })
  return result.data
}

export const resourcesService = { list, create, addInstance, updateInstance }
