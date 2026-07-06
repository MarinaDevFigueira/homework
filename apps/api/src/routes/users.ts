import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { requireAuth } from '../middleware/auth.ts'
import { prisma } from '../db/client.ts'
import { userRepository } from '../repositories/user.repository.ts'
import { ok, forbidden, notFound } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'
import { UserRole } from '@homework/types/user.enum'

interface UserResponse {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
  createdAt: string
}

function mapUser(row: {
  id: string
  name: string
  email: string
  role: string
  avatarUrl: string | null
  createdAt: Date
}): UserResponse {
  const user = {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    avatarUrl: row.avatarUrl,
    createdAt: row.createdAt.toISOString(),
  }
  return user
}

const updateRoleSchema = z.object({
  role: z.nativeEnum(UserRole),
})

export const userRoutes = createRouter()

userRoutes.use('*', requireAuth)

userRoutes.get('/', async (context) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  })

  const mappedUsers = users.map(mapUser)
  return context.json(ok(mappedUsers))
})

userRoutes.put('/:id/role', zValidator('json', updateRoleSchema), async (context) => {
  const requesterId = context.get('userId')
  const requester = await userRepository.findById(requesterId)

  const isNotAdmin = requester?.role !== UserRole.Admin
  if (isNotAdmin) {
    return context.json(forbidden('Apenas administradores podem alterar roles'), 403)
  }

  const targetId = context.req.param('id')
  const isSelf = targetId === requesterId
  if (isSelf) {
    return context.json(forbidden('Não é possível alterar o próprio role'), 403)
  }

  const target = await userRepository.findById(targetId)
  const isNotFound = !target
  if (isNotFound) {
    return context.json(notFound('Usuário não encontrado'), 404)
  }

  const { role } = context.req.valid('json')
  const updated = await userRepository.updateRole(targetId, role)
  return context.json(ok(mapUser(updated)))
})

userRoutes.delete('/:id', async (context) => {
  const requesterId = context.get('userId')
  const requester = await userRepository.findById(requesterId)

  const isNotAdmin = requester?.role !== UserRole.Admin
  if (isNotAdmin) {
    return context.json(forbidden('Apenas administradores podem remover usuários'), 403)
  }

  const targetId = context.req.param('id')
  const isSelf = targetId === requesterId
  if (isSelf) {
    return context.json(forbidden('Não é possível remover a própria conta'), 403)
  }

  const target = await userRepository.findById(targetId)
  const isNotFound = !target
  if (isNotFound) {
    return context.json(notFound('Usuário não encontrado'), 404)
  }

  await userRepository.remove(targetId)
  return context.json(ok(null))
})
