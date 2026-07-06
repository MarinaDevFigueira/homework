import { prisma } from '../db/client.ts'
import { TaskStatus } from '@homework/types/task.enum'
import type { Task } from '@homework/types/task.interface'
import type { TaskRow, TaskCreateData, TaskUpdateData, TaskListFilters } from './task.types.ts'

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
    isRecurring: row.isRecurring,
    recurringTemplateId: row.recurringTemplateId,
    createdAt: row.createdAt.toISOString(),
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
      include: { assignedTo: { select: { name: true } } },
      orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    })

    return rows.map(mapTask)
  }

  async findById(id: string) {
    return prisma.task.findUnique({ where: { id } })
  }

  async create(data: TaskCreateData): Promise<Task> {
    const row = await prisma.task.create({
      data,
      include: { assignedTo: { select: { name: true } } },
    })
    return mapTask(row)
  }

  async update(id: string, data: TaskUpdateData): Promise<Task> {
    const row = await prisma.task.update({
      where: { id },
      data,
      include: { assignedTo: { select: { name: true } } },
    })
    return mapTask(row)
  }

  async remove(id: string): Promise<void> {
    await prisma.task.delete({ where: { id } })
  }
}

export const taskRepository = new TaskRepository()
