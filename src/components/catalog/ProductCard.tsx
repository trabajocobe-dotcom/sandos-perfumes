'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const stockLabel =
    product.stock <= 3
      ? { text: 'Últimas unidades', variant: 'danger' as const }
      : product.stock <= 8
        ? { text: 'Pocas unidades', variant: 'warning' as const }
        : null

  return (
    <Card hover className="group">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-ivory">
          <img
            src={product.image_url}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {stockLabel && (
            <div className="absolute left-3 top-3">
              <Badge variant={stockLabel.variant}>{stockLabel.text}</Badge>
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">
          {product.category?.name || product.notes?.split(',')[0] || 'Perfume'}
        </p>
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-medium text-charcoal transition-colors group-hover:text-gold-dark">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs leading-relaxed text-warm-gray line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <p className="font-serif text-lg font-bold text-charcoal">
            {formatCurrency(product.price)}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => addItem(product)}
            disabled={product.stock === 0}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
