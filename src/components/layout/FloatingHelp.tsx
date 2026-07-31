'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowUp, MessageCircle, Sparkles, X } from 'lucide-react'
import { SITE } from '@/lib/site'
import { whatsappGeneral } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

/**
 * Ayuda flotante. Sustituye al "asistente virtual" anterior, que simulaba ser
 * un bot y respondía con frases fijas: prometía una conversación que no existía.
 * Aquí las dos salidas son reales — WhatsApp con una persona, o el test.
 */
export function FloatingHelp() {
  const [open, setOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > window.innerHeight)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    /* El `bottom` sale de una variable y no de una utilidad de Tailwind: cuando
       aparece la barra de compra en teléfono hay que subir el globo, y una
       utilidad de la capa `utilities` le gana a cualquier regla de componente
       por más específica que sea. */
    <div className="globo-ayuda no-print fixed right-5 z-[60] flex flex-col items-end gap-3">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="animate-fade grid size-10 place-items-center rounded-brand border border-ink-line bg-ink/90 text-bone-3 backdrop-blur transition-colors hover:text-bone"
          aria-label="Volver arriba"
        >
          <ArrowUp className="size-4" strokeWidth={1.5} />
        </button>
      )}

      {open && (
        <div
          id="floating-help-panel"
          className="animate-rise w-[min(19rem,calc(100vw-2.5rem))] border border-ink-line bg-ink-raised p-5"
        >
          <p className="font-display text-h3">¿Necesitas una mano?</p>
          <p className="mt-2 text-[14px] leading-relaxed text-bone-3">
            Te ayudamos a elegir según lo que ya usas, la ocasión y el presupuesto.
          </p>

          <div className="mt-5 grid gap-2">
            <a
              href={whatsappGeneral()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              <MessageCircle className="size-4" strokeWidth={2} />
              Escribirnos
            </a>
            <Link href="/quiz" onClick={() => setOpen(false)} className="btn btn-quiet w-full">
              <Sparkles className="size-4" strokeWidth={1.5} />
              Hacer el test
            </Link>
          </div>

          <p className="mt-4 text-[13px] text-bone-3">{SITE.contact.hours}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="floating-help-panel"
        aria-label={open ? 'Cerrar ayuda' : 'Abrir ayuda'}
        className={cn(
          'grid size-[3.25rem] place-items-center rounded-brand transition-colors',
          'bg-gilt text-gilt-ink hover:bg-gilt-soft'
        )}
      >
        {open ? (
          <X className="size-5" strokeWidth={2} />
        ) : (
          <MessageCircle className="size-5" strokeWidth={2} />
        )}
      </button>
    </div>
  )
}
