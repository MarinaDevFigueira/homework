import { prisma } from '../db/client.ts'
import type { Purchase } from '@homework/types/purchase.interface'
import type { PurchaseRow, PurchaseCreateData } from './purchase.types.ts'

function mapPurchase(row: PurchaseRow): Purchase {
  const splitWithIds = JSON.parse(row.splitWith)
  const purchase = {
    id: row.id,
    title: row.title,
    amount: row.amount,
    month: row.month,
    paidById: row.paidById,
    paidByName: row.paidBy.name,
    splitWithIds,
    receiptUrl: row.receiptUrl,
    createdAt: row.createdAt.toISOString(),
  }
  return purchase
}

export class PurchaseRepository {
  async findMany(month?: string): Promise<Purchase[]> {
    const whereClause = month !== undefined ? { month } : {}

    const rows = await prisma.purchase.findMany({
      where: whereClause,
      include: { paidBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    })

    return rows.map(mapPurchase)
  }

  async create(data: PurchaseCreateData): Promise<Purchase> {
    const row = await prisma.purchase.create({
      data,
      include: { paidBy: { select: { name: true } } },
    })
    return mapPurchase(row)
  }
}

export const purchaseRepository = new PurchaseRepository()
