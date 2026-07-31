import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/blog'
import { products, FAMILIES } from '@/lib/demo-data'
import { LEGAL_PAGES } from '@/lib/legal'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE.url}/catalogo`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/quiz`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE.url}/muestras`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]

  const postRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  // Las páginas de familia son las que capturan la búsqueda por sensación
  // ("perfume amaderado", "fragancia cítrica"), que es como busca la mayoría.
  const familyRoutes: MetadataRoute.Sitemap = FAMILIES.map((family) => ({
    url: `${SITE.url}/catalogo?familia=${family.key}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE.url}/producto/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const legalRoutes: MetadataRoute.Sitemap = LEGAL_PAGES.map((page) => ({
    url: `${SITE.url}/legal/${page.slug}`,
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.3,
  }))

  return [...staticRoutes, ...familyRoutes, ...productRoutes, ...postRoutes, ...legalRoutes]
}
