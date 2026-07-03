/**
 * Servicio de datos para Supabase.
 *
 * Cuando las variables de entorno están configuradas, usa Supabase.
 * Si no, usa los datos de demo (`lib/demo-data.ts`).
 *
 * Así la app funciona en ambos modos sin cambiar código.
 */

import { createClient } from './client'
import type { Product, Category, Order, DashboardStats } from '@/types'
import { products as demoProducts, categories as demoCategories, demoOrders } from '@/lib/demo-data'

const isConfigured = !!(
  typeof window !== 'undefined' &&
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project' &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('your-project')
)

// ===== PRODUCTOS =====

export async function getProducts(): Promise<Product[]> {
  if (!isConfigured) return demoProducts

  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false })

  return (data as Product[]) || []
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isConfigured) return demoProducts.find((p) => p.id === id) || null

  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single()

  return data as Product | null
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isConfigured) return demoProducts.filter((p) => p.featured)

  const supabase = createClient()
  const { data } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('featured', true)
    .limit(10)

  return (data as Product[]) || []
}

// ===== CATEGORÍAS =====

export async function getCategories(): Promise<Category[]> {
  if (!isConfigured) return demoCategories

  const supabase = createClient()
  const { data } = await supabase.from('categories').select('*').order('name')

  return (data as Category[]) || []
}

// ===== ÓRDENES (demo) =====
// Cuando Supabase esté activo, las órdenes se crean desde el checkout.

export async function getOrders(userId?: string): Promise<Order[]> {
  if (!isConfigured) return demoOrders

  const supabase = createClient()
  let query = supabase
    .from('orders')
    .select('*, items:order_items(*)')
    .order('created_at', { ascending: false })

  if (userId) query = query.eq('user_id', userId)

  const { data } = await query
  return (data as Order[]) || []
}

// ===== DASHBOARD STATS =====

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isConfigured) {
    const totalRevenue = demoOrders.reduce((a, o) => a + o.total, 0)
    const paymentMethods = ['efectivo', 'transferencia', 'mercadopago'] as const
    const revenueByPayment = paymentMethods.map((method) => {
      const total = demoOrders
        .filter((o) => o.payment_method === method)
        .reduce((a, o) => a + o.total, 0)
      return {
        method,
        total,
        percentage: totalRevenue > 0 ? Math.round((total / totalRevenue) * 100) : 0,
      }
    })

    return {
      total_orders: demoOrders.length,
      total_revenue: totalRevenue,
      total_products: demoProducts.length,
      low_stock_count: demoProducts.filter((p) => p.stock <= 5).length,
      orders_by_status: [],
      revenue_by_payment: revenueByPayment,
      monthly_revenue: [],
      recent_orders: demoOrders.slice(0, 5),
    }
  }

  // TODO: implementar queries reales a Supabase para estadísticas
  return {
    total_orders: 0,
    total_revenue: 0,
    total_products: 0,
    low_stock_count: 0,
    orders_by_status: [],
    revenue_by_payment: [],
    monthly_revenue: [],
    recent_orders: [],
  }
}
