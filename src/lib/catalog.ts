/**
 * Consultas sobre el catálogo. Toda la lógica de búsqueda, filtrado y orden
 * vive aquí para que las páginas solo se ocupen de presentar.
 */

import { products, FAMILIES } from './demo-data'
import type {
  FragranceFamily,
  Gender,
  Occasion,
  Product,
  Season,
} from '@/types'

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price-asc', label: 'Precio: menor a mayor' },
  { value: 'price-desc', label: 'Precio: mayor a menor' },
  { value: 'rating', label: 'Mejor puntuados' },
  { value: 'new', label: 'Novedades' },
] as const

export type SortKey = (typeof SORT_OPTIONS)[number]['value']

export interface CatalogFilters {
  search?: string
  families?: FragranceFamily[]
  genders?: Gender[]
  occasions?: Occasion[]
  seasons?: Season[]
  notes?: string[]
  minPrice?: number
  maxPrice?: number
  onlyInStock?: boolean
  onlyOnSale?: boolean
  sort?: SortKey
}

/** Todas las notas del catálogo, ordenadas por frecuencia. */
export function allNotes(): { note: string; count: number }[] {
  const counts = new Map<string, number>()
  for (const p of products) {
    for (const note of [...p.pyramid.top, ...p.pyramid.heart, ...p.pyramid.base]) {
      counts.set(note, (counts.get(note) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .map(([note, count]) => ({ note, count }))
    .sort((a, b) => b.count - a.count || a.note.localeCompare(b.note))
}

export function productNotes(p: Product): string[] {
  return [...p.pyramid.top, ...p.pyramid.heart, ...p.pyramid.base]
}

export function priceBounds(): { min: number; max: number } {
  const prices = products.map((p) => p.price)
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

export function countByFamily(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of products) counts[p.family] = (counts[p.family] ?? 0) + 1
  return counts
}

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

/** Busca en nombre, casa, tagline, descripción y notas. Tolera acentos. */
export function matchesSearch(p: Product, rawQuery: string): boolean {
  const q = normalize(rawQuery.trim())
  if (!q) return true
  const haystack = normalize(
    [p.name, p.house, p.tagline, p.description, p.family, ...productNotes(p)].join(' ')
  )
  return q.split(/\s+/).every((term) => haystack.includes(term))
}

export function filterProducts(filters: CatalogFilters, source = products): Product[] {
  const {
    search = '',
    families = [],
    genders = [],
    occasions = [],
    seasons = [],
    notes = [],
    minPrice,
    maxPrice,
    onlyInStock,
    onlyOnSale,
    sort = 'relevance',
  } = filters

  const result = source.filter((p) => {
    if (!matchesSearch(p, search)) return false
    if (families.length && !families.includes(p.family)) return false
    if (genders.length && !genders.includes(p.gender)) return false
    if (occasions.length && !occasions.some((o) => p.occasions.includes(o))) return false
    if (seasons.length && !seasons.some((s) => p.seasons.includes(s))) return false
    if (notes.length) {
      const own = productNotes(p).map(normalize)
      if (!notes.some((n) => own.includes(normalize(n)))) return false
    }
    if (minPrice != null && p.price < minPrice) return false
    if (maxPrice != null && p.price > maxPrice) return false
    if (onlyInStock && p.stock <= 0) return false
    if (onlyOnSale && !isOnSale(p)) return false
    return true
  })

  return sortProducts(result, sort)
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const sorted = [...list]
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.review_count - a.review_count)
    case 'new':
      return sorted.sort(
        (a, b) => Number(b.is_new ?? false) - Number(a.is_new ?? false) ||
          b.created_at.localeCompare(a.created_at)
      )
    default:
      // Relevancia: destacados primero, luego mejor puntuados con más reseñas
      return sorted.sort(
        (a, b) =>
          Number(b.featured ?? false) - Number(a.featured ?? false) ||
          b.rating * Math.log10(b.review_count + 10) -
            a.rating * Math.log10(a.review_count + 10)
      )
  }
}

export const getProduct = (idOrSlug: string): Product | undefined =>
  products.find((p) => p.id === idOrSlug || p.slug === idOrSlug)

export const isOnSale = (p: Product): boolean =>
  p.compare_at_price != null && p.compare_at_price > p.price

export const discountPercent = (p: Product): number =>
  isOnSale(p) ? Math.round((1 - p.price / p.compare_at_price!) * 100) : 0

/**
 * Recomendación por afinidad olfativa: comparte familia y notas.
 * Es la base del "si te gusta X, prueba Y", el cross-sell propio del rubro.
 */
export function relatedProducts(p: Product, limit = 4): Product[] {
  const own = new Set(productNotes(p).map(normalize))

  return products
    .filter((c) => c.id !== p.id)
    .map((c) => {
      const shared = productNotes(c).filter((n) => own.has(normalize(n))).length
      const sameFamily = c.family === p.family ? 3 : 0
      const sameGender = c.gender === p.gender || c.gender === 'unisex' ? 1 : 0
      const closePrice = Math.abs(c.price - p.price) < 25000 ? 1 : 0
      return { product: c, score: shared * 2 + sameFamily + sameGender + closePrice }
    })
    .sort((a, b) => b.score - a.score || b.product.rating - a.product.rating)
    .slice(0, limit)
    .map((x) => x.product)
}

export const featuredProducts = (limit = 4) =>
  sortProducts(products.filter((p) => p.featured), 'relevance').slice(0, limit)

export const newArrivals = (limit = 4) =>
  sortProducts(products.filter((p) => p.is_new), 'new').slice(0, limit)

export const onSaleProducts = (limit = 4) =>
  sortProducts(products.filter(isOnSale), 'relevance').slice(0, limit)

export const bestSellers = (limit = 4) =>
  [...products].sort((a, b) => b.review_count - a.review_count).slice(0, limit)

/** Sugerencias del buscador del header. */
export function searchSuggestions(query: string, limit = 6): Product[] {
  if (!query.trim()) return []
  return products.filter((p) => matchesSearch(p, query)).slice(0, limit)
}

/* ---- Etiquetas legibles ---- */

export const GENDER_LABEL: Record<Gender, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  unisex: 'Unisex',
}

export const OCCASION_LABEL: Record<Occasion, string> = {
  diario: 'Uso diario',
  oficina: 'Oficina',
  noche: 'Noche',
  cita: 'Cita',
  evento: 'Evento',
  deporte: 'Deporte',
}

export const SEASON_LABEL: Record<Season, string> = {
  primavera: 'Primavera',
  verano: 'Verano',
  otono: 'Otoño',
  invierno: 'Invierno',
}

export const CONCENTRATION_HELP: Record<string, string> = {
  EDC: 'Eau de Cologne · 2-4% de esencia · 2 h aprox.',
  EDT: 'Eau de Toilette · 5-15% de esencia · 4-6 h aprox.',
  EDP: 'Eau de Parfum · 15-20% de esencia · 6-8 h aprox.',
  Parfum: 'Parfum · 20-30% de esencia · 8-12 h aprox.',
  Extrait: 'Extrait de Parfum · 30%+ de esencia · 12 h o más.',
}

export const LONGEVITY_LABEL = ['', 'Muy corta', 'Corta', 'Media', 'Larga', 'Muy larga']
export const SILLAGE_LABEL = ['', 'Íntima', 'Discreta', 'Moderada', 'Notoria', 'Envolvente']

export { FAMILIES }
