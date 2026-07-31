import type { Order, OrderItem, PaymentMethod, ShippingMethod } from '@/types'
import { demoOrders } from './demo-data'

const ORDERS_KEY = 'sandos_orders_v2'

function readOrders(): Order[] {
  if (typeof window === 'undefined') return demoOrders
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY)
    if (raw) return JSON.parse(raw)
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(demoOrders))
  } catch {
    // Storage bloqueado (modo privado): se opera con los datos de demostración.
  }
  return demoOrders
}

function writeOrders(orders: Order[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
  } catch (error) {
    console.warn('[orders] no se pudo persistir el pedido', error)
  }
}

export function getOrders(): Order[] {
  return readOrders()
}

export function getOrderById(id: string): Order | undefined {
  return readOrders().find((order) => order.id === id)
}

export interface CreateOrderParams {
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  discount?: number
  payment_method: PaymentMethod
  shipping_method?: ShippingMethod
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  shipping_city?: string
  shipping_zip?: string
  notes?: string
}

/** Referencia legible por humanos: se dicta por teléfono sin equivocarse. */
function newOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).slice(2, 5).toUpperCase()
  return `SND-${stamp}-${random}`
}

export function createOrder(params: CreateOrderParams): Order {
  const discount = params.discount ?? 0
  const order: Order = {
    id: newOrderId(),
    user_id: 'demo-user',
    items: params.items,
    subtotal: params.subtotal,
    shipping_cost: params.shipping_cost,
    discount,
    total: params.subtotal + params.shipping_cost - discount,
    status: 'pendiente',
    payment_method: params.payment_method,
    shipping_method: params.shipping_method,
    customer_name: params.customer_name,
    customer_email: params.customer_email,
    customer_phone: params.customer_phone,
    shipping_address: params.shipping_address,
    shipping_city: params.shipping_city,
    shipping_zip: params.shipping_zip,
    notes: params.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  writeOrders([order, ...readOrders()])
  return order
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order | undefined {
  const orders = readOrders()
  const index = orders.findIndex((order) => order.id === orderId)
  if (index === -1) return undefined

  orders[index] = { ...orders[index], status, updated_at: new Date().toISOString() }
  writeOrders(orders)
  return orders[index]
}

export function deleteOrder(orderId: string): boolean {
  const orders = readOrders()
  const remaining = orders.filter((order) => order.id !== orderId)
  if (remaining.length === orders.length) return false

  writeOrders(remaining)
  return true
}

export function resetOrders() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ORDERS_KEY)
}
