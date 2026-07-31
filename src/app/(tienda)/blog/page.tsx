import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { Reveal } from '@/components/ui/Reveal'
import { POSTS } from '@/lib/blog'
import { SITE } from '@/lib/site'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Guías de perfumería: cómo hacer que un perfume dure más, cómo reconocer un original, qué significa cada familia olfativa y cómo elegir un regalo sin fallar.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `Blog · ${SITE.name}`,
    description: 'Guías de perfumería escritas para resolver dudas antes de comprar.',
    url: `${SITE.url}/blog`,
  },
}

export default function BlogIndexPage() {
  const [featured, ...rest] = POSTS

  return (
    <div className="shell py-16 lg:py-24">
      <nav aria-label="Ruta de navegación" className="miga">
        <Link href="/" className="transition-colors hover:text-bone">
          Inicio
        </Link>
        <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
        <span className="text-bone-2">Blog</span>
      </nav>

      <header className="mt-8 max-w-[38rem]">
        <p className="overline overline-gilt">Notas</p>
        <h1 className="mt-4 text-h1">
          El <span className="accent-word">blog</span>
        </h1>
        <p className="mt-5 text-lead leading-[1.75] text-bone-2">
          Guías escritas para resolver las dudas que aparecen justo antes de comprar: duración,
          autenticidad, familias olfativas y regalos.
        </p>
      </header>

      {/* Destacado a ancho completo */}
      <Reveal className="mt-16">
        <article className="group grid items-center gap-10 border-y border-ink-line py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <Link
            href={`/blog/${featured.slug}`}
            className="relative aspect-[16/10] overflow-hidden bg-ink-raised"
            tabIndex={-1}
            aria-hidden="true"
          >
            <ProductImage
              src={featured.image}
              alt=""
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </Link>

          <div>
            <p className="overline overline-gilt">
              Lo último · {featured.category} · {featured.readingMinutes} min
            </p>
            <h2 className="mt-4 text-h2">
              <Link href={`/blog/${featured.slug}`} className="transition-colors hover:text-gilt">
                {featured.title}
              </Link>
            </h2>
            <p className="mt-5 max-w-[34rem] text-[16px] leading-[1.85] text-bone-2">
              {featured.excerpt}
            </p>
            <p className="mt-5 text-[13px] text-bone-3">
              {featured.author} · {formatDate(featured.date)}
            </p>
            <Link href={`/blog/${featured.slug}`} className="btn btn-primary mt-8">
              Leer el artículo
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </article>
      </Reveal>

      {/* La grilla escalona a sus hijos, así que el envoltorio ya no anima:
          las dos capas juntas movían el bloque dos veces. */}
      <Reveal as="div" stagger={90} className="mt-16 grid gap-12 md:grid-cols-3">
        {rest.map((post) => (
          <article key={post.slug} className="group flex flex-col">
            <Link
              href={`/blog/${post.slug}`}
              className="relative aspect-[3/2] overflow-hidden bg-ink-raised"
              tabIndex={-1}
              aria-hidden="true"
            >
              <ProductImage src={post.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
            </Link>

            <p className="overline mt-6">
              {post.category} · {post.readingMinutes} min
            </p>

            <h2 className="mt-3 font-display text-h3 leading-tight">
              <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gilt">
                {post.title}
              </Link>
            </h2>

            <p className="mt-3 flex-1 text-[15px] leading-[1.8] text-bone-3">
              {post.excerpt}
            </p>

            <p className="mt-5 text-[13px] text-bone-3">
              {post.author} · {formatDate(post.date)}
            </p>

            <Link href={`/blog/${post.slug}`} className="btn btn-quiet btn-sm mt-6 self-start">
              Leer el artículo
              <ArrowRight className="size-3.5" strokeWidth={2} />
            </Link>
          </article>
        ))}
      </Reveal>
    </div>
  )
}
