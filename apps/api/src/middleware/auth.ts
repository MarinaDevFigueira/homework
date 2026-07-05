import { getCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import { verifyToken } from '../lib/jwt.ts'
import { UserRole } from '@homework/types/user.enum'
import type { AppVariables } from '../types/hono.interface.ts'

export const requireAuth = createMiddleware<{ Variables: AppVariables }>(async (context, next) => {
  const token = getCookie(context, 'auth_token')

  const hasToken = !!token
  if (!hasToken) {
    return context.json({ data: null, error: 'Não autenticado' }, 401)
  }

  const payload = verifyToken(token)

  const isValidPayload = !!payload
  if (!isValidPayload) {
    return context.json({ data: null, error: 'Token inválido' }, 401)
  }

  context.set('userId', payload.userId)
  context.set('userRole', payload.role)

  await next()
})

export const requireAdmin = createMiddleware<{ Variables: AppVariables }>(async (context, next) => {
  const role = context.get('userRole')

  const isAdmin = role === UserRole.Admin
  if (!isAdmin) {
    return context.json({ data: null, error: 'Acesso restrito' }, 403)
  }

  await next()
})
