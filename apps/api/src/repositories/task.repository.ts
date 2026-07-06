import { prisma } from '../db/client.ts'
import { TaskStatus } from '@homework/types/task.enum'
import type { Task } from '@homework/types/task.interface'
import type { TaskRow, TaskCreateData, TaskUpdateData, TaskListFilters, ResourceSnapshotData } from './task.types.ts'

const TASK_INCLUDE = {
  assignedTo: { select: { name: true } },
  taskResources: { select: { resourceId: true } },
} as const

function mapTask(row: TaskRow): Task {
  const task = {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    assignedToId: row.assignedToId,
    assignedToName: row.assignedTo.name,
    createdById: row.createdById,
    dueDate: row.dueDate?.toISOString() ?? null,
    completedAt: row.completedAt?.toISOString() ?? null,
    startedAt: row.startedAt?.toISOString() ?? null,
    finishedAt: row.finishedAt?.toISOString() ?? null,
    durationMinutes: row.durationMinutes,
    isRecurring: row.isRecurring,
    recurringTemplateId: row.recurringTemplateId,
    createdAt: row.createdAt.toISOString(),
    resourceIds: row.taskResources.map((taskResource) => taskResource.resourceId),
  }
  return task
}

export class TaskRepository {
  async findMany(filters: TaskListFilters = {}): Promise<Task[]> {
    const whereClause = {
      ...(filters.status !== undefined && { status: filters.status }),
      ...(filters.assignedToId !== undefined && { assignedToId: filters.assignedToId }),
    }

    const rows = await prisma.task.findMany({
      where: whereClause,
      include: TASK_INCLUDE,
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    })

    return rows.map(mapTask)
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } })
  }

  async create(data: TaskCreateData, resourceIds: string[] = []): Promise<Task> {
    const row = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        assignedToId: data.assignedToId,
        createdById: data.createdById,
        dueDate: data.dueDate,
        taskResources: {
          create: resourceIds.map((resourceId) => ({ resourceId })),
        },
      },
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async update(id: string, data: TaskUpdateData): Promise<Task> {
    const row = await prisma.task.update({
      where: { id },
      data,
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async start(id: string): Promise<Task> {
    const now = new Date()
    const row = await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.InProgress, startedAt: now },
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async pause(id: string): Promise<Task> {
    const row = await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.Paused },
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async resume(id: string): Promise<Task> {
    const row = await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.InProgress },
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async cancel(id: string): Promise<Task> {
    const row = await prisma.task.update({
      where: { id },
      data: { status: TaskStatus.Cancelled },
      include: TASK_INCLUDE,
    })
    return mapTask(row)
  }

  async finish(id: string, snapshots: ResourceSnapshotData[]): Promise<Task> {
    const now = new Date()

    const existing = await prisma.task.findUnique({ where: { id }, select: { startedAt: true } })
    const hasStartTime = existing?.startedAt != null
    const durationMinutes = hasStartTime
      ? Math.round((now.getTime() - existing.startedAt.getTime()) / 60000)
      : null

    const row = await prisma.$transaction(async (transaction) => {
      for (const snapshot of snapshots) {
        await transaction.resourceSnapshot.create({
          data: {
            taskId: id,
            resourceId: snapshot.resourceId,
            resourceInstanceId: snapshot.instanceId,
            capacityBefore: snapshot.capacityBefore,
            capacityAfter: snapshot.capacityAfter,
          },
        })
        await transaction.resourceInstance.update({
          where: { id: snapshot.instanceId },
          data: { capacity: snapshot.capacityAfter },
        })
      }

      return transaction.task.update({
        where: { id },
        data: {
          status: TaskStatus.Done,
          finishedAt: now,
          completedAt: now,
          durationMinutes,
        },
        include: TASK_INCLUDE,
      })
    })

    return mapTask(row)
  }

  async remove(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } })
  }
}

export const taskRepository = new TaskRepository()
