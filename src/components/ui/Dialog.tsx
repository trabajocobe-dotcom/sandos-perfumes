'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Modal del panel: cierra con Escape, atrapa el foco y bloquea el scroll de fondo. */
export function Dialog({ open, onClose, title, children }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return

    previouslyFocused.current = document.activeElement as HTMLElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = [...panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
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
      previouslyFocused.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-rise max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-brand border border-ink-line bg-ink-raised p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="font-display text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 rounded-brand p-1.5 text-bone-3 transition-colors hover:text-bone"
            aria-label="Cerrar"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
