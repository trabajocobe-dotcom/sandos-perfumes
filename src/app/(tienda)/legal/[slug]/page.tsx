import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LEGAL_PAGES, getLegalPage } from '@/lib/legal'
import { SITE } from '@/lib/site'

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLegalPage(slug)

  if (!page) return { title: 'Página no encontrada' }

  return {
    title: page.title,
    description: page.intro,
    alternates: { canonical: `/legal/${page.slug}` },
    openGraph: {
      title: `${page.title} · ${SITE.name}`,
      description: page.intro,
      url: `${SITE.url}/legal/${page.slug}`,
    },
  }
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getLegalPage(slug)

  if (!page) notFound()

  return (
    <article className="shell py-16 lg:py-24">
      <nav aria-label="Ruta de navegación" className="miga">
        <Link href="/" className="transition-colors hover:text-bone">
          Inicio
        </Link>
        <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
        <span className="text-bone-2">{page.title}</span>
      </nav>

      <div className="mt-10 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-16">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <p className="overline">{page.overline}</p>
          <ul className="mt-5 space-y-2.5">
            {LEGAL_PAGES.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/legal/${item.slug}`}
                  aria-current={item.slug === page.slug ? 'page' : undefined}
                  className={
                    item.slug === page.slug
                      ? 'text-[14px] text-gilt'
                      : 'text-[14px] text-bone-3 transition-colors hover:text-bone'
                  }
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="max-w-[44rem]">
          <h1 className="text-h1">{page.title}</h1>
          <p className="mt-5 text-lead leading-[1.75] text-bone-2">{page.intro}</p>
          <p className="overline mt-4">Última actualización: {page.updated}</p>

          <div className="mt-12 space-y-12">
            {page.blocks.map((block) => (
              <section key={block.heading}>
                <h2 className="text-h3">{block.heading}</h2>

                {block.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-[16px] leading-[1.85] text-bone-2"
                  >
                    {paragraph}
                  </p>
                ))}

                {block.list && (
                  <ul className="prose-list mt-5 space-y-2.5">
                    {block.list.map((item) => (
                      <li key={item} className="text-[1rem] leading-[1.75] text-bone-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-ink-line pt-8">
            <p className="text-[15px] text-bone-3">
              ¿Te quedó alguna duda? Escríbenos a{' '}
              <a
                href={`mailto:${SITE.contact.email}`}
                className="text-bone-2 underline underline-offset-2 transition-colors hover:text-gilt"
              >
                {SITE.contact.email}
              </a>{' '}
              o por WhatsApp al {SITE.contact.whatsappDisplay}.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
