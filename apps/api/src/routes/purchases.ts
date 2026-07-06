import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.ts'
import { purchaseRepository } from '../repositories/purchase.repository.ts'
import { ok, created } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'

const createPurchaseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().positive(),
  month: z.string().min(1),
  splitWithIds: z.array(z.string()).optional(),
})

const listQuerySchema = z.object({
  month: z.string().optional(),
})

export const purchaseRoutes = createRouter()

purchaseRoutes.use('*', requireAuth)

purchaseRoutes.get('/', zValidator('query', listQuerySchema), async (context) => {
  const { month } = context.req.valid('query')
  const purchases = await purchaseRepository.findMany(month)
  return context.json(ok(purchases))
})

purchaseRoutes.post('/', zValidator('json', createPurchaseSchema), async (context) => {
  const userId = context.get('userId')
  const { title, amount, month, splitWithIds } = context.req.valid('json')

  const splitWithString = JSON.stringify(splitWithIds ?? [])

  const purchase = await purchaseRepository.create({
    title,
    amount,
    month,
    paidById: userId,
    splitWith: splitWithString,
  })

  return context.json(created(purchase), 201)
})
