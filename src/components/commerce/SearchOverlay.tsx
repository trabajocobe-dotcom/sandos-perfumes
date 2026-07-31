'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { searchSuggestions, FAMILIES } from '@/lib/catalog'
import { formatCurrency } from '@/lib/utils'

const POPULAR = ['Bleu de Chanel', 'Vainilla', 'Amaderada', 'Sándalo', 'Good Girl']

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

/**
 * Buscador con sugerencias en vivo.
 * Antes el ícono de lupa del header no hacía nada; buscar es la vía de entrada
 * de quien ya sabe qué quiere y la que mejor convierte de todo el sitio.
 */
export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => searchSuggestions(query, 5), [query])

  /** Cerrar limpia la consulta: al reabrir el buscador arranca en blanco. */
  const close = useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
    }
  }, [open, close])

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    router.push(`/catalogo?q=${encodeURIComponent(query.trim())}`)
    close()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Buscar fragancias">
      <button
        type="button"
        aria-label="Cerrar búsqueda"
        onClick={close}
        className="animate-fade absolute inset-0 h-full w-full cursor-default bg-night/60 backdrop-blur-sm"
      />

      <div className="animate-rise relative mx-auto mt-[10vh] w-[min(46rem,92vw)] border border-ink-line bg-ink">
        <form onSubmit={submit} className="flex items-center gap-3 border-b border-ink-line px-5">
          <Search className="size-5 shrink-0 text-bone-3" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca por nombre, casa, familia o nota…"
            aria-label="Buscar fragancias"
            className="w-full bg-transparent py-5 text-[1rem] outline-none placeholder:text-bone-3"
          />
          <button
            type="button"
            onClick={close}
            className="-mr-2 p-2 text-bone-3 transition-colors hover:text-bone"
            aria-label="Cerrar búsqueda"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </form>

        <div className="max-h-[55vh] overflow-y-auto p-5">
          {query.trim() === '' ? (
            <div className="space-y-6">
              <div>
                <p className="overline">Búsquedas frecuentes</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {POPULAR.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="chip"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="overline">Por familia olfativa</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {FAMILIES.map((family) => (
                    <Link
                      key={family.id}
                      href={`/catalogo?familia=${family.key}`}
                      onClick={close}
                      className="chip"
                    >
                      {family.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-bone-2">
                Sin resultados para <span className="text-bone">“{query}”</span>
              </p>
              <p className="mt-2 text-[14px] text-bone-3">
                Prueba con una nota (vainilla, cedro) o una familia (amaderada, cítrica).
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-ink-line">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/producto/${product.slug}`}
                    onClick={close}
                    className="flex items-center gap-4 py-3 transition-colors hover:bg-ink-raised"
                  >
                    <span className="relative size-14 shrink-0 overflow-hidden bg-ink-raised">
                      <ProductImage
                        src={product.image_url}
                        alt=""
                        sizes="56px"
                        static
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="overline block">{product.house}</span>
                      <span className="mt-0.5 block truncate font-display text-[16px]">
                        {product.name}
                      </span>
                    </span>
                    <span className="tnum shrink-0 text-[15px] text-bone-2">
                      {formatCurrency(product.price)}
                    </span>
                  </Link>
                </li>
              ))}

              <li className="pt-4">
                <button type="button" onClick={submit} className="btn btn-quiet w-full">
                  Ver todos los resultados
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
