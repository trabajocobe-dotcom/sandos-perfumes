'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const stockLabel = product.stock === 0
    ? { text: 'Agotado', variant: 'danger' as const }
    : product.stock <= 3
      ? { text: 'Últimas unidades', variant: 'danger' as const }
      : product.stock <= 8
        ? { text: 'Pocas unidades', variant: 'warning' as const }
        : { text: 'En stock', variant: 'success' as const }

  return (
    <div className="group rounded-xl bg-glass-card overflow-hidden transition-all duration-300 hover:glow-gold hover:-translate-y-1">
      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-charcoal/50">
          <img
            src={product.image_url}
            alt={product.name}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            <Badge variant={stockLabel.variant}>{stockLabel.text}</Badge>
            {product.featured && <Badge variant="gold">Destacado</Badge>}
          </div>
        </div>
      </Link>
      <div className="space-y-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-cream/30">
          {product.notes?.split(',')[0] || 'Perfume'}
        </p>
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-medium text-cream transition-colors group-hover:text-gold-light">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs leading-relaxed text-cream/40 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-2">
          <p className="font-serif text-lg font-bold text-gradient-gold">
            {formatCurrency(product.price)}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { addItem(product); toast('Agregado al carrito') }}
            disabled={product.stock === 0}
          >
            <ShoppingBag className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
