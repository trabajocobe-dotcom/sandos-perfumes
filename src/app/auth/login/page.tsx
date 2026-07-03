'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // TODO Supabase: implementar sign in with email
    // const { error } = await supabase.auth.signInWithOtp({ email })
    // if (error) setMessage(error.message)
    // else setMessage('Revisá tu correo para el enlace mágico')

    // Demo:
    setTimeout(() => {
      setMessage('Demo: conectá Supabase para habilitar el login')
      setLoading(false)
    }, 1000)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)

    // TODO Supabase: implementar sign in with Google
    // const { error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: { redirectTo: `${location.origin}/auth/callback` }
    // })
    // if (error) console.error(error)

    // Demo:
    setTimeout(() => {
      setMessage('Demo: conectá Supabase para habilitar Google Auth')
      setLoading(false)
    }, 1000)
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
            Iniciá sesión para ver tus pedidos y más.
          </p>

          <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" disabled={loading}>
              <Mail className="size-4" />
              {loading ? 'Enviando…' : 'Ingresar con email'}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-warm-gray-light">o</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="size-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Ingresar con Google
          </Button>

          {message && (
            <p className="mt-4 text-center text-xs text-warm-gray">{message}</p>
          )}
        </Card>

        <p className="mt-4 text-center text-xs text-warm-gray-light">
          Al ingresar, aceptás nuestros términos y condiciones.
        </p>
      </div>
    </div>
  )
}
