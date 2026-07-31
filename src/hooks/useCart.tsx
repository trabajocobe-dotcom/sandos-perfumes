'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import { createPersistentStore } from '@/lib/persistent-store'
import { SITE } from '@/lib/site'
import { getProduct } from '@/lib/catalog'
import type { CartItem, Product } from '@/types'

const EMPTY: CartItem[] = []

/**
 * Se revive contra el catálogo actual: si un precio cambió o un producto ya no
 * existe, el carrito guardado no puede quedar cobrando un importe viejo.
 */
const store = createPersistentStore<CartItem[]>('sandos_cart_v2', EMPTY, {
  revive: (raw) => {
    if (!Array.isArray(raw)) return EMPTY
    return raw.flatMap((item): CartItem[] => {
      const fresh = getProduct(item?.product_id)
      if (!fresh) return []
      const quantity = Math.max(1, Math.min(Number(item.quantity) || 1, fresh.stock || 1))
      return [{
        id: String(item.id ?? `${fresh.id}-${item.is_sample ? 'sample' : 'full'}`),
        product_id: fresh.id,
        product: fresh,
        quantity,
        is_sample: Boolean(item.is_sample),
      }]
    })
  },
})

const lineKey = (productId: string, isSample: boolean) =>
  `${productId}-${isSample ? 'sample' : 'full'}`

export const unitPrice = (item: CartItem): number =>
  item.is_sample ? item.product.sample_price ?? 0 : item.product.price

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, options?: { sample?: boolean }) => void
  removeItem: (lineId: string) => void
  updateQuantity: (lineId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  shippingCost: number
  total: number
  /** Cuánto falta para el envío gratis. 0 cuando ya se alcanzó. */
  remainingForFreeShipping: number
  freeShippingProgress: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(store.subscribe, store.get, store.getServer)
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback(
    (product: Product, quantity = 1, options: { sample?: boolean } = {}) => {
      const isSample = Boolean(options.sample)
      const id = lineKey(product.id, isSample)

      store.set((prev) => {
        const existing = prev.find((i) => i.id === id)
        if (existing) {
          const max = isSample ? 5 : product.stock
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(i.quantity + quantity, max) } : i
          )
        }
        return [...prev, { id, product_id: product.id, product, quantity, is_sample: isSample }]
      })
      setIsOpen(true)
    },
    []
  )

  const removeItem = useCallback((lineId: string) => {
    store.set((prev) => prev.filter((i) => i.id !== lineId))
  }, [])

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    if (quantity <= 0) {
      store.set((prev) => prev.filter((i) => i.id !== lineId))
      return
    }
    store.set((prev) =>
      prev.map((i) => {
        if (i.id !== lineId) return i
        const max = i.is_sample ? 5 : i.product.stock
        return { ...i, quantity: Math.min(quantity, max) }
      })
    )
  }, [])

  const clearCart = useCallback(() => store.set([]), [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
    const subtotal = items.reduce((acc, i) => acc + unitPrice(i) * i.quantity, 0)
    const threshold: number = SITE.commerce.freeShippingThreshold
    const qualifies = subtotal >= threshold
    const shippingCost = subtotal === 0 || qualifies ? 0 : SITE.commerce.shippingCostBogota

    return {
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      remainingForFreeShipping: qualifies ? 0 : threshold - subtotal,
      freeShippingProgress: Math.min(1, threshold === 0 ? 1 : subtotal / threshold),
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }
  }, [items, isOpen, addItem, removeItem, updateQuantity, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
