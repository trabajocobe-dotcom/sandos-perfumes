'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowLeft, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const ok = await login(email, password)
    if (ok) {
      router.push('/dashboard')
    } else {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        <Card className="p-6">
          <h1 className="font-serif text-2xl font-bold text-charcoal">Ingresar</h1>
          <p className="mt-1 text-sm text-warm-gray">
            Iniciá sesión con tu email y contraseña.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
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
        </Card>

        <p className="mt-4 text-center text-xs text-warm-gray-light">
          ¿Administrador? Usá tu email y contraseña para acceder al dashboard.
        </p>
      </div>
    </div>
  )
}
