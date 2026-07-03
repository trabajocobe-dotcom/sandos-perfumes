'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ProductCard } from '@/components/catalog/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { products, categories } from '@/lib/demo-data'

export default function CatalogPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [debouncedSearch, selectedCategory])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    products.forEach((p) => { counts[p.category_id] = (counts[p.category_id] || 0) + 1 })
    return counts
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !debouncedSearch ||
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        p.description.toLowerCase().includes(debouncedSearch.toLowerCase())
      const matchesCategory = !selectedCategory || p.category_id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [debouncedSearch, selectedCategory])

  const hasFilters = debouncedSearch || selectedCategory

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold/60">Catálogo</span>
            <h1 className="mt-2 font-serif text-4xl font-bold text-cream">Nuestras Fragancias</h1>
            <p className="mt-2 text-cream/50">
              {filtered.length} {filtered.length === 1 ? 'fragancia' : 'fragancias'} disponibles
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-cream/30" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar fragancia…"
                className="pl-10 bg-cream/5 border-cream/10 text-cream placeholder:text-cream/30"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/30 hover:text-cream cursor-pointer"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                Todas
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? 'secondary' : 'outline'}
                  size="sm"
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                  }
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-60">({categoryCounts[cat.id] || 0})</span>
                </Button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-20 text-center">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-cream/5 border border-cream/5">
                <SlidersHorizontal className="size-8 text-cream/30" />
              </div>
              <p className="text-lg text-cream/60">No encontramos fragancias con esos criterios.</p>
              <p className="mt-1 text-sm text-cream/30">Probá con otros términos o categorías.</p>
              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => { setSearch(''); setDebouncedSearch(''); setSelectedCategory(null) }}
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
