import { forwardRef } from 'react'

const variants = {
  primary:
    'bg-charcoal text-cream border border-cream/10 hover:bg-charcoal/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
  secondary:
    'bg-gradient-to-r from-gold to-gold-dark text-charcoal font-semibold hover:from-gold-dark hover:to-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold glow-gold-sm',
  outline:
    'border border-gold/30 text-gold-light hover:bg-gold/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
  ghost:
    'text-cream/60 hover:text-cream hover:bg-cream/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center gap-2 rounded-lg font-medium
          transition-all duration-200
          disabled:opacity-40 disabled:pointer-events-none
          cursor-pointer
          ${variants[variant]}
          ${sizes[size]}
          ${className}
        `}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
