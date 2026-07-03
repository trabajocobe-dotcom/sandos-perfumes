'use client'

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart()

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/catalogo"
            className="mb-6 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="size-4" />
            Seguir comprando
          </Link>

          <h1 className="font-serif text-3xl font-bold text-charcoal">Carrito</h1>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-ivory">
                <ShoppingBag className="size-8 text-warm-gray-light" />
              </div>
              <p className="text-warm-gray">Tu carrito está vacío</p>
              <Link href="/catalogo">
                <Button variant="secondary" className="mt-4">
                  Explorar catálogo
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mt-8 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="flex items-center gap-4 p-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-lg bg-ivory">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/producto/${item.product.id}`}>
                        <h3 className="font-medium text-charcoal hover:text-gold-dark transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="mt-0.5 text-sm text-warm-gray">
                        {formatCurrency(item.product.price)} c/u
                      </p>
                    </div>
                    <div className="flex items-center rounded-lg border border-charcoal/15">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="p-1.5 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-charcoal">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="p-1.5 text-warm-gray hover:text-charcoal transition-colors cursor-pointer"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <p className="w-24 text-right font-medium text-charcoal">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="p-2 text-warm-gray-light hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </Card>
                ))}
              </div>

              <div className="mt-8 border-t border-charcoal/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-charcoal">Total</span>
                  <span className="font-serif text-2xl font-bold text-gold-dark">
                    {formatCurrency(total)}
                  </span>
                </div>
                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" onClick={clearCart}>
                    Vaciar carrito
                  </Button>
                  <Button variant="secondary" size="lg">
                    Finalizar compra
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
