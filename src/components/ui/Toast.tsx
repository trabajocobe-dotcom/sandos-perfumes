'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Check, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = nextId++
      setToasts((prev) => [...prev.slice(-2), { id, message, type }])
      window.setTimeout(() => dismiss(id), 3600)
    },
    [dismiss]
  )

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* aria-live: el lector de pantalla anuncia el aviso sin robar el foco */}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex flex-col items-center gap-2 sm:bottom-6 sm:left-auto sm:right-6 sm:items-end"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'animate-rise pointer-events-auto flex items-center gap-3 rounded-brand border px-4 py-3',
              'bg-ink-raised text-[14px] shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
              t.type === 'success' ? 'border-gilt/35' : 'border-rust/50'
            )}
          >
            {t.type === 'success' ? (
              <Check className="size-4 shrink-0 text-gilt" strokeWidth={2} />
            ) : (
              <TriangleAlert className="size-4 shrink-0 text-rust" strokeWidth={2} />
            )}
            <span className="text-bone">{t.message}</span>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="ml-1 text-bone-3 transition-colors hover:text-bone"
              aria-label="Cerrar aviso"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
