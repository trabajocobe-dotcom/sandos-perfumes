import { forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const variants = {
  /** El oro es el único color de acción del sistema. */
  primary: 'btn-primary',
  outline: 'btn-outline',
  quiet: 'btn-quiet',
} as const

const sizes = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
} as const

type Variant = keyof typeof variants
type Size = keyof typeof sizes

interface BaseProps {
  variant?: Variant
  size?: Size
  className?: string
  children?: React.ReactNode
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn('btn', variants[variant], sizes[size], className)}
      {...props}
    />
  )
)
Button.displayName = 'Button'

type ButtonLinkProps = BaseProps &
  Omit<React.ComponentProps<typeof Link>, 'className'>

/** Mismo lenguaje visual que Button, pero navega. Nunca un <button> con onClick=router.push. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn('btn', variants[variant], sizes[size], className)} {...props} />
  )
}
