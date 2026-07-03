export type UserRole = 'super-admin' | 'admin' | 'viewer'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}
