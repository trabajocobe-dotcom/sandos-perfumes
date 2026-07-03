'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Simular latencia
    setTimeout(() => {
      const ok = login(email, password)
      if (ok) {
        router.push('/dashboard')
      } else {
        setError('Email o contraseña incorrectos')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-charcoal">
            <Lock className="size-6 text-gold" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-charcoal">Dashboard</h1>
          <p className="mt-1 text-sm text-warm-gray">Ingresá con tu cuenta de administrador</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@sandos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="size-4" />
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-warm-gray-light">
            Demo: admin@sandos.com / admin123
          </p>
        </Card>
      </div>
    </div>
  )
}
