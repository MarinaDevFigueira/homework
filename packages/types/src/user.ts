export enum UserRole {
  Admin = 'admin',
  Morador = 'morador',
}

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
