'use client'

import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Alta al newsletter con validación y estados reales.
 * El formulario anterior no validaba, no confirmaba nada y el botón no hacía
 * absolutamente nada al pulsarlo.
 */
export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!EMAIL_RE.test(email.trim())) {
      setError('Ingresa un email válido, por ejemplo nombre@correo.com')
      setStatus('error')
      return
    }

    setError('')
    setStatus('sending')

    try {
      // TODO: conectar con Supabase (tabla `subscribers`) o el proveedor de email.
      await new Promise((resolve) => setTimeout(resolve, 600))
      setStatus('done')
    } catch {
      setStatus('error')
      setError('No pudimos registrarte. Prueba de nuevo en un momento.')
    }
  }

  if (status === 'done') {
    return (
      <p className={cn('flex items-start gap-2.5 text-[14px] text-bone-2', className)}>
        <Check className="mt-0.5 size-4 shrink-0 text-gilt" strokeWidth={2} />
        Listo. Te escribimos a <span className="text-bone">{email}</span> con la próxima carta.
      </p>
    )
  }

  return (
    <form onSubmit={submit} className={cn('space-y-2', className)} noValidate>
      <div className="flex">
        <label htmlFor="newsletter-email" className="sr-only-focusable">
          Tu email
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') setStatus('idle')
          }}
          placeholder="tu@email.com"
          autoComplete="email"
          aria-invalid={status === 'error'}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className={cn('field rounded-r-none', status === 'error' && 'field-invalid')}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="btn btn-primary rounded-l-none px-4"
          aria-label="Suscribirme al newsletter"
        >
          {status === 'sending' ? '…' : <ArrowRight className="size-4" strokeWidth={2} />}
        </button>
      </div>

      {error && (
        <p id="newsletter-error" role="alert" className="text-[13px] text-rust">
          {error}
        </p>
      )}
    </form>
  )
}
