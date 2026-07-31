'use client'

import { useMemo, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/Toast'
import { FAMILIES } from '@/lib/catalog'
import { products } from '@/lib/demo-data'
import { cn, formatCurrency } from '@/lib/utils'

const MAX_SAMPLES = 5

/**
 * Armador del set de descubrimiento.
 *
 * Es la respuesta directa al mayor freno del rubro: no se puede oler online.
 * Un tope de 5 mantiene la decisión manejable y el precio en un rango de
 * impulso, muy por debajo del frasco.
 */
export function SampleBuilder() {
  const { addItem, openCart } = useCart()
  const { toast } = useToast()

  const [selected, setSelected] = useState<string[]>([])
  const [family, setFamily] = useState<string | null>(null)

  const available = useMemo(
    () => products.filter((p) => p.sample_available && (!family || p.family === family)),
    [family]
  )

  const chosen = useMemo(
    () => selected.map((id) => products.find((p) => p.id === id)!).filter(Boolean),
    [selected]
  )

  const total = chosen.reduce((sum, p) => sum + (p.sample_price ?? 0), 0)
  const full = selected.length >= MAX_SAMPLES

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= MAX_SAMPLES) {
        toast(`El set admite hasta ${MAX_SAMPLES} muestras`, 'error')
        return prev
      }
      return [...prev, id]
    })
  }

  const addToCart = () => {
    chosen.forEach((product) => addItem(product, 1, { sample: true }))
    toast(`${chosen.length} muestras agregadas al carrito`)
    setSelected([])
    openCart()
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-14">
      <div>
        <div className="scroll-x flex gap-2 border-b border-ink-line pb-4">
          <button
            type="button"
            onClick={() => setFamily(null)}
            data-active={family === null}
            className="chip shrink-0"
          >
            Todas
          </button>
          {FAMILIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFamily(item.key)}
              data-active={family === item.key}
              className="chip shrink-0"
            >
              {item.name}
            </button>
          ))}
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {available.map((product) => {
            const active = selected.includes(product.id)
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => toggle(product.id)}
                  aria-pressed={active}
                  disabled={full && !active}
                  className={cn(
                    'group w-full rounded-brand border p-3 text-left transition-colors',
                    'disabled:cursor-not-allowed disabled:opacity-35',
                    active ? 'border-gilt bg-gilt/[0.06]' : 'border-ink-line hover:border-bone-3'
                  )}
                >
                  <span className="relative block aspect-square overflow-hidden bg-ink-raised">
                    <ProductImage
                      src={product.image_url}
                      alt=""
                      sizes="(max-width: 640px) 45vw, 20vw"
                      static
                    />
                    <span
                      className={cn(
                        'absolute right-2 top-2 grid size-6 place-items-center rounded-brand transition-colors',
                        active ? 'bg-gilt text-gilt-ink' : 'bg-ink/75 text-bone-2'
                      )}
                    >
                      {active ? (
                        <Check className="size-3.5" strokeWidth={3} />
                      ) : (
                        <Plus className="size-3.5" strokeWidth={2} />
                      )}
                    </span>
                  </span>

                  <span className="overline mt-3 block">{product.house}</span>
                  <span className="mt-1 block font-display text-[16px] leading-tight">
                    {product.name}
                  </span>
                  <span className="tnum mt-1.5 block text-[13px] text-bone-3">
                    {formatCurrency(product.sample_price ?? 0)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="border border-ink-line p-6">
          <p className="overline">Tu set</p>
          <p className="tnum mt-2 font-display text-h2">
            {selected.length}
            <span className="text-bone-3">/{MAX_SAMPLES}</span>
          </p>

          <ul className="mt-6 space-y-3">
            {Array.from({ length: MAX_SAMPLES }).map((_, index) => {
              const product = chosen[index]
              return (
                <li
                  key={index}
                  className={cn(
                    'flex items-center gap-3 border-b border-ink-line pb-3 text-[14px]',
                    !product && 'text-bone-3'
                  )}
                >
                  <span className="tnum w-5 text-bone-3">{index + 1}</span>
                  {product ? (
                    <>
                      <span className="flex-1 truncate text-bone-2">{product.name}</span>
                      <button
                        type="button"
                        onClick={() => toggle(product.id)}
                        className="text-bone-3 transition-colors hover:text-rust"
                        aria-label={`Quitar ${product.name} del set`}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <span className="flex-1">Vacío</span>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="mt-6 flex items-baseline justify-between border-t border-ink-line pt-5">
            <span className="overline">Total</span>
            <span className="tnum font-display text-[1.375rem] text-gilt">
              {formatCurrency(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={selected.length === 0}
            className="btn btn-primary mt-5 w-full"
          >
            Agregar al carrito
          </button>

          <p className="mt-4 text-[13px] leading-relaxed text-bone-3">
            Si después compras alguno de estos frascos completos, te descontamos lo que pagaste por
            su muestra.
          </p>
        </div>
      </aside>
    </div>
  )
}
