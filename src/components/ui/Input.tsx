import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-charcoal/80">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            block w-full rounded-lg border px-4 py-2.5 text-sm
            bg-white text-charcoal placeholder:text-warm-gray-light
            transition-all duration-200
            focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red/20' : 'border-charcoal/15'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
