'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { RevealItem } from '@/components/ui/Reveal'
import type { Product } from '@/types'

const PER_PAGE = 4

/**
 * Carrusel de colección con flechas, como en la referencia.
 *
 * Pagina de a cuatro en lugar de hacer scroll horizontal: en una grilla de
 * producto el salto por página deja las cards siempre alineadas al margen, sin
 * medias tarjetas cortadas en el borde.
 */
export function CollectionRail({ products }: { products: Product[] }) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(products.length / PER_PAGE))
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          aria-label="Fragancias anteriores"
          className="btn-circle size-10 bg-ink-raised text-bone shadow-[var(--shadow-warm-sm)] hover:bg-bone hover:text-white"
        >
          <ChevronLeft className="size-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          disabled={page >= pages - 1}
          aria-label="Fragancias siguientes"
          className="btn-circle btn-circle-gold size-10"
        >
          <ChevronRight className="size-4" strokeWidth={2} />
        </button>
      </div>

      <div
        className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-6"
        aria-live="polite"
      >
        {visible.map((product, index) => (
          <RevealItem key={product.id} index={index} stagger={70} variant="card">
            <ProductCard
              product={product}
              priority={page === 0 && index < 4}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </RevealItem>
        ))}
      </div>

      {pages > 1 && (
        <p className="tnum mt-8 text-center text-[13px] text-bone-3">
          Página {page + 1} de {pages}
        </p>
      )}
    </div>
  )
}
