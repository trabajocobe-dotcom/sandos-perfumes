'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import { Minus, Plus, ShoppingBag, ArrowLeft, Check, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProductCard } from '@/components/catalog/ProductCard'
import { useToast } from '@/components/ui/Toast'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { products } from '@/lib/demo-data'
import Link from 'next/link'

export default function ProductPage() {
  const params = useParams()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.id === params.id)
  if (!product) notFound()

  const related = products
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4)

  const handleAdd = () => {
    addItem(product, quantity)
    toast(`Agregado ${product.name} al carrito`)
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
      <main className="min-h-screen">
        <div className="relative h-[50vh] min-h-[400px] bg-charcoal overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/catalogo"
              className="mb-4 inline-flex items-center gap-1 text-sm text-cream/50 hover:text-cream transition-colors"
            >
              <ArrowLeft className="size-4" />
              Volver al catálogo
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="hidden lg:block" />

            <div className="bg-glass-card rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Badge variant="gold">{product.notes?.split(',')[0] || 'Perfume'}</Badge>
                <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
              </div>
              <h1 className="mt-4 font-serif text-4xl font-bold text-cream">
                {product.name}
              </h1>
              <p className="mt-2 font-serif text-3xl font-bold text-gradient-gold">
                {formatCurrency(product.price)}
              </p>

              <div className="mt-6 space-y-4 border-t border-cream/10 pt-6">
                <div>
                  <h3 className="text-sm font-medium text-cream/70">Descripción</h3>
                  <p className="mt-1 text-sm leading-relaxed text-cream/50">
                    {product.description}
                  </p>
                </div>

                {product.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-cream/70">Notas olfativas</h3>
                    <p className="mt-1 text-sm text-cream/50">{product.notes}</p>
                  </div>
                )}

                {product.volume && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-cream/70 font-medium">Presentación:</span>
                    <span className="text-cream/50">{product.volume}</span>
                  </div>
                )}

                {product.gender && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-cream/70 font-medium">Género:</span>
                    <span className="text-cream/50 capitalize">{product.gender}</span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="flex items-center rounded-lg border border-cream/10 bg-cream/5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-cream/60 hover:text-cream transition-colors cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium text-cream">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2.5 text-cream/60 hover:text-cream transition-colors cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={handleAdd}
                  disabled={product.stock === 0}
                  className="flex-1"
                >
                  <ShoppingBag className="size-5" /> Agregar al carrito
                </Button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <ScrollReveal>
            <section className="mt-24 pb-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <span className="text-xs font-semibold tracking-widest uppercase text-gold/60">Relacionados</span>
                <h2 className="mt-2 font-serif text-2xl font-bold text-cream">
                  Fragancias relacionadas
                </h2>
                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}
      </main>
      <Footer />
    </>
  )
}
