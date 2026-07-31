'use client'

import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { useToast } from '@/components/ui/Toast'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { discountPercent, isOnSale } from '@/lib/catalog'
import { SITE } from '@/lib/site'
import { cn, formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  /** Solo para las primeras cards visibles: mejora el LCP. */
  priority?: boolean
  sizes?: string
}

/**
 * Card de producto de la dirección "oro cálido": la foto vive en un panel
 * redondeado de tono crema, con el corazón arriba a la derecha y la acción de
 * compra en un botón circular abajo. Nombre y precio quedan fuera del panel.
 *
 * A diferencia de la versión anterior, las acciones están SIEMPRE visibles: en
 * la referencia forman parte de la composición de la card, no de un hover.
 */
export function ProductCard({ product, priority = false, sizes }: ProductCardProps) {
  const { addItem } = useCart()
  const { has, toggle } = useWishlist()
  const { toast } = useToast()

  const href = `/producto/${product.slug}`
  const sale = isOnSale(product)
  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= SITE.commerce.lowStockThreshold
  const saved = has(product.id)

  return (
    <article className="group relative flex flex-col">
      {/* El panel se levanta apenas al pasar el mouse: da a entender que la card
          entera es un objeto tocable, no solo la foto de adentro. */}
      <div className="relative overflow-hidden rounded-brand bg-ink-sunken transition-[transform,box-shadow] duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[var(--shadow-warm)] motion-reduce:transform-none">
        <Link
          href={href}
          className="foto-marco relative block aspect-[4/5]"
          aria-label={`Ver ${product.name}`}
        >
          <ProductImage
            src={product.image_url}
            alt={`${product.house} ${product.name}`}
            priority={priority}
            sizes={sizes}
            className={cn(outOfStock && 'esta-agotado opacity-40 grayscale')}
          />
        </Link>

        {/* Una sola etiqueta por producto, para no ensuciar la foto */}
        <div className="pointer-events-none absolute left-3 top-3">
          {outOfStock ? (
            <span className="rounded-pill bg-bone/85 px-3 py-1 text-[13px] text-white">
              Sin stock
            </span>
          ) : sale ? (
            <span className="rounded-pill bg-bone px-3 py-1 text-[13px] font-medium text-white">
              −{discountPercent(product)}%
            </span>
          ) : product.is_new ? (
            <span className="rounded-pill bg-white/90 px-3 py-1 text-[13px] text-bone backdrop-blur">
              Nuevo
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => {
            const added = toggle(product.id)
            toast(
              added
                ? `${product.name} guardado en favoritos`
                : `${product.name} quitado de favoritos`
            )
          }}
          aria-pressed={saved}
          aria-label={
            saved ? `Quitar ${product.name} de favoritos` : `Guardar ${product.name} en favoritos`
          }
          className={cn(
            'absolute right-3 top-3 z-[2] grid size-9 place-items-center rounded-pill transition-colors',
            'bg-white/90 backdrop-blur',
            saved ? 'text-gilt' : 'text-bone-2 hover:text-bone'
          )}
        >
          <Heart className={cn('size-4', saved && 'fill-gilt')} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => {
            if (outOfStock) return
            addItem(product)
            toast(`${product.name} agregado al carrito`)
          }}
          disabled={outOfStock}
          aria-label={`Agregar ${product.name} al carrito`}
          className={cn(
            'btn-circle absolute bottom-3 right-3 z-[2] size-10',
            'bg-white text-bone shadow-[var(--shadow-warm-sm)] hover:bg-bone hover:text-white'
          )}
        >
          <ShoppingBag className="size-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="mt-4 flex flex-1 flex-col px-1">
        <p className="text-[13px] text-bone-3">{product.house}</p>

        <h3 className="mt-1 font-display text-[1.1875rem] leading-tight">
          <Link href={href} className="transition-colors hover:text-gilt">
            {/* Área de click extendida a toda la card sin anidar enlaces */}
            <span className="absolute inset-0 z-[1]" aria-hidden="true" />
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 flex items-baseline gap-2 text-[15px]">
          <span className="text-bone-3">Precio ·</span>
          <span className="tnum font-medium">{formatCurrency(product.price)}</span>
          {sale && (
            <span className="tnum text-[13px] text-bone-3 line-through">
              {formatCurrency(product.compare_at_price!)}
            </span>
          )}
        </p>

        <p className="mt-1 text-[13px] text-bone-3">
          {product.volume} · {product.concentration}
          {lowStock && <span className="ml-1.5 text-clay">Quedan {product.stock}</span>}
        </p>
      </div>
    </article>
  )
}
