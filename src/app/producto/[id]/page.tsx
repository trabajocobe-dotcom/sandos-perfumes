'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Minus, Plus, ShoppingBag, ArrowLeft, Check } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { ProductCard } from '@/components/catalog/ProductCard'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { products } from '@/lib/demo-data'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const product = products.find((p) => p.id === params.id)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)

  const handleAdd = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const stockStatus =
    product.stock === 0
      ? { label: 'Agotado', variant: 'danger' as const }
      : product.stock <= 3
        ? { label: 'Últimas unidades', variant: 'danger' as const }
        : product.stock <= 8
          ? { label: 'Pocas unidades', variant: 'warning' as const }
          : { label: 'En stock', variant: 'success' as const }

  return (
    <>
      <Header />
      <main className="min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalogo"
            className="mb-6 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="size-4" />
            Volver al catálogo
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-ivory">
              <img
                src={product.image_url}
                alt={product.name}
                className="size-full object-cover"
              />
            </div>

            <div>
              <Badge variant="gold">{product.notes?.split(',')[0] || 'Perfume'}</Badge>
              <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal">
                {product.name}
              </h1>
              <p className="mt-2 font-serif text-2xl font-bold text-gold-dark">
                {formatCurrency(product.price)}
              </p>

              <div className="mt-6 space-y-4 border-t border-charcoal/10 pt-6">
                <div>
                  <h3 className="text-sm font-medium text-charcoal">Descripción</h3>
                  <p className="mt-1 text-sm leading-relaxed text-warm-gray">
                    {product.description}
                  </p>
                </div>

                {product.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-charcoal">Notas olfativas</h3>
                    <p className="mt-1 text-sm text-warm-gray">{product.notes}</p>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-charcoal">Disponibilidad:</span>
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                </div>

                {product.volume && (
                  <div className="flex items-center gap-2 text-sm text-warm-gray">
                    <span className="font-medium text-charcoal">Presentación:</span>
                    {product.volume}
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-charcoal/15">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-charcoal">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  {added ? (
                    <>
                      <Check className="size-5" /> Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="size-5" /> Agregar al carrito
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-20">
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                Fragancias relacionadas
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
