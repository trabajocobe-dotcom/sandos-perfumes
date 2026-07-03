'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { AuthUser, UserRole } from '@/lib/auth-types'
import * as auth from '@/lib/supabase-auth'

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
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    auth.getSession().then((u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const u = await auth.login(email, password)
    if (u) setUser(u)
    return !!u
  }, [])

  const logout = useCallback(async () => {
    await auth.logout()
    setUser(null)
  }, [])

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user]
  )

  const createUser = useCallback(
    async (email: string, name: string, password: string, role: UserRole) => {
      if (!user) throw new Error('No autenticado')
      const newUser = await auth.createUser(user, email, name, password, role)
      return newUser
    },
    [user]
  )

  const getUsers = useCallback(async () => {
    if (!user) return []
    return auth.getUsersList()
  }, [user])

  const updateRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      if (!user) throw new Error('No autenticado')
      await auth.updateUserRole(user, userId, newRole)
    },
    [user]
  )

  const deleteUser = useCallback(
    async (userId: string) => {
      if (!user) throw new Error('No autenticado')
      await auth.deleteUser(user, userId)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        hasRole,
        createUser,
        getUsers,
        updateRole,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
