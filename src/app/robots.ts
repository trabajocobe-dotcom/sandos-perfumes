import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // El panel, el login y los pasos de compra no aportan nada al índice
        // y pueden filtrar datos de pedidos en los resultados.
        disallow: ['/dashboard', '/auth', '/checkout', '/carrito', '/favoritos'],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
