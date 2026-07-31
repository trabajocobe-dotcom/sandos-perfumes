'use client'

import { useState, useEffect } from 'react'
import { Shield, Plus, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { Select } from '@/components/ui/Select'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole, AuthUser } from '@/lib/auth-types'



const roleOptions = [
  { value: 'admin', label: 'Admin — gestiona productos, pedidos, inventario' },
  { value: 'viewer', label: 'Visor — solo lectura del dashboard' },
]

export default function UsersPage() {
  const { user, getUsers, createUser, updateRole, deleteUser } = useAuth()
  const [users, setUsers] = useState<AuthUser[]>([])
  const [showModal, setShowModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [newName, setNewName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('admin')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const refresh = async () => setUsers(await getUsers())

  // El listado vive en localStorage: se puede leer recién una vez montado.
  useEffect(() => {
    let active = true
    getUsers().then((list) => {
      if (active) setUsers(list)
    })
    return () => {
      active = false
    }
  }, [getUsers])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await createUser(newEmail, newName, newPassword, newRole)
      setSuccess('Usuario creado correctamente')
      setNewEmail('')
      setNewName('')
      setNewPassword('')
      setNewRole('admin')
      await refresh()
      setTimeout(() => setShowModal(false), 800)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario')
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateRole(userId, newRole as UserRole)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await deleteUser(userId)
      await refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error')
    }
  }

  if (user?.role !== 'super-admin') {
    return (
      <div className="py-16 text-center">
        <Shield className="mx-auto size-8 text-bone-3" />
        <p className="mt-3 text-sm text-bone-2">
          Solo un Super Admin puede gestionar usuarios.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-bone">Usuarios</h2>
          <p className="text-sm text-bone-2">{users.length} usuarios registrados</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus className="size-4" /> Nuevo usuario
        </Button>
      </div>

      {success && (
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                <th className="p-4">Usuario</th>
                <th className="p-4">Email</th>
                <th className="p-4">Rol</th>
                <th className="p-4">Creado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-ink-line hover:bg-ink-sunken/50 transition-colors">
                  <td className="p-4 font-medium text-bone">{u.name}</td>
                  <td className="p-4 text-bone-2">{u.email}</td>
                  <td className="p-4">
                    {u.role === 'super-admin' ? (
                      <Badge variant="gilt">Super Admin</Badge>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="rounded-lg border border-ink-line bg-ink-raised px-2 py-1 text-xs text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none cursor-pointer"
                      >
                        <option value="admin">Admin</option>
                        <option value="viewer">Visor</option>
                      </select>
                    )}
                  </td>
                  <td className="p-4 text-bone-2 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('es-CO')}
                  </td>
                  <td className="p-4">
                    {u.role !== 'super-admin' && (
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="p-1.5 text-bone-3 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Dialog open={showModal} onClose={() => setShowModal(false)} title="Nuevo usuario">
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Nombre"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre completo"
              required
            />
            <Input
              label="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="usuario@email.com"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Select
              label="Rol"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              options={roleOptions}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear usuario</Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  )
}
