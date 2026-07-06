import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth, requireAdmin } from '../middleware/auth.ts'
import { TaskStatus } from '@homework/types/task.enum'
import { taskRepository } from '../repositories/task.repository.ts'
import { ok, created, notFound, forbidden } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  assignedToId: z.string().min(1),
  dueDate: z.string().datetime({ offset: true }).optional(),
  resourceIds: z.array(z.string()).optional(),
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assignedToId: z.string().min(1).optional(),
  dueDate: z.string().datetime({ offset: true }).nullable().optional(),
})

const listQuerySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  assignedToId: z.string().optional(),
})

const finishSchema = z.object({
  resourceSnapshots: z.array(
    z.object({
      instanceId: z.string(),
      resourceId: z.string(),
      capacityBefore: z.number().int().min(0).max(100),
      capacityAfter: z.number().int().min(0).max(100),
    }),
  ).default([]),
})

export const taskRoutes = createRouter()

taskRoutes.use('*', requireAuth)

taskRoutes.get('/', zValidator('query', listQuerySchema), async (context) => {
  const { status, assignedToId } = context.req.valid('query')
  const tasks = await taskRepository.findMany({ status, assignedToId })
  return context.json(ok(tasks))
})

taskRoutes.post('/', requireAdmin, zValidator('json', createTaskSchema), async (context) => {
  const userId = context.get('userId')
  const { title, description, assignedToId, dueDate, resourceIds } = context.req.valid('json')
  const dueDateValue = dueDate !== undefined ? new Date(dueDate) : undefined
  const task = await taskRepository.create(
    { title, description, assignedToId, createdById: userId, dueDate: dueDateValue },
    resourceIds ?? [],
  )
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

  const isOwnerOrAssignee = existing.createdById === userId || existing.assignedToId === userId
  if (!isOwnerOrAssignee) {
    return context.json(forbidden('Acesso negado'), 403)
  }

  const updateData = {
    ...(updates.title !== undefined && { title: updates.title }),
    ...(updates.description !== undefined && { description: updates.description }),
    ...(updates.assignedToId !== undefined && { assignedToId: updates.assignedToId }),
    ...(updates.dueDate !== undefined && {
      dueDate: updates.dueDate !== null ? new Date(updates.dueDate) : null,
    }),
  }

  const task = await taskRepository.update(taskId, updateData)
  return context.json(ok(task))
})

taskRoutes.post('/:id/start', async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')

  const existing = await taskRepository.findById(taskId)
  const isNotFound = !existing
  if (isNotFound) return context.json(notFound('Tarefa não encontrada'), 404)

  const isAssigneeOrCreator = existing.assignedToId === userId || existing.createdById === userId
  if (!isAssigneeOrCreator) return context.json(forbidden('Acesso negado'), 403)

  const isNotPending = existing.status !== TaskStatus.Pending
  if (isNotPending) return context.json({ success: false, error: 'Tarefa não está pendente' }, 400)

  const task = await taskRepository.start(taskId)
  return context.json(ok(task))
})

taskRoutes.post('/:id/pause', async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')

  const existing = await taskRepository.findById(taskId)
  const isNotFound = !existing
  if (isNotFound) return context.json(notFound('Tarefa não encontrada'), 404)

  const isAssigneeOrCreator = existing.assignedToId === userId || existing.createdById === userId
  if (!isAssigneeOrCreator) return context.json(forbidden('Acesso negado'), 403)

  const isNotInProgress = existing.status !== TaskStatus.InProgress
  if (isNotInProgress) return context.json({ success: false, error: 'Tarefa não está em progresso' }, 400)

  const task = await taskRepository.pause(taskId)
  return context.json(ok(task))
})

taskRoutes.post('/:id/resume', async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')

  const existing = await taskRepository.findById(taskId)
  const isNotFound = !existing
  if (isNotFound) return context.json(notFound('Tarefa não encontrada'), 404)

  const isAssigneeOrCreator = existing.assignedToId === userId || existing.createdById === userId
  if (!isAssigneeOrCreator) return context.json(forbidden('Acesso negado'), 403)

  const isNotPaused = existing.status !== TaskStatus.Paused
  if (isNotPaused) return context.json({ success: false, error: 'Tarefa não está pausada' }, 400)

  const task = await taskRepository.resume(taskId)
  return context.json(ok(task))
})

taskRoutes.post('/:id/cancel', requireAdmin, async (context) => {
  const taskId = context.req.param('id')

  const existing = await taskRepository.findById(taskId)
  const isNotFound = !existing
  if (isNotFound) return context.json(notFound('Tarefa não encontrada'), 404)

  const isTerminal = existing.status === TaskStatus.Done || existing.status === TaskStatus.Cancelled
  if (isTerminal) return context.json({ success: false, error: 'Tarefa já finalizada' }, 400)

  const task = await taskRepository.cancel(taskId)
  return context.json(ok(task))
})

taskRoutes.post('/:id/finish', zValidator('json', finishSchema), async (context) => {
  const userId = context.get('userId')
  const taskId = context.req.param('id')
  const { resourceSnapshots } = context.req.valid('json')

  const existing = await taskRepository.findById(taskId)
  const isNotFound = !existing
  if (isNotFound) return context.json(notFound('Tarefa não encontrada'), 404)

  const isAssigneeOrCreator = existing.assignedToId === userId || existing.createdById === userId
  if (!isAssigneeOrCreator) return context.json(forbidden('Acesso negado'), 403)

  const isActive = existing.status === TaskStatus.InProgress || existing.status === TaskStatus.Paused
  if (!isActive) return context.json({ success: false, error: 'Tarefa não pode ser finalizada' }, 400)

  const task = await taskRepository.finish(taskId, resourceSnapshots)
  return context.json(ok(task))
})

taskRoutes.delete('/:id', requireAdmin, async (context) => {
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
