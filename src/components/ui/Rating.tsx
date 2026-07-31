import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
  className?: string
  showValue?: boolean
}

/** Estrellas con media estrella real (recorte por ancho), no redondeo grosero. */
export function Rating({ value, count, size = 'sm', className, showValue }: RatingProps) {
  const starSize = size === 'sm' ? 'size-3' : 'size-4'
  const label = `${value.toFixed(1)} de 5${count != null ? `, ${count} reseñas` : ''}`

  return (
    <div className={cn('flex items-center gap-2', className)} aria-label={label}>
      <div className="flex gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => {
          const fill = Math.max(0, Math.min(1, value - i))
          return (
            <span key={i} className="relative inline-flex">
              <Star className={cn(starSize, 'text-ink-line')} strokeWidth={1.5} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(starSize, 'fill-gilt text-gilt')} strokeWidth={1.5} />
              </span>
            </span>
          )
        })}
      </div>
      {showValue && (
        <span className="tnum text-[13px] text-bone-2">{value.toFixed(1)}</span>
      )}
      {count != null && (
        <span className="tnum text-[13px] text-bone-3">({count})</span>
      )}
    </div>
  )
}
