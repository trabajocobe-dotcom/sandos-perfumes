import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

/**
 * Superficie del panel. Se apoya en los tokens `ink-*`, así que hereda la
 * variante clara cuando está dentro de `.panel` y la oscura fuera de él.
 */
export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-brand border border-ink-line bg-ink-raised',
        hover && 'transition-colors duration-300 hover:border-bone-3',
        className
      )}
    >
      {children}
    </div>
  )
}
