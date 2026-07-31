'use client'

import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { useToast } from '@/components/ui/Toast'
import { SITE } from '@/lib/site'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

/**
 * Bloque de compra. Se aísla como isla de cliente para que el resto de la ficha
 * (texto, pirámide, reseñas) siga siendo HTML servido, indexable y liviano.
 *
 * La opción de muestra está al mismo nivel visual que el frasco a propósito:
 * es la que desbloquea la compra de quien duda.
 */
export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { toast } = useToast()

  const [quantity, setQuantity] = useState(1)
  const [choice, setChoice] = useState<'full' | 'sample'>('full')

  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= SITE.commerce.lowStockThreshold
  const isSample = choice === 'sample' && product.sample_available
  const saved = has(product.id)

  const unit = isSample ? product.sample_price ?? 0 : product.price
  const maxQty = isSample ? 5 : product.stock

  const add = () => {
    if (!isSample && outOfStock) return
    addItem(product, Math.min(quantity, maxQty), { sample: isSample })
    toast(
      isSample
        ? `Muestra de ${product.name} agregada`
        : `${product.name} agregado al carrito`
    )
  }

  /*
   * En teléfono el botón de compra se va de pantalla apenas empiezas a leer la
   * pirámide olfativa, que es justo cuando te terminas de decidir. La barra de
   * abajo aparece cuando eso pasa, con el precio del formato elegido.
   */
  const [accionesALaVista, setAccionesALaVista] = useState(true)
  const observarAcciones = useCallback((nodo: HTMLDivElement | null) => {
    if (!nodo || typeof IntersectionObserver === 'undefined') return
    const observador = new IntersectionObserver(
      ([entrada]) => setAccionesALaVista(entrada.isIntersecting),
      { rootMargin: '-72px 0px 0px 0px' }
    )
    observador.observe(nodo)
    return () => observador.disconnect()
  }, [])

  const barraVisible = !accionesALaVista && !(!isSample && outOfStock)

  /* La barra tapa el pie y el globo de ayuda: se avisa al documento para que
     ambos se corran mientras esté puesta. */
  useEffect(() => {
    const clase = 'con-barra-compra'
    document.body.classList.toggle(clase, barraVisible)
    return () => document.body.classList.remove(clase)
  }, [barraVisible])

  return (
    <div className="space-y-7">
      {/* Elección de formato */}
      {product.sample_available && (
        <fieldset className="space-y-3">
          <legend className="overline">Elige el formato</legend>

          <div className="grid gap-2 sm:grid-cols-2">
            <FormatOption
              selected={choice === 'full'}
              onSelect={() => {
                setChoice('full')
                setQuantity(1)
              }}
              disabled={outOfStock}
              title={`Frasco ${product.volume}`}
              subtitle={product.concentration}
              price={product.price}
            />
            <FormatOption
              selected={choice === 'sample'}
              onSelect={() => {
                setChoice('sample')
                setQuantity(1)
              }}
              title="Muestra 2 ml"
              subtitle="Para probar primero"
              price={product.sample_price ?? 0}
            />
          </div>

          {isSample && (
            <p className="text-[13px] leading-relaxed text-bone-3">
              Si después compras el frasco completo, te descontamos lo que pagaste por la muestra.
            </p>
          )}
        </fieldset>
      )}

      {/* Precio */}
      <div className="flex items-baseline gap-3">
        <p className="tnum font-display text-[2rem] leading-none text-gilt">
          {formatCurrency(unit * quantity)}
        </p>
        {quantity > 1 && (
          <p className="tnum text-[14px] text-bone-3">{formatCurrency(unit)} c/u</p>
        )}
      </div>

      {/* Cantidad + acción */}
      <div ref={observarAcciones} className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-ink-line">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="px-3.5 py-3 text-bone-3 transition-colors hover:text-bone disabled:opacity-30"
            aria-label="Quitar una unidad"
          >
            <Minus className="size-3.5" />
          </button>
          <span className="tnum w-9 text-center text-[15px]" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty}
            className="px-3.5 py-3 text-bone-3 transition-colors hover:text-bone disabled:opacity-30"
            aria-label="Agregar una unidad"
          >
            <Plus className="size-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={add}
          disabled={!isSample && outOfStock}
          className="btn btn-primary flex-1"
        >
          <ShoppingBag className="size-4" strokeWidth={2} />
          {!isSample && outOfStock ? 'Sin stock' : 'Agregar al carrito'}
        </button>

        <button
          type="button"
          onClick={() => {
            const added = toggle(product.id)
            toast(added ? 'Guardado en favoritos' : 'Quitado de favoritos')
          }}
          aria-pressed={saved}
          aria-label={saved ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={cn(
            'grid w-[3.25rem] place-items-center border transition-colors',
            saved
              ? 'border-gilt/50 text-gilt'
              : 'border-ink-line text-bone-3 hover:border-bone-3 hover:text-bone'
          )}
        >
          <Heart className={cn('size-[1.125rem]', saved && 'fill-gilt')} strokeWidth={1.5} />
        </button>
      </div>

      {/* Disponibilidad honesta: número real, sin cuentas regresivas falsas */}
      <p className="text-[14px]" aria-live="polite">
        {outOfStock ? (
          <span className="text-rust">Sin stock — escríbenos y te avisamos cuando reponemos.</span>
        ) : lowStock ? (
          <span className="text-clay">
            Quedan {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'} de este frasco.
          </span>
        ) : (
          <span className="text-bone-3">Disponible · despacho en 48 h hábiles.</span>
        )}
      </p>

      {/* Barra de compra para teléfono */}
      <div
        className={cn(
          'barra-compra lg:hidden',
          barraVisible ? 'barra-compra-dentro' : 'barra-compra-fuera'
        )}
        aria-hidden={!barraVisible}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] text-bone-3">
            {isSample ? `Muestra 2 ml · ${product.name}` : product.name}
          </p>
          <p className="tnum text-[17px] font-medium">{formatCurrency(unit * quantity)}</p>
        </div>

        <button
          type="button"
          onClick={add}
          className="btn btn-primary shrink-0"
          tabIndex={barraVisible ? 0 : -1}
        >
          <ShoppingBag className="size-4" strokeWidth={2} />
          Agregar
        </button>
      </div>
    </div>
  )
}

function FormatOption({
  selected,
  onSelect,
  disabled,
  title,
  subtitle,
  price,
}: {
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  title: string
  subtitle: string
  price: number
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'rounded-brand border px-4 py-3.5 text-left transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-40',
        selected
          ? 'border-gilt bg-gilt/[0.07]'
          : 'border-ink-line hover:border-bone-3'
      )}
    >
      <span className="block text-[15px] text-bone">{title}</span>
      <span className="mt-0.5 block text-[13px] uppercase tracking-[0.14em] text-bone-3">
        {subtitle}
      </span>
      <span className={cn('tnum mt-2 block text-[16px]', selected ? 'text-gilt' : 'text-bone-2')}>
        {formatCurrency(price)}
      </span>
    </button>
  )
}
