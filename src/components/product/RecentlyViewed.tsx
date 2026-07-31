'use client'

import { ProductCard } from '@/components/commerce/ProductCard'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'

export function RecentlyViewed({ currentId }: { currentId?: string }) {
  const products = useRecentlyViewed(currentId)

  if (products.length === 0) return null

  return (
    <section className="shell pb-[var(--spacing-section)]">
      <p className="overline">Sigues mirando</p>
      <h2 className="mt-4 text-h2">Vistos hace poco</h2>

      <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  )
}
