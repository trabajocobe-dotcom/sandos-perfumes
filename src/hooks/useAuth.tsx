'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { AuthUser, UserRole } from '@/lib/local-auth'
import * as auth from '@/lib/local-auth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
  hasRole: (...roles: UserRole[]) => boolean
  createUser: (email: string, name: string, password: string, role: UserRole) => AuthUser
  getUsers: () => AuthUser[]
  updateRole: (userId: string, newRole: UserRole) => void
  deleteUser: (userId: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(auth.getSession())
    setLoading(false)
  }, [])

  const login = useCallback((email: string, password: string) => {
    const u = auth.login(email, password)
    if (u) setUser(u)
    return !!u
  }, [])

  const logout = useCallback(() => {
    auth.logout()
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
    (email: string, name: string, password: string, role: UserRole) => {
      if (!user) throw new Error('No autenticado')
      const newUser = auth.createUser(user, email, name, password, role)
      return newUser
    },
    [user]
  )

  const getUsers = useCallback(() => {
    if (!user) return []
    return auth.getUsersList()
  }, [user])

  const updateRole = useCallback(
    (userId: string, newRole: UserRole) => {
      if (!user) throw new Error('No autenticado')
      auth.updateUserRole(user, userId, newRole)
    },
    [user]
  )

  const deleteUser = useCallback(
    (userId: string) => {
      if (!user) throw new Error('No autenticado')
      auth.deleteUser(user, userId)
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
