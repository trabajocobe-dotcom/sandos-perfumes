import { Truck } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface FreeShippingBarProps {
  remaining: number
  progress: number
}

/**
 * Barra de progreso hacia el envío gratis.
 * Convierte un umbral abstracto en una meta visible; es de las formas más
 * baratas de subir el ticket promedio sin descontar precio.
 */
export function FreeShippingBar({ remaining, progress }: FreeShippingBarProps) {
  const reached = remaining <= 0
  const pct = Math.round(progress * 100)

  return (
    <div className="space-y-2.5">
      <p className="flex items-center gap-2 text-[14px] leading-snug">
        <Truck className="size-4 shrink-0 text-gilt" strokeWidth={1.5} />
        {reached ? (
          <span className="text-bone">
            Tienes <span className="text-gilt">envío gratis</span> en este pedido.
          </span>
        ) : (
          <span className="text-bone-2">
            Te faltan{' '}
            <span className="tnum text-bone">{formatCurrency(remaining)}</span> para el envío
            gratis.
          </span>
        )}
      </p>

      <div
        className="h-[3px] w-full overflow-hidden bg-ink-line"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso hacia el envío gratis"
      >
        <div
          className="h-full bg-gilt transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
