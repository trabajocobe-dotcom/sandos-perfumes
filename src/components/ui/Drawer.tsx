'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  /** Fila fija al pie (totales, CTA). No scrollea con el contenido. */
  footer?: React.ReactNode
  side?: 'right' | 'left'
  className?: string
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Panel lateral accesible: bloquea el scroll del fondo, atrapa el foco,
 * cierra con Escape y devuelve el foco al elemento que lo abrió.
 */
export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement

    // Bloqueo de scroll compensando el ancho de la barra para que no salte el layout.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const panel = panelRef.current
    panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panel) return

      const focusable = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80]" role="presentation">
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="animate-fade absolute inset-0 h-full w-full cursor-default bg-night/55 backdrop-blur-[2px]"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'animate-slide-in absolute top-0 flex h-full w-full max-w-[27rem] flex-col',
          'border-ink-line bg-ink shadow-[0_0_80px_rgba(0,0,0,0.6)]',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r',
          className
        )}
      >
        <header className="flex items-center justify-between border-b border-ink-line px-6 py-5">
          <h2 className="font-display text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 p-2 text-bone-3 transition-colors hover:text-bone"
            aria-label="Cerrar panel"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">{children}</div>

        {footer && (
          <footer className="border-t border-ink-line bg-ink-raised px-6 py-5">{footer}</footer>
        )}
      </div>
    </div>
  )
}
