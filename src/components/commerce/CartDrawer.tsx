'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { ProductImage } from '@/components/ui/ProductImage'
import { FreeShippingBar } from './FreeShippingBar'
import { unitPrice, useCart } from '@/hooks/useCart'
import { formatCurrency } from '@/lib/utils'

/**
 * Carrito lateral. Agregar un producto no debe sacar a nadie de la página en
 * la que está mirando: el drawer confirma la acción y ofrece seguir o pagar.
 */
export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    itemCount,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart()

  return (
    <Drawer
      open={isOpen}
      onClose={closeCart}
      title={itemCount > 0 ? `Tu carrito (${itemCount})` : 'Tu carrito'}
      footer={
        items.length > 0 ? (
          <div className="space-y-4">
            <FreeShippingBar
              remaining={remainingForFreeShipping}
              progress={freeShippingProgress}
            />

            <div className="flex items-baseline justify-between border-t border-ink-line pt-4">
              <span className="overline">Subtotal</span>
              <span className="tnum font-display text-[1.375rem]">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <p className="text-[13px] text-bone-3">
              El costo de envío se calcula en el checkout según tu localidad.
            </p>

            <div className="grid gap-2">
              <Link href="/checkout" onClick={closeCart} className="btn btn-primary w-full">
                Finalizar compra
              </Link>
              <Link href="/carrito" onClick={closeCart} className="btn btn-quiet w-full">
                Ver carrito completo
              </Link>
            </div>
          </div>
        ) : undefined
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center py-16 text-center">
          <ShoppingBag className="size-8 text-bone-3" strokeWidth={1} />
          <p className="mt-5 font-display text-h3">Todavía no elegiste nada</p>
          <p className="mt-2 max-w-[16rem] text-[14px] text-bone-3">
            ¿No sabes por dónde empezar? El test de firma olfativa te sugiere tres fragancias en
            un minuto.
          </p>
          <div className="mt-7 grid w-full max-w-[15rem] gap-2">
            <Link href="/quiz" onClick={closeCart} className="btn btn-primary w-full">
              Hacer el test
            </Link>
            <Link href="/catalogo" onClick={closeCart} className="btn btn-quiet w-full">
              Ver catálogo
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-ink-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 py-5 first:pt-0">
              <Link
                href={`/producto/${item.product.slug}`}
                onClick={closeCart}
                className="relative size-20 shrink-0 overflow-hidden bg-ink-raised"
              >
                <ProductImage
                  src={item.product.image_url}
                  alt={item.product.name}
                  sizes="80px"
                  static
                />
              </Link>

              <div className="min-w-0 flex-1">
                <p className="overline">{item.product.house}</p>
                <Link
                  href={`/producto/${item.product.slug}`}
                  onClick={closeCart}
                  className="mt-0.5 block font-display text-[16px] leading-tight transition-colors hover:text-gilt"
                >
                  {item.product.name}
                </Link>
                <p className="mt-1 text-[13px] text-bone-3">
                  {item.is_sample ? 'Muestra 2 ml' : item.product.volume}
                  {' · '}
                  {formatCurrency(unitPrice(item))} c/u
                </p>

                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center border border-ink-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-bone-3 transition-colors hover:text-bone"
                      aria-label={`Quitar una unidad de ${item.product.name}`}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="tnum w-7 text-center text-[14px]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={!item.is_sample && item.quantity >= item.product.stock}
                      className="p-1.5 text-bone-3 transition-colors hover:text-bone disabled:opacity-30"
                      aria-label={`Agregar una unidad de ${item.product.name}`}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="tnum text-[15px]">
                      {formatCurrency(unitPrice(item) * item.quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-bone-3 transition-colors hover:text-rust"
                      aria-label={`Eliminar ${item.product.name} del carrito`}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                {!item.is_sample && item.quantity >= item.product.stock && (
                  <p className="mt-2 text-[13px] text-clay">
                    Es todo el stock que tenemos de esta fragancia.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Drawer>
  )
}
