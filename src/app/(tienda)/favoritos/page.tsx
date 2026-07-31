'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { RevealItem } from '@/components/ui/Reveal'
import { useWishlist } from '@/hooks/useWishlist'

export default function WishlistPage() {
  const { products, count, clear } = useWishlist()

  return (
    <section className="shell py-16 lg:py-24">
      <nav aria-label="Ruta de navegación" className="miga">
        <Link href="/" className="transition-colors hover:text-bone">
          Inicio
        </Link>
        <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
        <span className="text-bone-2">Favoritos</span>
      </nav>

      <header className="mt-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="overline">Tu lista</p>
          <h1 className="mt-4 text-h1">
            Fragancias <span className="accent-word">guardadas</span>
          </h1>
          <p className="mt-4 max-w-[32rem] text-[16px] leading-relaxed text-bone-3">
            {count > 0
              ? 'Se guardan en este navegador. Cuando te decidas, puedes pedir la muestra de cada una antes del frasco.'
              : 'Todavía no guardaste ninguna fragancia.'}
          </p>
        </div>

        {count > 0 && (
          <button type="button" onClick={clear} className="link-editorial text-[14px] text-bone-3">
            Vaciar la lista
          </button>
        )}
      </header>

      {count === 0 ? (
        <div className="mt-14 border border-ink-line px-6 py-20 text-center">
          <Heart className="mx-auto size-8 text-bone-3" strokeWidth={1} />
          <p className="mt-6 font-display text-h3">Tu lista está vacía</p>
          <p className="mx-auto mt-3 max-w-[26rem] text-[15px] leading-relaxed text-bone-3">
            Toca el corazón en cualquier fragancia para guardarla y comparar con calma después.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogo" className="btn btn-primary">
              Explorar el catálogo
            </Link>
            <Link href="/quiz" className="btn btn-quiet">
              Hacer el test olfativo
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-14 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6">
          {products.map((product, index) => (
            <RevealItem key={product.id} index={Math.min(index, 5)} stagger={70} variant="card">
              <ProductCard product={product} sizes="(max-width: 768px) 50vw, 25vw" />
            </RevealItem>
          ))}
        </div>
      )}
    </section>
  )
}
