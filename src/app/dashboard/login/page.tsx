'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, Lock, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="haze left-1/2 top-1/2 h-[26rem] w-[32rem] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-[22rem]">
        <Link
          href="/"
          className="link-editorial mb-10 inline-flex items-center gap-2 text-[14px] text-bone-3"
        >
          <ArrowLeft className="size-3.5" />
          Volver a la tienda
        </Link>

        <div className="text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-brand border border-gilt/40 text-gilt">
            <Lock className="size-5" strokeWidth={1.5} />
          </span>
          <h1 className="mt-6 text-h2">Panel</h1>
          <p className="mt-2 text-[15px] text-bone-3">
            Ingresa con tu cuenta de administrador
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <Input
            label="Email"
            type="email"
            placeholder="admin@sandos.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <p role="alert" className="rounded-brand border border-rust/40 px-3 py-2 text-center text-[14px] text-rust">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <LogIn className="size-4" strokeWidth={2} />
            {loading ? 'Ingresando…' : 'Ingresar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[13px] text-bone-3">
          Cuenta de demostración: admin@sandos.com / admin123
        </p>
      </div>
    </div>
  )
}
