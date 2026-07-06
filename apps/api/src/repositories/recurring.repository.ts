import { prisma } from '../db/client.ts'
import { RecurringFrequency } from '@homework/types/recurring.enum'
import type { RecurringTemplate } from '@homework/types/recurring.interface'
import type { RecurringRow, RecurringCreateData, RecurringUpdateData } from './recurring.types.ts'

function mapRecurring(row: RecurringRow): RecurringTemplate {
  const frequency = row.frequency as RecurringFrequency
  const recurring = {
    id: row.id,
    title: row.title,
    description: row.description,
    assignedToId: row.assignedToId,
    assignedToName: row.assignedTo.name,
    frequency,
    nextDue: row.nextDue.toISOString(),
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
  }
  return recurring
}

export class RecurringRepository {
  async findMany(): Promise<RecurringTemplate[]> {
    const rows = await prisma.recurringTemplate.findMany({
      include: { assignedTo: { select: { name: true } } },
      orderBy: { nextDue: 'asc' },
    })

    return rows.map(mapRecurring)
  }

  async findById(id: string): Promise<RecurringTemplate | null> {
    const row = await prisma.recurringTemplate.findUnique({
      where: { id },
      include: { assignedTo: { select: { name: true } } },
    })

    const isNotFound = !row
    if (isNotFound) return null

    return mapRecurring(row)
  }

  async create(data: RecurringCreateData): Promise<RecurringTemplate> {
    const row = await prisma.recurringTemplate.create({
      data,
      include: { assignedTo: { select: { name: true } } },
    })
    return mapRecurring(row)
  }

  async update(id: string, data: RecurringUpdateData): Promise<RecurringTemplate> {
    const row = await prisma.recurringTemplate.update({
      where: { id },
      data,
      include: { assignedTo: { select: { name: true } } },
    })
    return mapRecurring(row)
  }

  async remove(id: string): Promise<void> {
    await prisma.recurringTemplate.delete({ where: { id } })
  }
}

export const recurringRepository = new RecurringRepository()
