'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, LogIn, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'

export default function DashboardLoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const ok = await login(email, password)
    if (ok) {
      router.push('/dashboard')
    } else {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-charcoal px-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />

      <div className="relative w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-cream/40 hover:text-cream transition-colors"
        >
          <ArrowLeft className="size-4" />
          Volver al inicio
        </Link>

        <div className="mb-6 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
            <Lock className="size-6 text-gold" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold text-cream">Dashboard</h1>
          <p className="mt-1 text-sm text-cream/50">Ingresá con tu cuenta de administrador</p>
        </div>

        <div className="rounded-2xl bg-glass-card p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="admin@sandos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-cream/5 border-cream/10 text-cream placeholder:text-cream/30"
              required
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-cream/5 border-cream/10 text-cream placeholder:text-cream/30"
              required
            />

            {error && (
              <p className="text-xs text-red-400 text-center bg-red-900/20 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              <LogIn className="size-4" />
              {loading ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-cream/30">
            Demo: admin@sandos.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}
