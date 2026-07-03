'use client'

import { createContext, useContext, useCallback, useSyncExternalStore } from 'react'
import type { CartItem, Product } from '@/types'

let cached: CartItem[] = []
let listeners = new Set<() => void>()

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('sandos_cart')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function getSnapshot(): CartItem[] {
  return cached
}

function subscribe(notify: () => void) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

function writeCart(items: CartItem[]) {
  cached = items
  localStorage.setItem('sandos_cart', JSON.stringify(items))
  listeners.forEach((fn) => fn())
}

// init cache
cached = readCart()

interface CartContextValue {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const addItem = useCallback((product: Product, quantity = 1) => {
    const current = [...cached]
    const existing = current.find((i) => i.product_id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      current.push({
        id: crypto.randomUUID(),
        product_id: product.id,
        product,
        quantity,
      })
    }
    writeCart(current)
  }, [])

  const removeItem = useCallback((productId: string) => {
    writeCart(cached.filter((i) => i.product_id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    const current = [...cached]
    const item = current.find((i) => i.product_id === productId)
    if (item) {
      item.quantity = quantity
      writeCart(current)
    }
  }, [removeItem])

  const clearCart = useCallback(() => {
    writeCart([])
  }, [])

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0)
  const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
