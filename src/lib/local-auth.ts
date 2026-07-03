/**
 * Autenticación local — reemplazar por Supabase Auth cuando esté lista.
 *
 * Roles:
 *   super-admin  → crea admins, acceso total
 *   admin        → gestiona productos, pedidos, inventario
 *   viewer       → solo lectura del dashboard
 *
 * Migración a Supabase:
 *   1. Reemplazar funciones internas por `supabase.auth` y `supabase.from('profiles')`
 *   2. Los roles se almacenan en la tabla `profiles.role`
 *   3. El login pasa a ser con Google OAuth + email magic link
 */

export type UserRole = 'super-admin' | 'admin' | 'viewer'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

const USERS_KEY = 'sandos_auth_users'
const SESSION_KEY = 'sandos_auth_session'

// Seed: super-admin por defecto (email: admin@sandos.com / pass: admin123)
function getUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  const seed: AuthUser[] = [
    {
      id: 'sa-1',
      email: 'admin@sandos.com',
      name: 'Super Admin',
      role: 'super-admin',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(seed))
  // Seed passwords (en producción van hasheadas con bcrypt o Supabase Auth)
  const pws: Record<string, string> = { 'sa-1': 'admin123' }
  localStorage.setItem('sandos_auth_passwords', JSON.stringify(pws))
  return seed
}

function getPasswords(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('sandos_auth_passwords') || '{}')
  } catch {
    return {}
  }
}

export function login(email: string, password: string): AuthUser | null {
  const users = getUsers()
  const user = users.find((u) => u.email === email.toLowerCase())
  if (!user) return null

  const pws = getPasswords()
  if (pws[user.id] !== password) return null

  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Solo super-admin puede crear/editar usuarios con rol admin o superior */
export function createUser(
  currentUser: AuthUser,
  email: string,
  name: string,
  password: string,
  role: UserRole
): AuthUser {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (role === 'super-admin') throw new Error('No puedes crear otro super-admin')

  const users = getUsers()
  if (users.find((u) => u.email === email.toLowerCase())) {
    throw new Error('El email ya existe')
  }

  const newUser: AuthUser = {
    id: `usr-${crypto.randomUUID().slice(0, 8)}`,
    email: email.toLowerCase(),
    name,
    role,
    createdAt: new Date().toISOString(),
  }

  const pws = getPasswords()
  pws[newUser.id] = password
  localStorage.setItem('sandos_auth_passwords', JSON.stringify(pws))

  users.push(newUser)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  return newUser
}

export function getUsersList(): AuthUser[] {
  return getUsers()
}

export function updateUserRole(currentUser: AuthUser, userId: string, newRole: UserRole): void {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (userId === currentUser.id) throw new Error('No puedes cambiar tu propio rol')
  if (newRole === 'super-admin') throw new Error('No puedes asignar super-admin')

  const users = getUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) throw new Error('Usuario no encontrado')
  if (users[idx].role === 'super-admin') throw new Error('No puedes modificar un super-admin')

  users[idx].role = newRole
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function deleteUser(currentUser: AuthUser, userId: string): void {
  if (currentUser.role !== 'super-admin') throw new Error('No autorizado')
  if (userId === currentUser.id) throw new Error('No puedes eliminarte a ti mismo')

  const users = getUsers()
  const target = users.find((u) => u.id === userId)
  if (!target) throw new Error('Usuario no encontrado')
  if (target.role === 'super-admin') throw new Error('No puedes eliminar un super-admin')

  const remaining = users.filter((u) => u.id !== userId)
  localStorage.setItem(USERS_KEY, JSON.stringify(remaining))

  const pws = getPasswords()
  delete pws[userId]
  localStorage.setItem('sandos_auth_passwords', JSON.stringify(pws))
}
