'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { Drawer } from '@/components/ui/Drawer'
import { RevealItem } from '@/components/ui/Reveal'
import { FilterPanel, type FilterState } from './FilterPanel'
import {
  filterProducts,
  GENDER_LABEL,
  OCCASION_LABEL,
  SEASON_LABEL,
  priceBounds,
  SORT_OPTIONS,
  type CatalogFilters,
  type SortKey,
} from '@/lib/catalog'
import { FAMILIES } from '@/lib/demo-data'
import type { FragranceFamily, Gender, Occasion, Season } from '@/types'

/** Claves de la URL. Están en español porque la URL también es parte del producto. */
const PARAM = {
  familias: 'familia',
  generos: 'genero',
  ocasiones: 'ocasion',
  estaciones: 'estacion',
  notas: 'nota',
  maxPrice: 'max',
  soloStock: 'stock',
  soloOferta: 'oferta',
  search: 'q',
  sort: 'orden',
} as const

const splitParam = (value: string | null): string[] =>
  value ? value.split(',').map((v) => v.trim()).filter(Boolean) : []

export function CatalogView() {
  const router = useRouter()
  const params = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const bounds = priceBounds()

  const search = params.get(PARAM.search) ?? ''
  const sort = (params.get(PARAM.sort) as SortKey) || 'relevance'

  const state: FilterState = {
    familias: splitParam(params.get(PARAM.familias)),
    generos: splitParam(params.get(PARAM.generos)),
    ocasiones: splitParam(params.get(PARAM.ocasiones)),
    estaciones: splitParam(params.get(PARAM.estaciones)),
    notas: splitParam(params.get(PARAM.notas)),
    maxPrice: params.get(PARAM.maxPrice) ? Number(params.get(PARAM.maxPrice)) : undefined,
    soloStock: params.get(PARAM.soloStock) === '1',
    soloOferta: params.get(PARAM.soloOferta) === '1',
  }

  /**
   * Todo el estado vive en la URL: los filtros se pueden compartir, guardar en
   * favoritos y deshacer con el botón atrás del navegador.
   */
  const push = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params.toString())
    mutate(next)
    const qs = next.toString()
    router.replace(qs ? `/catalogo?${qs}` : '/catalogo', { scroll: false })
  }

  const toggle = (key: keyof FilterState, value: string) => {
    push((next) => {
      const param = PARAM[key as keyof typeof PARAM]
      const current = splitParam(next.get(param))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      if (updated.length) next.set(param, updated.join(','))
      else next.delete(param)
    })
  }

  const set = (key: keyof FilterState, value: boolean | number | undefined) => {
    push((next) => {
      const param = PARAM[key as keyof typeof PARAM]
      if (value === undefined || value === false) next.delete(param)
      else if (value === true) next.set(param, '1')
      else next.set(param, String(value))
    })
  }

  const clearAll = () => router.replace('/catalogo', { scroll: false })

  const filters: CatalogFilters = {
    search,
    families: state.familias as FragranceFamily[],
    genders: state.generos as Gender[],
    occasions: state.ocasiones as Occasion[],
    seasons: state.estaciones as Season[],
    notes: state.notas,
    maxPrice: state.maxPrice,
    onlyInStock: state.soloStock,
    onlyOnSale: state.soloOferta,
    sort,
  }

  const results = filterProducts(filters)

  /** Píldoras de filtros activos: sin esto nadie sabe por qué ve 3 resultados. */
  const activePills = [
    ...state.familias.map((v) => ({
      key: 'familias' as const,
      value: v,
      label: FAMILIES.find((f) => f.key === v)?.name ?? v,
    })),
    ...state.generos.map((v) => ({
      key: 'generos' as const,
      value: v,
      label: GENDER_LABEL[v as Gender] ?? v,
    })),
    ...state.notas.map((v) => ({ key: 'notas' as const, value: v, label: v })),
    ...state.ocasiones.map((v) => ({
      key: 'ocasiones' as const,
      value: v,
      label: OCCASION_LABEL[v as Occasion] ?? v,
    })),
    ...state.estaciones.map((v) => ({
      key: 'estaciones' as const,
      value: v,
      label: SEASON_LABEL[v as Season] ?? v,
    })),
  ]

  const hasFilters =
    activePills.length > 0 ||
    Boolean(search) ||
    state.soloStock ||
    state.soloOferta ||
    state.maxPrice != null

  const panel = <FilterPanel state={state} onToggle={toggle} onSet={set} bounds={bounds} />

  return (
    <div className="shell pb-[var(--spacing-section)] pt-12 lg:pt-16">
      <nav aria-label="Ruta de navegación" className="miga">
        <Link href="/" className="transition-colors hover:text-bone">
          Inicio
        </Link>
        <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
        <span className="text-bone-2">Catálogo</span>
      </nav>

      <header className="mt-8 max-w-[36rem]">
        <p className="overline">
          {search ? `Resultados para “${search}”` : 'Catálogo completo'}
        </p>
        <h1 className="mt-4 text-h1">
          Nuestras <span className="accent-word">fragancias</span>
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-bone-3">
          Filtra por familia, nota, ocasión o presupuesto. Todas las fichas incluyen pirámide
          olfativa, duración y estela.
        </p>
      </header>

      <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
        {/* Filtros de escritorio */}
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <div className="flex items-baseline justify-between">
              <h2 className="overline">Filtros</h2>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="link-editorial text-[13px] text-bone-3"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="mt-2 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">{panel}</div>
          </div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-line pb-4">
            <p className="tnum text-[14px] text-bone-3">
              <span className="text-bone">{results.length}</span>{' '}
              {results.length === 1 ? 'fragancia' : 'fragancias'}
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="btn btn-quiet btn-sm lg:hidden"
              >
                <SlidersHorizontal className="size-3.5" strokeWidth={1.5} />
                Filtros
                {activePills.length > 0 && ` (${activePills.length})`}
              </button>

              <label className="flex items-center gap-2">
                <span className="sr-only-focusable">Ordenar por</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    push((next) => {
                      if (e.target.value === 'relevance') next.delete(PARAM.sort)
                      else next.set(PARAM.sort, e.target.value)
                    })
                  }}
                  aria-label="Ordenar resultados"
                  className="cursor-pointer border border-ink-line bg-transparent px-3 py-2 text-[13px] uppercase tracking-[0.12em] text-bone-2 outline-none transition-colors hover:border-bone-3"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-ink">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {activePills.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {activePills.map((pill) => (
                <li key={`${pill.key}-${pill.value}`}>
                  <button
                    type="button"
                    onClick={() => toggle(pill.key, pill.value)}
                    className="chip"
                    data-active="true"
                    aria-label={`Quitar filtro ${pill.label}`}
                  >
                    {pill.label}
                    <X className="size-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {results.length === 0 ? (
            <div className="border border-ink-line px-6 py-20 text-center">
              <p className="font-display text-h3">No encontramos nada con esos filtros</p>
              <p className="mx-auto mt-3 max-w-[26rem] text-[15px] leading-relaxed text-bone-3">
                Prueba quitando alguno, o cuéntanos qué buscas y te lo recomendamos nosotros.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <button type="button" onClick={clearAll} className="btn btn-primary">
                  Limpiar filtros
                </button>
                <Link href="/quiz" className="btn btn-quiet">
                  Hacer el test olfativo
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-6">
              {results.map((product, index) => (
                /* Solo la primera fila se escalona: más abajo el retardo
                   acumulado haría esperar por una card que ya está a la vista. */
                <RevealItem
                  key={product.id}
                  index={Math.min(index, 5)}
                  stagger={70}
                  variant="card"
                >
                  <ProductCard
                    product={product}
                    priority={index < 3}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </RevealItem>
              ))}
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros"
        side="left"
        footer={
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="btn btn-primary w-full"
            >
              Ver {results.length} {results.length === 1 ? 'fragancia' : 'fragancias'}
            </button>
            {hasFilters && (
              <button type="button" onClick={clearAll} className="btn btn-quiet w-full">
                Limpiar todo
              </button>
            )}
          </div>
        }
      >
        {panel}
      </Drawer>
    </div>
  )
}
