import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MessageCircle, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { NotePyramid } from '@/components/fragrance/NotePyramid'
import { ScentMeter } from '@/components/fragrance/ScentMeter'
import { ProductPurchase } from '@/components/product/ProductPurchase'
import { RecentlyViewed } from '@/components/product/RecentlyViewed'
import { ProductImage } from '@/components/ui/ProductImage'
import { Rating } from '@/components/ui/Rating'
import { Reveal } from '@/components/ui/Reveal'
import {
  CONCENTRATION_HELP,
  GENDER_LABEL,
  LONGEVITY_LABEL,
  OCCASION_LABEL,
  SEASON_LABEL,
  SILLAGE_LABEL,
  discountPercent,
  getProduct,
  isOnSale,
  relatedProducts,
} from '@/lib/catalog'
import { familyByKey, products, reviewsFor } from '@/lib/demo-data'
import { SITE } from '@/lib/site'
import { formatCurrency, formatDate } from '@/lib/utils'
import { whatsappProduct } from '@/lib/whatsapp'

/** Prerendera todas las fichas en el build: se sirven como HTML estático. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) return { title: 'Fragancia no encontrada' }

  const title = `${product.house} ${product.name} ${product.volume}`
  const description = `${product.tagline}. ${product.pyramid.top[0]}, ${product.pyramid.heart[0]} y ${product.pyramid.base[0]}. ${product.concentration} · duración ${LONGEVITY_LABEL[product.longevity].toLowerCase()}. Muestra de 2 ml disponible.`

  return {
    title,
    description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${title} · ${SITE.name}`,
      description,
      url: `${SITE.url}/producto/${product.slug}`,
      images: [{ url: product.image_url, width: 1200, height: 1200, alt: title }],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)

  if (!product) notFound()

  const family = familyByKey(product.family)
  const related = relatedProducts(product, 4)
  const reviews = reviewsFor(product.id)
  const sale = isOnSale(product)

  /**
   * Datos estructurados de producto: es lo que habilita precio, disponibilidad
   * y estrellas en el resultado de Google. En e-commerce eso mueve el CTR.
   */
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.house} ${product.name}`,
    description: product.description,
    image: [product.image_url],
    sku: product.id,
    brand: { '@type': 'Brand', name: product.house },
    category: family?.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
      bestRating: 5,
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE.url}/producto/${product.slug}`,
      priceCurrency: SITE.currency,
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE.name },
    },
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: review.author },
      datePublished: review.created_at,
      name: review.title,
      reviewBody: review.body,
      reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5 },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: 'Catálogo', item: `${SITE.url}/catalogo` },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${SITE.url}/producto/${product.slug}`,
      },
    ],
  }

  return (
    <>
      <div className="shell pt-10">
        <nav aria-label="Ruta de navegación" className="miga">
          <Link href="/" className="transition-colors hover:text-bone">
            Inicio
          </Link>
          <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
          <Link href="/catalogo" className="transition-colors hover:text-bone">
            Catálogo
          </Link>
          <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
          <Link
            href={`/catalogo?familia=${product.family}`}
            className="transition-colors hover:text-bone"
          >
            {family?.name}
          </Link>
          <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
          <span className="text-bone-2">{product.name}</span>
        </nav>
      </div>

      {/* ── Bloque principal ─────────────────────────────────────────────── */}
      <section className="shell grid gap-12 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
        <div className="relative">
          <div className="haze inset-0 h-full w-full opacity-60" aria-hidden="true" />
          <div className="relative aspect-square overflow-hidden bg-ink-raised lg:sticky lg:top-28">
            <ProductImage
              src={product.image_url}
              alt={`${product.house} ${product.name}`}
              priority
              sizes="(max-width: 1024px) 100vw, 46vw"
              static
            />
            {sale && (
              <span className="absolute left-4 top-4 rounded-brand bg-gilt px-3 py-1.5 text-micro font-semibold uppercase tracking-[0.16em] text-gilt-ink">
                −{discountPercent(product)}%
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="overline overline-gilt">{product.house}</p>
          <h1 className="mt-3 text-h1">{product.name}</h1>
          <p className="mt-3 text-lead italic text-bone-2">{product.tagline}</p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.review_count} size="md" showValue />
            <Link
              href={`/catalogo?familia=${product.family}`}
              className="chip"
              aria-label={`Ver otras fragancias de la familia ${family?.name}`}
            >
              {family?.name}
            </Link>
          </div>

          {sale && (
            <p className="tnum mt-6 text-[15px] text-bone-3">
              Precio de lista{' '}
              <span className="line-through">{formatCurrency(product.compare_at_price!)}</span>
            </p>
          )}

          <div className="mt-8 border-t border-ink-line pt-8">
            <ProductPurchase product={product} />
          </div>

          <p className="mt-8 max-w-prose text-[16px] leading-[1.85] text-bone-2">
            {product.description}
          </p>

          {/* Duración y estela: los dos datos que más se consultan */}
          <div className="mt-9 grid gap-6 border-t border-ink-line pt-8 sm:grid-cols-2">
            <ScentMeter
              label="Duración en piel"
              value={product.longevity}
              caption={LONGEVITY_LABEL[product.longevity]}
            />
            <ScentMeter
              label="Estela / proyección"
              value={product.sillage}
              caption={SILLAGE_LABEL[product.sillage]}
            />
          </div>

          <dl className="mt-8 grid gap-x-8 gap-y-5 border-t border-ink-line pt-8 sm:grid-cols-2">
            <Spec label="Concentración" value={product.concentration}>
              <span className="mt-1 block text-[13px] text-bone-3">
                {CONCENTRATION_HELP[product.concentration]}
              </span>
            </Spec>
            <Spec label="Presentación" value={product.volume} />
            <Spec label="Recomendado para" value={GENDER_LABEL[product.gender]} />
            <Spec
              label="Estaciones"
              value={product.seasons.map((season) => SEASON_LABEL[season]).join(' · ')}
            />
            <div className="sm:col-span-2">
              <dt className="overline">Ocasiones</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {product.occasions.map((occasion) => (
                  <Link key={occasion} href={`/catalogo?ocasion=${occasion}`} className="chip">
                    {OCCASION_LABEL[occasion]}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>

          {/* Garantías junto al botón, que es donde aparece la duda */}
          <ul className="mt-9 grid gap-4 border-t border-ink-line pt-8 sm:grid-cols-2">
            <Assurance icon={ShieldCheck} text="Original, de distribuidor autorizado" />
            <Assurance
              icon={Truck}
              text={`Envío gratis desde ${formatCurrency(SITE.commerce.freeShippingThreshold)}`}
            />
            <Assurance icon={RotateCcw} text={`Cambios por ${SITE.commerce.returnDays} días`} />
            <li>
              <a
                href={whatsappProduct(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 text-[14px] text-bone-2 transition-colors hover:text-gilt"
              >
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-gilt" strokeWidth={1.5} />
                Consultar por WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* ── Pirámide olfativa ────────────────────────────────────────────── */}
      <Reveal as="section" className="border-y border-ink-line bg-ink-raised">
        <div className="shell grid gap-10 py-[var(--spacing-section)] lg:grid-cols-[20rem_1fr] lg:gap-16">
          <div>
            <p className="overline">Cómo huele</p>
            <h2 className="mt-4 text-h2">
              Pirámide <span className="accent-word">olfativa</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-bone-3">
              Un perfume no huele igual a los cinco minutos que a las cuatro horas. Estas son las
              tres capas de {product.name} y cuándo aparece cada una.
            </p>
          </div>

          <NotePyramid pyramid={product.pyramid} />
        </div>
      </Reveal>

      {/* ── Reseñas ──────────────────────────────────────────────────────── */}
      {reviews.length > 0 && (
        <Reveal as="section" className="shell py-[var(--spacing-section)]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="overline">Opiniones verificadas</p>
              <h2 className="mt-4 text-h2">Lo que dicen quienes lo usan</h2>
            </div>
            <Rating value={product.rating} count={product.review_count} size="md" showValue />
          </div>

          <ul className="mt-12 grid gap-px border border-ink-line bg-ink-line md:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id} className="bg-ink p-8">
                <div className="flex items-center justify-between gap-4">
                  <Rating value={review.rating} />
                  <span className="text-[13px] text-bone-3">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-h3">{review.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.8] text-bone-2">{review.body}</p>
                <p className="overline mt-5">
                  {review.author}
                  {review.verified && <span className="ml-2 text-gilt">Compra verificada</span>}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {/* ── Cross-sell por afinidad olfativa ─────────────────────────────── */}
      {related.length > 0 && (
        <Reveal as="section" className="shell pb-[var(--spacing-section)]">
          <p className="overline">Afinidad olfativa</p>
          <h2 className="mt-4 max-w-[30rem] text-h2">
            Si te gusta {product.name}, <span className="accent-word">prueba</span> estos
          </h2>
          <p className="mt-4 max-w-[34rem] text-[15px] leading-relaxed text-bone-3">
            Ordenados por notas compartidas y familia, no por lo que más nos convenga vender.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} sizes="(max-width: 768px) 50vw, 25vw" />
            ))}
          </div>
        </Reveal>
      )}

      <RecentlyViewed currentId={product.id} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}

function Spec({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children?: React.ReactNode
}) {
  return (
    <div>
      <dt className="overline">{label}</dt>
      <dd className="mt-1.5 text-[15px] text-bone">
        {value}
        {children}
      </dd>
    </div>
  )
}

function Assurance({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>
  text: string
}) {
  return (
    <li className="flex items-start gap-2.5 text-[14px] text-bone-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-gilt" strokeWidth={1.5} />
      {text}
    </li>
  )
}
