import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.ts'
import { RecurringFrequency } from '@homework/types/recurring.enum'
import { recurringRepository } from '../repositories/recurring.repository.ts'
import { ok, created, notFound } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'

const createRecurringSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToId: z.string().min(1),
  frequency: z.nativeEnum(RecurringFrequency),
  startDate: z.string().datetime({ offset: true }),
})

const updateRecurringSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  frequency: z.nativeEnum(RecurringFrequency).optional(),
  isActive: z.boolean().optional(),
  assignedToId: z.string().min(1).optional(),
})

export const recurringRoutes = createRouter()

recurringRoutes.use('*', requireAuth)

recurringRoutes.get('/', async (context) => {
  const templates = await recurringRepository.findMany()
  return context.json(ok(templates))
})

recurringRoutes.post('/', zValidator('json', createRecurringSchema), async (context) => {
  const { title, description, assignedToId, frequency, startDate } = context.req.valid('json')

  const nextDueDate = new Date(startDate)

  const template = await recurringRepository.create({
    title,
    description: description ?? undefined,
    assignedToId,
    frequency,
    nextDue: nextDueDate,
    isActive: true,
  })

  return context.json(created(template), 201)
})

recurringRoutes.put('/:id', zValidator('json', updateRecurringSchema), async (context) => {
  const templateId = context.req.param('id')
  const updates = context.req.valid('json')

  const existing = await recurringRepository.findById(templateId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Template recorrente não encontrado'), 404)
  }

  const updateData = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.frequency !== undefined && { frequency: updates.frequency }),
    ...(updates.isActive !== undefined && { isActive: updates.isActive }),
    ...(updates.assignedToId !== undefined && { assignedToId: updates.assignedToId }),
  }

  const template = await recurringRepository.update(templateId, updateData)
  return context.json(ok(template))
})

recurringRoutes.delete('/:id', async (context) => {
  const templateId = context.req.param('id')

  const existing = await recurringRepository.findById(templateId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Template recorrente não encontrado'), 404)
  }

  await recurringRepository.remove(templateId)
  return context.json(ok(null))
})
