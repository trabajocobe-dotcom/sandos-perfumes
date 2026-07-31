'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { FreeShippingBar } from '@/components/commerce/FreeShippingBar'
import { ProductImage } from '@/components/ui/ProductImage'
import { unitPrice, useCart } from '@/hooks/useCart'
import { SITE } from '@/lib/site'
import { formatCurrency } from '@/lib/utils'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart()

  if (items.length === 0) {
    return (
      <section className="shell py-24 lg:py-32">
        <div className="mx-auto max-w-[30rem] text-center">
          <ShoppingBag className="mx-auto size-8 text-bone-3" strokeWidth={1} />
          <h1 className="mt-6 text-h2">Tu carrito está vacío</h1>
          <p className="mt-4 text-[16px] leading-relaxed text-bone-3">
            Si no sabes por dónde empezar, el test olfativo te da tres opciones en un minuto — y
            puedes pedir las muestras antes de comprometerte con un frasco.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/catalogo" className="btn btn-primary">
              Ver el catálogo
            </Link>
            <Link href="/quiz" className="btn btn-quiet">
              Hacer el test
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="shell py-16 lg:py-24">
      <Link
        href="/catalogo"
        className="link-editorial inline-flex items-center gap-2 text-[14px] text-bone-3"
      >
        <ArrowLeft className="size-3.5" />
        Seguir comprando
      </Link>

      <h1 className="mt-8 text-h1">
        Tu <span className="accent-word">carrito</span>
      </h1>
      <p className="tnum mt-3 text-[15px] text-bone-3">
        {itemCount} {itemCount === 1 ? 'producto' : 'productos'}
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <ul className="divide-y divide-ink-line border-y border-ink-line">
          {items.map((item) => (
            <li key={item.id} className="flex gap-5 py-7">
              <Link
                href={`/producto/${item.product.slug}`}
                className="relative size-24 shrink-0 overflow-hidden bg-ink-raised sm:size-28"
              >
                <ProductImage
                  src={item.product.image_url}
                  alt={item.product.name}
                  sizes="112px"
                  static
                />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="overline">{item.product.house}</p>
                    <h2 className="mt-1 font-display text-[17px] leading-tight">
                      <Link
                        href={`/producto/${item.product.slug}`}
                        className="transition-colors hover:text-gilt"
                      >
                        {item.product.name}
                      </Link>
                    </h2>
                    <p className="mt-1.5 text-[13px] text-bone-3">
                      {item.is_sample
                        ? 'Muestra 2 ml'
                        : `${item.product.volume} · ${item.product.concentration}`}
                      {' · '}
                      {formatCurrency(unitPrice(item))} c/u
                    </p>
                  </div>

                  <p className="tnum font-display text-[1.125rem]">
                    {formatCurrency(unitPrice(item) * item.quantity)}
                  </p>
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-4 pt-5">
                  <div className="flex items-center border border-ink-line">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-2 text-bone-3 transition-colors hover:text-bone"
                      aria-label={`Quitar una unidad de ${item.product.name}`}
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="tnum w-8 text-center text-[14px]">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={!item.is_sample && item.quantity >= item.product.stock}
                      className="px-3 py-2 text-bone-3 transition-colors hover:text-bone disabled:opacity-30"
                      aria-label={`Agregar una unidad de ${item.product.name}`}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="inline-flex items-center gap-1.5 text-[13px] text-bone-3 transition-colors hover:text-rust"
                  >
                    <Trash2 className="size-3.5" />
                    Quitar
                  </button>

                  {!item.is_sample && item.quantity >= item.product.stock && (
                    <span className="text-[13px] text-clay">Último stock disponible</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-ink-line p-6">
            <h2 className="overline">Resumen</h2>

            <div className="mt-6">
              <FreeShippingBar
                remaining={remainingForFreeShipping}
                progress={freeShippingProgress}
              />
            </div>

            <dl className="mt-6 space-y-3 border-t border-ink-line pt-5 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-bone-3">Subtotal</dt>
                <dd className="tnum text-bone">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bone-3">Envío</dt>
                <dd className="text-bone-2">
                  {remainingForFreeShipping <= 0 ? 'Gratis' : 'Se calcula en el checkout'}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-ink-line pt-5">
              <span className="text-[16px] text-bone-2">Total estimado</span>
              <span className="tnum font-display text-[1.625rem] text-gilt">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <Link href="/checkout" className="btn btn-primary mt-6 w-full">
              Finalizar compra
            </Link>

            <button
              type="button"
              onClick={clearCart}
              className="link-editorial mx-auto mt-5 block text-[13px] text-bone-3"
            >
              Vaciar el carrito
            </button>

            <p className="mt-6 border-t border-ink-line pt-5 text-[13px] leading-relaxed text-bone-3">
              Entrega en {SITE.commerce.deliveryDays}. Cambios sin cargo por{' '}
              {SITE.commerce.returnDays} días con el frasco cerrado.
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
