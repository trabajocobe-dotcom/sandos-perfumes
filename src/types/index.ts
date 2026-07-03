export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image_url: string
  stock: number
  category_id: string
  category?: Category
  notes?: string
  volume?: string
  gender?: 'unisex' | 'masculino' | 'femenino'
  featured?: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
}

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
}

export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago'

export type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  payment_method: PaymentMethod
  shipping_address?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
}

export interface DashboardStats {
  total_orders: number
  total_revenue: number
  total_products: number
  low_stock_count: number
  orders_by_status: { status: OrderStatus; count: number }[]
  revenue_by_payment: { method: PaymentMethod; total: number; percentage: number }[]
  monthly_revenue: { month: string; revenue: number; orders: number }[]
  recent_orders: Order[]
}

export interface WhatsAppMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}
