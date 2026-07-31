'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'
import { Check, MessageCircle, ShoppingBag } from 'lucide-react'
import { Skeleton } from '@/components/ui/Skeleton'
import { SITE } from '@/lib/site'

function Confirmation() {
  const params = useSearchParams()
  const orderId = params.get('pedido') ?? '—'
  const waLink = params.get('wa')
  const opened = useRef(false)

  /**
   * Se abre WhatsApp automáticamente, pero el enlace queda visible igual:
   * muchos navegadores móviles bloquean la apertura y, sin el botón, el pedido
   * quedaría registrado sin que nadie lo reciba.
   */
  useEffect(() => {
    if (!waLink || opened.current) return
    opened.current = true
    window.open(waLink, '_blank', 'noopener,noreferrer')
  }, [waLink])

  return (
    <div className="mx-auto max-w-[34rem] text-center">
      <span className="mx-auto grid size-14 place-items-center rounded-brand border border-gilt/40 text-gilt">
        <Check className="size-6" strokeWidth={2} />
      </span>

      <h1 className="mt-8 text-h1">
        Pedido <span className="accent-word">registrado</span>
      </h1>
      <p className="mt-4 text-[16px] leading-relaxed text-bone-2">
        Te escribimos por WhatsApp para confirmar el pago y coordinar la entrega. Guarda esta
        referencia por las dudas.
      </p>

      <div className="mt-9 border border-ink-line px-6 py-6">
        <p className="overline">Referencia del pedido</p>
        <p className="tnum mt-2 font-display text-[1.5rem] text-gilt">{orderId}</p>
      </div>

      {waLink && (
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-8 w-full"
        >
          <MessageCircle className="size-4" strokeWidth={2} />
          Abrir el pedido en WhatsApp
        </a>
      )}

      <div className="mt-10 border-t border-ink-line pt-8 text-left">
        <p className="overline">Qué pasa ahora</p>
        <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-bone-3">
          <li>1. Confirmamos stock y te pasamos los datos para el pago.</li>
          <li>2. Preparamos el pedido y te avisamos cuando sale.</li>
          <li>3. Llega en {SITE.commerce.deliveryDays} con seguimiento.</li>
        </ol>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="btn btn-quiet">
          <ShoppingBag className="size-4" strokeWidth={1.5} />
          Seguir comprando
        </Link>
        <Link href="/" className="btn btn-quiet">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <section className="shell py-20 lg:py-28">
      <Suspense
        fallback={
          <div className="mx-auto max-w-[34rem] space-y-4 text-center">
            <Skeleton className="mx-auto size-14" />
            <Skeleton className="mx-auto h-10 w-64" />
            <Skeleton className="mx-auto h-4 w-80" />
          </div>
        }
      >
        <Confirmation />
      </Suspense>
    </section>
  )
}
