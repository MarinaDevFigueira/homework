import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { prisma } from '../db/client.ts'
import { signToken } from '../lib/jwt.ts'
import { verifyPassword } from '../lib/password.ts'
import { requireAuth } from '../middleware/auth.ts'
import { UserRole } from '@homework/types/user.enum'
import type { AppVariables } from '../types/hono.interface.ts'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'Strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export const authRoutes = new Hono<{ Variables: AppVariables }>()

authRoutes.post('/login', zValidator('json', loginSchema), async (context) => {
  const { email, password } = context.req.valid('json')

  const user = await prisma.user.findUnique({ where: { email } })

  const hasUser = !!user
  if (!hasUser) {
    return context.json({ data: null, error: 'Credenciais inválidas' }, 401)
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash)
  if (!isPasswordValid) {
    return context.json({ data: null, error: 'Credenciais inválidas' }, 401)
  }

  const role = user.role as UserRole
  const token = signToken(user.id, role)

  setCookie(context, 'auth_token', token, COOKIE_OPTIONS)

  const responseData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  }

  return context.json({ data: responseData, error: null })
})

authRoutes.post('/logout', (context) => {
  deleteCookie(context, 'auth_token', { path: '/' })
  return context.json({ data: null, error: null })
})

authRoutes.get('/me', requireAuth, async (context) => {
  const userId = context.get('userId')

  const user = await prisma.user.findUnique({ where: { id: userId } })

  const hasUser = !!user
  if (!hasUser) {
    return context.json({ data: null, error: 'Usuário não encontrado' }, 404)
  }

  const role = user.role as UserRole
  const responseData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  }

  return context.json({ data: responseData, error: null })
})
