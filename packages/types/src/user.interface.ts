import type { UserRole } from './user.enum.ts'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarUrl: string | null
  createdAt: string
}

export interface UserSession {
  user: User
  token: string
}
