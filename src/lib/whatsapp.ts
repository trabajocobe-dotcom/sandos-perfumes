/**
 * Armado de mensajes de WhatsApp.
 * El pedido llega al vendedor ya legible, sin que nadie tenga que transcribir.
 */

import { SITE } from './site'
import { formatCurrency } from './utils'
import type { CartItem, Product } from '@/types'

function link(text: string): string {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(text)}`
}

/** Consulta general desde el header o el footer. */
export function whatsappGeneral(): string {
  return link(`¡Hola ${SITE.shortName}! Quería hacerles una consulta.`)
}

/** Consulta sobre una fragancia puntual, desde la ficha de producto. */
export function whatsappProduct(product: Product): string {
  return link(
    `¡Hola ${SITE.shortName}! Me interesa *${product.house} ${product.name}* (${product.volume}, ${product.concentration}) — ${formatCurrency(product.price)}.\n\n¿Tienen stock disponible?\n${SITE.url}/producto/${product.slug}`
  )
}

/** Pedir la muestra de 2 ml antes de comprar el frasco. */
export function whatsappSample(product: Product): string {
  return link(
    `¡Hola ${SITE.shortName}! Antes de llevar el frasco quería probar la muestra de 2 ml de *${product.house} ${product.name}*. ¿Cómo la consigo?`
  )
}

interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  customer?: {
    name?: string
    phone?: string
    address?: string
    city?: string
    zip?: string
    payment?: string
    notes?: string
  }
  orderId?: string
}

/** Pedido completo: lo que el vendedor necesita para despachar. */
export function whatsappOrder(order: OrderSummary): string {
  const lines: string[] = []

  lines.push(`*NUEVO PEDIDO — ${SITE.name}*`)
  if (order.orderId) lines.push(`Referencia: ${order.orderId}`)
  lines.push('')
  lines.push('*Productos*')

  for (const item of order.items) {
    const label = item.is_sample
      ? `${item.product.house} ${item.product.name} — muestra 2 ml`
      : `${item.product.house} ${item.product.name} — ${item.product.volume}`
    const unit = item.is_sample ? (item.product.sample_price ?? 0) : item.product.price
    lines.push(`• ${item.quantity} × ${label} — ${formatCurrency(unit * item.quantity)}`)
  }

  lines.push('')
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`)
  lines.push(
    `Envío: ${order.shipping === 0 ? 'Gratis' : formatCurrency(order.shipping)}`
  )
  lines.push(`*Total: ${formatCurrency(order.total)}*`)

  const c = order.customer
  if (c) {
    lines.push('')
    lines.push('*Datos de envío*')
    if (c.name) lines.push(`Nombre: ${c.name}`)
    if (c.phone) lines.push(`Teléfono: ${c.phone}`)
    if (c.address) lines.push(`Dirección: ${c.address}`)
    if (c.city || c.zip) lines.push(`Localidad: ${[c.city, c.zip].filter(Boolean).join(' · ')}`)
    if (c.payment) lines.push(`Pago: ${c.payment}`)
    if (c.notes) lines.push(`Notas: ${c.notes}`)
  }

  return link(lines.join('\n'))
}
