/* ============================================================================
   Modelo de dominio — Sandós Perfumes
   El vocabulario es el del rubro (pirámide olfativa, familia, concentración,
   duración, estela), no un catálogo genérico de productos.
   ========================================================================== */

/** Familias olfativas canónicas (rueda de Edwards simplificada) */
export type FragranceFamily =
  | 'amaderada'
  | 'citrica'
  | 'floral'
  | 'oriental'
  | 'gourmand'
  | 'acuatica'
  | 'aromatica'
  | 'chipre'

/** Concentración: define precio, duración y proyección */
export type Concentration = 'EDC' | 'EDT' | 'EDP' | 'Parfum' | 'Extrait'

export type Gender = 'unisex' | 'masculino' | 'femenino'

export type Occasion = 'diario' | 'oficina' | 'noche' | 'cita' | 'evento' | 'deporte'

export type Season = 'primavera' | 'verano' | 'otono' | 'invierno'

/**
 * Pirámide olfativa. Es el dato que más pesa en la decisión de compra online:
 * sin poder oler, el comprador se guía por las notas.
 */
export interface OlfactivePyramid {
  /** Salida — primeros 15 min */
  top: string[]
  /** Corazón — el carácter, 2 a 4 h */
  heart: string[]
  /** Fondo — la estela que queda */
  base: string[]
}

export interface Product {
  id: string
  name: string
  /** Casa / marca. Se muestra sobre el nombre en las cards. */
  house: string
  slug: string
  /** Frase corta y evocativa. Va en la card y en el hero de la ficha. */
  tagline: string
  description: string
  price: number
  /** Precio anterior. Si existe y es mayor, la ficha muestra el descuento. */
  compare_at_price?: number
  image_url: string
  /** Imágenes adicionales para la galería de la ficha. */
  gallery?: string[]
  stock: number
  category_id: string
  category?: Category
  family: FragranceFamily
  pyramid: OlfactivePyramid
  /**
   * Línea corta de notas destacadas. DERIVADA de `pyramid` (ver `notesLine`),
   * nunca se escribe a mano: existe solo para listados densos y el PDF del panel.
   */
  notes?: string
  concentration: Concentration
  /** Duración en piel, 1-5. Se dibuja como medidor. */
  longevity: number
  /** Estela / proyección, 1-5. */
  sillage: number
  volume: string
  gender: Gender
  occasions: Occasion[]
  seasons: Season[]
  /** ¿Hay muestra de 2 ml? Palanca nº1 contra el abandono por incertidumbre. */
  sample_available: boolean
  sample_price?: number
  rating: number
  review_count: number
  featured?: boolean
  /** Ingreso reciente al catálogo. */
  is_new?: boolean
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
  /** true cuando el ítem es la muestra de 2 ml y no el frasco completo */
  is_sample?: boolean
}

export interface Review {
  id: string
  product_id: string
  author: string
  rating: number
  title: string
  body: string
  /** Verificación de compra: sube la confianza más que el propio texto. */
  verified: boolean
  created_at: string
}

export type PaymentMethod = 'efectivo' | 'transferencia' | 'mercadopago'

export type ShippingMethod = 'domicilio' | 'sucursal' | 'retiro'

export type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  subtotal: number
  shipping_cost: number
  discount: number
  total: number
  status: OrderStatus
  payment_method: PaymentMethod
  shipping_method?: ShippingMethod
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  shipping_address?: string
  shipping_city?: string
  shipping_zip?: string
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
  is_sample?: boolean
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

/* ---- Quiz de firma olfativa ---- */

export interface QuizOption {
  value: string
  label: string
  hint: string
  /** Familias que suma esta respuesta al perfil del usuario. */
  families: FragranceFamily[]
}

export interface QuizQuestion {
  id: string
  question: string
  overline: string
  options: QuizOption[]
}
