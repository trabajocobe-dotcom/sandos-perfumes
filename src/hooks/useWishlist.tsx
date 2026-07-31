'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'
import { createPersistentStore } from '@/lib/persistent-store'
import { getProduct } from '@/lib/catalog'
import type { Product } from '@/types'

const EMPTY: string[] = []

const store = createPersistentStore<string[]>('sandos_wishlist', EMPTY, {
  revive: (raw) =>
    Array.isArray(raw) ? raw.filter((id): id is string => typeof id === 'string') : EMPTY,
})

interface WishlistContextValue {
  ids: string[]
  products: Product[]
  has: (productId: string) => boolean
  toggle: (productId: string) => boolean
  remove: (productId: string) => void
  clear: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const ids = useSyncExternalStore(store.subscribe, store.get, store.getServer)

  /** Devuelve true si quedó agregado, false si se quitó. */
  const toggle = useCallback((productId: string) => {
    const willAdd = !store.get().includes(productId)
    store.set((prev) =>
      willAdd ? [...prev, productId] : prev.filter((id) => id !== productId)
    )
    return willAdd
  }, [])

  const remove = useCallback((productId: string) => {
    store.set((prev) => prev.filter((id) => id !== productId))
  }, [])

  const clear = useCallback(() => store.set([]), [])

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      products: ids.map(getProduct).filter((p): p is Product => Boolean(p)),
      has: (productId: string) => ids.includes(productId),
      toggle,
      remove,
      clear,
      count: ids.length,
    }),
    [ids, toggle, remove, clear]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist debe usarse dentro de WishlistProvider')
  return ctx
}
