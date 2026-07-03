import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-charcoal/80">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            block w-full rounded-lg border border-charcoal/15 px-4 py-2.5 text-sm
            bg-white text-charcoal
            transition-all duration-200
            focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none
            ${className}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

Select.displayName = 'Select'
