'use client'

import { createClient } from './supabase/client'
import { createAdminClient } from './supabase/admin'
import type { UserRole, AuthUser } from './auth-types'

function profileToUser(p: {
  id: string; email: string; name: string; role: string; created_at: string
}): AuthUser {
  return { id: p.id, email: p.email, name: p.name, role: p.role as UserRole, createdAt: p.created_at }
}

export async function login(email: string, password: string): Promise<AuthUser | null> {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
  return profile ? profileToUser(profile) : null
}

export async function logout(): Promise<void> {
  await createClient().auth.signOut()
}

export async function getSession(): Promise<AuthUser | null> {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
  return profile ? profileToUser(profile) : null
}

export async function createUser(
  currentUser: AuthUser, email: string, name: string, password: string, role: UserRole,
): Promise<AuthUser> {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (role === 'super-admin') throw new Error('No puedes crear otro super-admin')

  const admin = createAdminClient()
  const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name, role } })
  if (error || !data.user) throw new Error(error?.message ?? 'Error al crear usuario')

  await admin.from('profiles').upsert({ id: data.user.id, email, name, role })
  return { id: data.user.id, email, name, role, createdAt: new Date().toISOString() }
}

export async function getUsersList(): Promise<AuthUser[]> {
  const { data, error } = await createAdminClient().from('profiles').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map(profileToUser)
}

export async function updateUserRole(currentUser: AuthUser, userId: string, newRole: UserRole): Promise<void> {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (userId === currentUser.id) throw new Error('No puedes cambiar tu propio rol')
  if (newRole === 'super-admin') throw new Error('No puedes asignar super-admin')

  const { error } = await createAdminClient().from('profiles').update({ role: newRole }).eq('id', userId)
  if (error) throw new Error(error.message)
}

export async function deleteUser(currentUser: AuthUser, userId: string): Promise<void> {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (userId === currentUser.id) throw new Error('No puedes eliminarte a ti mismo')

  const admin = createAdminClient()
  const { error } = await admin.auth.admin.deleteUser(userId)
  if (error) throw new Error(error.message)
}
