import { cn } from '@/lib/utils'

interface ScentMeterProps {
  label: string
  /** 1 a 5 */
  value: number
  /** Texto que traduce el número a lenguaje humano ("Larga", "Envolvente"). */
  caption: string
  className?: string
}

/**
 * Medidor de duración / estela.
 *
 * Sin poder oler, estos dos datos son lo que más consultan los compradores y
 * lo que más devoluciones evita. Se muestran como barras discretas en vez de
 * un número suelto: se leen de un vistazo y se comparan entre fragancias.
 */
export function ScentMeter({ label, value, caption, className }: ScentMeterProps) {
  const clamped = Math.max(0, Math.min(5, Math.round(value)))

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="overline">{label}</span>
        <span className="text-[13px] text-bone-2">{caption}</span>
      </div>
      <div
        className="flex gap-1"
        role="meter"
        aria-valuenow={clamped}
        aria-valuemin={1}
        aria-valuemax={5}
        aria-label={`${label}: ${caption}`}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={cn(
              'h-[3px] flex-1 rounded-[1px] transition-colors',
              step <= clamped ? 'bg-gilt' : 'bg-ink-line'
            )}
          />
        ))}
      </div>
    </div>
  )
}
