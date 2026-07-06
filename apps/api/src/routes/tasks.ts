import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.ts'
import { TaskStatus } from '@homework/types/task.enum'
import { taskRepository } from '../repositories/task.repository.ts'
import { ok, created, notFound, forbidden } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToId: z.string().min(1),
  dueDate: z.string().datetime({ offset: true }).optional(),
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().min(1).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
})

const listQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().optional(),
})

export const taskRoutes = createRouter()

taskRoutes.use('*', requireAuth)

taskRoutes.get('/', zValidator('query', listQuerySchema), async (context) => {
  const { status, assignedToId } = context.req.valid('query')
  const tasks = await taskRepository.findMany({ status, assignedToId })
  return context.json(ok(tasks))
})

taskRoutes.post('/', zValidator('json', createTaskSchema), async (context) => {
  const userId = context.get('userId')
  const { title, description, assignedToId, dueDate } = context.req.valid('json')
  const dueDateValue = dueDate !== undefined ? new Date(dueDate) : undefined
  const task = await taskRepository.create({
    title,
    description,
    assignedToId,
    createdById: userId,
    dueDate: dueDateValue,
  })
  return context.json(created(task), 201)
})

taskRoutes.put('/:id', zValidator('json', updateTaskSchema), async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')
  const updates = context.req.valid('json')

  const existing = await taskRepository.findById(taskId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Tarefa não encontrada'), 404)
  }

  const isOwnerOrAssignee =
    existing.createdById === userId || existing.assignedToId === userId
  if (!isOwnerOrAssignee) {
    return context.json(forbidden('Acesso negado'), 403)
  }

  const isCompletingNow = updates.status === TaskStatus.Done
  const completedAt = isCompletingNow ? new Date() : existing.completedAt

  const updateData = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.status !== undefined && { status: updates.status, completedAt }),
    ...(updates.assignedToId !== undefined && { assignedToId: updates.assignedToId }),
    ...(updates.dueDate !== undefined && {
      dueDate: updates.dueDate !== null ? new Date(updates.dueDate) : null,
    }),
  }

  const task = await taskRepository.update(taskId, updateData)
  return context.json(ok(task))
})

taskRoutes.delete('/:id', async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')

  const existing = await taskRepository.findById(taskId)

  const isNotFound = !existing
  if (isNotFound) {
    return context.json(notFound('Tarefa não encontrada'), 404)
  }

  const isCreator = existing.createdById === userId
  if (!isCreator) {
    return context.json(forbidden('Apenas o criador pode excluir'), 403)
  }

  await taskRepository.remove(taskId)
  return context.json(ok(null))
})
