import { setCookie, deleteCookie } from 'hono/cookie'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { signToken } from '../lib/jwt.ts'
import { verifyPassword } from '../lib/password.ts'
import { requireAuth } from '../middleware/auth.ts'
import { UserRole } from '@homework/types/user.enum'
import { userRepository } from '../repositories/user.repository.ts'
import { ok, unauthorized, notFound } from '../lib/response.ts'
import { createRouter } from '../lib/router.ts'

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

function mapUserSession(user: { id: string; name: string; email: string; role: string; avatarUrl: string | null; createdAt: Date }) {
  const sessionData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as UserRole,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt.toISOString(),
  }
  return sessionData
}

export const authRoutes = createRouter()

authRoutes.post('/login', zValidator('json', loginSchema), async (context) => {
  const { email, password } = context.req.valid('json')

  const user = await userRepository.findByEmail(email)

  const hasUser = !!user
  if (!hasUser) {
    return context.json(unauthorized('Credenciais inválidas'), 401)
  }

  const isPasswordValid = verifyPassword(password, user.passwordHash)
  if (!isPasswordValid) {
    return context.json(unauthorized('Credenciais inválidas'), 401)
  }

  const role = user.role as UserRole
  const token = signToken(user.id, role)

  setCookie(context, 'auth_token', token, COOKIE_OPTIONS)

  return context.json(ok(mapUserSession(user)))
})

authRoutes.post('/logout', (context) => {
  deleteCookie(context, 'auth_token', { path: '/' })
  return context.json(ok(null))
})

authRoutes.get('/me', requireAuth, async (context) => {
  const userId = context.get('userId')

  const user = await userRepository.findById(userId)

  const hasUser = !!user
  if (!hasUser) {
    return context.json(notFound('Usuário não encontrado'), 404)
  }

  return context.json(ok(mapUserSession(user)))
})
