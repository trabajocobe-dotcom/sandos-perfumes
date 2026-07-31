'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { createPersistentStore } from '@/lib/persistent-store'
import { getProduct } from '@/lib/catalog'
import type { Product } from '@/types'

const MAX = 8
const EMPTY: string[] = []

const store = createPersistentStore<string[]>('sandos_recently_viewed', EMPTY, {
  revive: (raw) =>
    Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : EMPTY,
})

/**
 * Vistos recientemente. Devolver al comprador a la fragancia que estuvo mirando
 * es de las recuperaciones más baratas que existen en una tienda.
 *
 * @param currentId Si se pasa, registra ese producto y lo excluye del listado.
 */
export function useRecentlyViewed(currentId?: string): Product[] {
  const ids = useSyncExternalStore(store.subscribe, store.get, store.getServer)

  useEffect(() => {
    if (!currentId) return
    store.set((prev) => [currentId, ...prev.filter((id) => id !== currentId)].slice(0, MAX))
  }, [currentId])

  return ids
    .filter((id) => id !== currentId)
    .map(getProduct)
    .filter((p): p is Product => Boolean(p))
}
