'use client'

import { forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * Campos con etiqueta flotante.
 *
 * La etiqueta empieza dentro del campo y sube al enfocarlo o al escribir, así
 * el formulario se ve limpio sin perder la etiqueta —que es lo que pasa cuando
 * se usa solo un placeholder—. La detección de "campo vacío" es CSS puro
 * (`:placeholder-shown`), por eso cada control lleva un placeholder de un
 * espacio en blanco.
 */

function Feedback({ id, error, hint }: { id: string; error?: string; hint?: string }) {
  if (error) {
    return (
      <p id={`${id}-error`} role="alert" className="mt-2 text-[13px] text-rust">
        {error}
      </p>
    )
  }
  if (hint) {
    return <p className="mt-2 text-[13px] text-bone-3">{hint}</p>
  }
  return null
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, placeholder, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId

    return (
      <div>
        <div className="field-shell">
          <input
            ref={ref}
            id={fieldId}
            placeholder={label ? ' ' : placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn('field peer', label && 'pt-6 pb-2.5', error && 'field-invalid', className)}
            {...props}
          />
          {label && (
            <label htmlFor={fieldId} className="float-label">
              {label}
            </label>
          )}
        </div>
        <Feedback id={fieldId} error={error} hint={hint} />
      </div>
    )
  }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, rows = 3, placeholder, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId

    return (
      <div>
        <div className="field-shell">
          <textarea
            ref={ref}
            id={fieldId}
            rows={rows}
            placeholder={label ? ' ' : placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              'field resize-none',
              label && 'pt-7 pb-3',
              error && 'field-invalid',
              className
            )}
            {...props}
          />
          {label && (
            <label htmlFor={fieldId} className="float-label">
              {label}
            </label>
          )}
        </div>
        <Feedback id={fieldId} error={error} hint={hint} />
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className, id, children, ...props }, ref) => {
    const autoId = useId()
    const fieldId = id ?? autoId

    return (
      <div>
        {label && (
          <label htmlFor={fieldId} className="overline mb-2 block">
            {label}
          </label>
        )}
        <div className="field-shell">
          <select
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            className={cn(
              'field cursor-pointer appearance-none',
              error && 'field-invalid',
              className
            )}
            {...props}
          >
            {children}
          </select>
        </div>
        <Feedback id={fieldId} error={error} hint={hint} />
      </div>
    )
  }
)
Select.displayName = 'Select'
