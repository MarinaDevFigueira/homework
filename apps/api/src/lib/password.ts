import { createHash, randomBytes, timingSafeEqual } from 'crypto'

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = createHash('sha256').update(`${salt}:${password}`).digest('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':')
  const computed = createHash('sha256').update(`${salt}:${password}`).digest('hex')
  const isEqualLength = computed.length === hash.length
  if (!isEqualLength) return false
  return timingSafeEqual(Buffer.from(computed), Buffer.from(hash))
}
