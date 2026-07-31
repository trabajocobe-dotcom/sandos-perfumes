import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/commerce/ProductCard'
import { ProductImage } from '@/components/ui/ProductImage'
import { Reveal } from '@/components/ui/Reveal'
import { POSTS, getPost, otherPosts } from '@/lib/blog'
import { getProduct } from '@/lib/catalog'
import { SITE } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import type { Product } from '@/types'

export function generateStaticParams() {
  return POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) return { title: 'Artículo no encontrado' }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: `${post.title} · ${SITE.name}`,
      description: post.excerpt,
      url: `${SITE.url}/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.image, width: 1400, height: 933, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) notFound()

  const related = post.relatedProducts
    .map(getProduct)
    .filter((product): product is Product => Boolean(product))

  const more = otherPosts(post.slug, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    mainEntityOfPage: `${SITE.url}/blog/${post.slug}`,
  }

  return (
    <>
      <article>
        <div className="shell pt-10">
          <nav aria-label="Ruta de navegación" className="miga">
            <Link href="/" className="transition-colors hover:text-bone">
              Inicio
            </Link>
            <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-bone">
              Blog
            </Link>
            <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
            <span className="text-bone-2">{post.category}</span>
          </nav>
        </div>

        {/* Portada */}
        <header className="shell mx-auto mt-10 max-w-[46rem] text-center">
          <p className="overline overline-gilt">
            {post.category} · {post.readingMinutes} min de lectura
          </p>
          <h1 className="mt-5 text-h1">{post.title}</h1>
          <p className="mx-auto mt-6 max-w-[36rem] text-lead leading-[1.75] text-bone-2">
            {post.excerpt}
          </p>
          <div className="section-rule mt-8" aria-hidden="true" />
          <p className="mt-6 text-[13px] text-bone-3">
            {post.author} · {formatDate(post.date)}
          </p>
        </header>

        <div className="shell mt-12">
          <div className="relative mx-auto aspect-[16/9] max-w-[62rem] overflow-hidden bg-ink-raised">
            <ProductImage src={post.image} alt="" priority sizes="(max-width: 1024px) 100vw, 62rem" static />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>
        </div>

        {/* Cuerpo */}
        <div className="shell mx-auto mt-16 max-w-[42rem]">
          {post.sections.map((section, index) => (
            <section key={section.heading ?? index} className={index > 0 ? 'mt-12' : undefined}>
              {section.heading && <h2 className="text-h3">{section.heading}</h2>}

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className={`text-[17px] leading-[1.9] text-bone-2 ${section.heading ? 'mt-5' : 'mt-0'}`}
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="prose-list mt-6 space-y-3">
                  {section.list.map((item) => (
                    <li key={item} className="text-[17px] leading-[1.8] text-bone-2">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="mt-16 border-t border-ink-line pt-8">
            <Link
              href="/blog"
              className="link-editorial inline-flex items-center gap-2 text-[14px] text-bone-3"
            >
              <ArrowLeft className="size-3.5" />
              Volver al blog
            </Link>
          </div>
        </div>
      </article>

      {/* Fragancias del artículo */}
      {related.length > 0 && (
        <Reveal as="section" className="shell mt-[var(--spacing-section)]">
          <p className="overline">Del catálogo</p>
          <h2 className="mt-4 text-h2">Fragancias mencionadas</h2>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-4 md:gap-x-6">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} sizes="(max-width: 768px) 50vw, 25vw" />
            ))}
          </div>
        </Reveal>
      )}

      {/* Seguir leyendo */}
      {more.length > 0 && (
        <Reveal as="section" className="shell mt-[var(--spacing-section)]">
          <p className="overline">Seguir leyendo</p>
          <h2 className="mt-4 text-h2">Otras notas</h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {more.map((item) => (
              <article key={item.slug} className="group flex flex-col">
                <Link
                  href={`/blog/${item.slug}`}
                  className="relative aspect-[3/2] overflow-hidden bg-ink-raised"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <ProductImage src={item.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
                </Link>
                <p className="overline mt-5">{item.category}</p>
                <h3 className="mt-3 font-display text-h3 leading-tight">
                  <Link href={`/blog/${item.slug}`} className="transition-colors hover:text-gilt">
                    {item.title}
                  </Link>
                </h3>
                <Link href={`/blog/${item.slug}`} className="btn btn-quiet btn-sm mt-6 self-start">
                  Leer
                  <ArrowRight className="size-3.5" strokeWidth={2} />
                </Link>
              </article>
            ))}
          </div>
        </Reveal>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </>
  )
}
