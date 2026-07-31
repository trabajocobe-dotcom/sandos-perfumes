import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(date: string | Date): string {
  return dateFormatter.format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Ajusta el ancho pedido en URLs de Unsplash/Pexels.
 * Añade el parámetro si no existe, en lugar de fallar en silencio.
 */
export function optimizeImageUrl(url: string, width = 800): string {
  if (!url) return url
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('w', String(width))
    return parsed.toString()
  } catch {
    return url
  }
}

/** Recorta un texto sin partir palabras. */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`
}
