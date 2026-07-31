'use client'

import { useState } from 'react'
import { ProductCard } from '@/components/commerce/ProductCard'
import type { Product } from '@/types'

interface Collection {
  id: string
  label: string
  blurb: string
  products: Product[]
}

/**
 * Colecciones en pestañas. Cada una lleva una bajada que explica para quién es,
 * en vez de dejar una etiqueta suelta que no orienta a nadie.
 */
export function FeaturedTabs({ collections }: { collections: Collection[] }) {
  const [active, setActive] = useState(collections[0]?.id)
  const current = collections.find((c) => c.id === active) ?? collections[0]

  return (
    <div>
      <div
        role="tablist"
        aria-label="Colecciones destacadas"
        className="scroll-x flex gap-2 border-b border-ink-line pb-4"
      >
        {collections.map((collection) => (
          <button
            key={collection.id}
            role="tab"
            id={`tab-${collection.id}`}
            aria-selected={active === collection.id}
            aria-controls={`panel-${collection.id}`}
            onClick={() => setActive(collection.id)}
            data-active={active === collection.id}
            className="chip shrink-0"
          >
            {collection.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        tabIndex={-1}
      >
        <p className="mt-6 max-w-[38rem] text-[16px] leading-relaxed text-bone-3">
          {current.blurb}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-6">
          {current.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
