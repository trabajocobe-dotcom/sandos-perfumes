'use client'

import { createContext, useContext, useMemo, useState } from 'react'
import { useIsHydrated } from '@/hooks/useClientValue'
import * as auth from '@/lib/local-auth'
import type { AuthUser, UserRole } from '@/lib/auth-types'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  isAuthenticated: boolean
  hasRole: (...roles: UserRole[]) => boolean
  createUser: (email: string, name: string, password: string, role: UserRole) => Promise<AuthUser>
  getUsers: () => Promise<AuthUser[]>
  updateRole: (userId: string, newRole: UserRole) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useIsHydrated()
  // La sesión vive en localStorage: solo se puede leer una vez hidratados.
  const [session, setSession] = useState<AuthUser | null>(null)
  const user = hydrated ? (session ?? auth.getSession()) : null

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading: !hydrated,
      isAuthenticated: Boolean(user),

      login: async (email, password) => {
        const found = auth.login(email, password)
        if (found) setSession(found)
        return Boolean(found)
      },

      logout: async () => {
        auth.logout()
        setSession(null)
      },

      hasRole: (...roles) => (user ? roles.includes(user.role) : false),

      createUser: async (email, name, password, role) => {
        if (!user) throw new Error('No autenticado')
        return auth.createUser(user, email, name, password, role)
      },

      getUsers: async () => (user ? auth.getUsersList() : []),

      updateRole: async (userId, newRole) => {
        if (!user) throw new Error('No autenticado')
        auth.updateUserRole(user, userId, newRole)
      },

      deleteUser: async (userId) => {
        if (!user) throw new Error('No autenticado')
        auth.deleteUser(user, userId)
      },
    }),
    [user, hydrated]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
