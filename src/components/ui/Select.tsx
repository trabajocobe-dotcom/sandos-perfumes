'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

/**
 * Select con lista de opciones, usado en el panel.
 * Para un select con `children` libres, usar el de `@/components/ui/Input`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, className, id, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={fieldId} className="overline block">
            {label}
          </label>
        )}
        <select ref={ref} id={fieldId} className={cn('field cursor-pointer', className)} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

Select.displayName = 'Select'
