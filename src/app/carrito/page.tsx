'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalogo"
            className="mb-6 inline-flex items-center gap-1 text-sm text-cream/50 hover:text-cream transition-colors"
          >
            <ArrowLeft className="size-4" />
            Seguir comprando
          </Link>

          <h1 className="font-serif text-4xl font-bold text-cream">Carrito</h1>

          {items.length === 0 ? (
            <div className="mt-20 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-cream/5 border border-cream/5">
                <ShoppingBag className="size-8 text-cream/30" />
              </div>
              <p className="text-lg text-cream/60">Tu carrito está vacío</p>
              <p className="mt-1 text-sm text-cream/30">Agregá productos desde nuestro catálogo</p>
              <Link href="/catalogo">
                <Button variant="secondary" className="mt-6">
                  Explorar catálogo
                </Button>
              </Link>
            </div>
          ) : (
            <ScrollReveal>
              <div className="mt-8 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl bg-glass-card p-4 transition-all hover:glow-gold-sm"
                  >
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-charcoal/50">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/producto/${item.product.id}`}>
                        <h3 className="font-medium text-cream hover:text-gold-light transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="mt-0.5 text-sm text-cream/50">
                        {formatCurrency(item.product.price)} c/u
                      </p>
                      <p className="text-xs text-cream/30 mt-0.5">
                        Stock: {item.product.stock} unidades
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg border border-cream/10 bg-cream/5">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1.5 text-cream/60 hover:text-cream transition-colors cursor-pointer"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-cream">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1.5 text-cream/60 hover:text-cream transition-colors cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="w-24 text-right font-medium text-cream">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-cream/30 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-xl bg-glass-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-cream/70">Total</span>
                  <span className="font-serif text-3xl font-bold text-gradient-gold">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <Button variant="ghost" onClick={clearCart}>
                    Vaciar carrito
                  </Button>
                  <Button variant="secondary" size="lg">
                    <CreditCard className="size-5" /> Finalizar compra
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
