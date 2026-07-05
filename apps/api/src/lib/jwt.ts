import { createHmac, timingSafeEqual } from 'crypto'
import { UserRole } from '@homework/types/user.enum'

interface JwtPayload {
  userId: string
  role: UserRole
  exp: number
}

const ONE_DAY_MS = 86400

function getSecret(): string {
  const secret = process.env.JWT_SECRET
  const hasSecret = !!secret
  if (!hasSecret) throw new Error('JWT_SECRET não configurado')
  return secret
}

function base64url(input: string): string {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function base64urlDecode(input: string): string {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (input.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

export function signToken(userId: string, role: UserRole): string {
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const now = Math.floor(Date.now() / 1000)
  const expiration = now + ONE_DAY_MS * 7
  const payloadData: JwtPayload = { userId, role, exp: expiration }
  const payload = base64url(JSON.stringify(payloadData))
  const signature = createHmac('sha256', getSecret())
    .update(`${header}.${payload}`)
    .digest('base64url')
  return `${header}.${payload}.${signature}`
}

export function verifyToken(token: string): JwtPayload | null {
  const parts = token.split('.')
  const isValidFormat = parts.length === 3
  if (!isValidFormat) return null

  const [header, payload, signature] = parts
  const expectedSignature = createHmac('sha256', getSecret())
    .update(`${header}.${payload}`)
    .digest('base64url')

  const isValidSignature = timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature),
  )
  if (!isValidSignature) return null

  const parsed: JwtPayload = JSON.parse(base64urlDecode(payload))
  const isExpired = parsed.exp < Math.floor(Date.now() / 1000)
  if (isExpired) return null

  return parsed
}
