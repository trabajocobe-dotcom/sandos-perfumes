import { cn } from '@/lib/utils'

const variants = {
  neutral: 'border-ink-line text-bone-2',
  gilt: 'border-gilt/45 text-gilt',
  solid: 'border-gilt bg-gilt text-gilt-ink',
  sale: 'border-clay/50 text-clay',
  ok: 'border-sage/45 text-sage',
  warn: 'border-clay/45 text-clay',
  danger: 'border-rust/50 text-rust',
} as const

interface BadgeProps {
  variant?: keyof typeof variants
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-brand border px-2.5 py-1',
        'text-micro font-medium uppercase tracking-[0.16em]',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
