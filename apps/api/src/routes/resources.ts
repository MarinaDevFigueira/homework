import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.ts'
import { resourceRepository } from '../repositories/resource.repository.ts'
import { ok, created, notFound } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'
import { ResourceCategory } from '@homework/types/resource-category.enum'

const VALID_CATEGORIES = Object.values(ResourceCategory) as [string, ...string[]]

const createResourceSchema = z.object({
  name: z.string().min(1),
  category: z.enum(VALID_CATEGORIES).default(ResourceCategory.Outro),
  unit: z.string().default('un'),
  notes: z.string().optional(),
  minUnits: z.number().int().positive().default(2),
  initialCount: z.number().int().positive().default(1),
})

const updateResourceSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  unit: z.string().optional(),
  notes: z.string().nullable().optional(),
  minUnits: z.number().int().positive().optional(),
})

const createInstanceSchema = z.object({
  capacity: z.number().int().min(0).max(100).default(100),
  notes: z.string().optional(),
})

const updateInstanceSchema = z.object({
  capacity: z.number().int().min(0).max(100),
  notes: z.string().nullable().optional(),
})

export const resourceRoutes = createRouter()

resourceRoutes.use('*', requireAuth)

resourceRoutes.get('/', async (context) => {
  const resources = await resourceRepository.findMany()
  return context.json(ok(resources))
})

resourceRoutes.post('/', zValidator('json', createResourceSchema), async (context) => {
  const userId = context.get('userId')
  const { name, category, unit, notes, minUnits, initialCount } = context.req.valid('json')

  const resource = await resourceRepository.create({
    name,
    category,
    unit,
    notes,
    minUnits,
    createdById: userId,
  })

  const instancePromises = Array.from({ length: initialCount }, () =>
    resourceRepository.addInstance({ resourceId: resource.id, capacity: 100 }),
  )
  await Promise.all(instancePromises)

  const refreshed = await resourceRepository.findById(resource.id)
  return context.json(created(refreshed), 201)
})

resourceRoutes.put('/:id', zValidator('json', updateResourceSchema), async (context) => {
  const resourceId = context.req.param('id')
  const updates = context.req.valid('json')

  const existing = await resourceRepository.findById(resourceId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Recurso não encontrado'), 404)
  }

  const updateData = {
    ...(updates.name !== undefined && { name: updates.name }),
    ...(updates.category !== undefined && { category: updates.category }),
    ...(updates.unit !== undefined && { unit: updates.unit }),
    ...(updates.notes !== undefined && { notes: updates.notes }),
    ...(updates.minUnits !== undefined && { minUnits: updates.minUnits }),
  }

  const resource = await resourceRepository.update(resourceId, updateData)
  return context.json(ok(resource))
})

resourceRoutes.delete('/:id', async (context) => {
  const resourceId = context.req.param('id')

  const existing = await resourceRepository.findById(resourceId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Recurso não encontrado'), 404)
  }

  await resourceRepository.remove(resourceId)
  return context.json(ok(null))
})

resourceRoutes.post('/:id/instances', zValidator('json', createInstanceSchema), async (context) => {
  const resourceId = context.req.param('id')
  const { capacity, notes } = context.req.valid('json')

  const existing = await resourceRepository.findById(resourceId)
  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Recurso não encontrado'), 404)
  }

  const instance = await resourceRepository.addInstance({ resourceId, capacity, notes })
  return context.json(created(instance), 201)
})

resourceRoutes.patch('/instances/:instanceId', zValidator('json', updateInstanceSchema), async (context) => {
  const instanceId = context.req.param('instanceId')
  const { capacity, notes } = context.req.valid('json')

  const updateData = {
    capacity,
    ...(notes !== undefined && { notes }),
  }

  const instance = await resourceRepository.updateInstance(instanceId, updateData)
  return context.json(ok(instance))
})

resourceRoutes.delete('/instances/:instanceId', async (context) => {
  const instanceId = context.req.param('instanceId')
  await resourceRepository.removeInstance(instanceId)
  return context.json(ok(null))
})
