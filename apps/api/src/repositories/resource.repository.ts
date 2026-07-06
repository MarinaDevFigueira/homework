import { prisma } from '../db/client.ts'
import type { Resource, ResourceInstance } from '@homework/types/resource.interface'
import type { ResourceCategory } from '@homework/types/resource-category.enum'
import type {
  ResourceRow,
  ResourceInstanceRow,
  ResourceCreateData,
  ResourceUpdateData,
  ResourceInstanceCreateData,
  ResourceInstanceUpdateData,
} from './resource.types.ts'

function mapInstance(row: ResourceInstanceRow): ResourceInstance {
  const instance = {
    id: row.id,
    resourceId: row.resourceId,
    capacity: row.capacity,
    notes: row.notes,
    updatedAt: row.updatedAt.toISOString(),
  }
  return instance
}

function mapResource(row: ResourceRow): Resource {
  const resource = {
    id: row.id,
    name: row.name,
    category: row.category as ResourceCategory,
    unit: row.unit,
    notes: row.notes,
    minUnits: row.minUnits,
    instances: row.instances.map(mapInstance),
    createdById: row.createdById,
    createdAt: row.createdAt.toISOString(),
  }
  return resource
}

const INCLUDE_INSTANCES = { instances: { orderBy: { updatedAt: 'asc' as const } } }

export class ResourceRepository {
  async findMany(): Promise<Resource[]> {
    const rows = await prisma.resource.findMany({
      orderBy: { name: 'asc' },
      include: INCLUDE_INSTANCES,
    })
    return rows.map(mapResource)
  }

  async findById(id: string): Promise<Resource | null> {
    const row = await prisma.resource.findUnique({
      where: { id },
      include: INCLUDE_INSTANCES,
    })
    const isNotFound = !row
    if (isNotFound) return null
    return mapResource(row)
  }

  async create(data: ResourceCreateData): Promise<Resource> {
    const row = await prisma.resource.create({
      data,
      include: INCLUDE_INSTANCES,
    })
    return mapResource(row)
  }

  async update(id: string, data: ResourceUpdateData): Promise<Resource> {
    const row = await prisma.resource.update({
      where: { id },
      data,
      include: INCLUDE_INSTANCES,
    })
    return mapResource(row)
  }

  async remove(id: string): Promise<void> {
    await prisma.resource.delete({ where: { id } })
  }

  async addInstance(data: ResourceInstanceCreateData): Promise<ResourceInstance> {
    const row = await prisma.resourceInstance.create({ data })
    return mapInstance(row)
  }

  async updateInstance(id: string, data: ResourceInstanceUpdateData): Promise<ResourceInstance> {
    const row = await prisma.resourceInstance.update({ where: { id }, data })
    return mapInstance(row)
  }

  async removeInstance(id: string): Promise<void> {
    await prisma.resourceInstance.delete({ where: { id } })
  }
}

export const resourceRepository = new ResourceRepository()
