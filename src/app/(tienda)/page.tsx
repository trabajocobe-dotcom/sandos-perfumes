import Link from 'next/link'
import { ArrowRight, BadgeCheck, Droplets, RotateCcw, Truck } from 'lucide-react'
import { NewsletterForm } from '@/components/commerce/NewsletterForm'
import { CollectionRail } from '@/components/home/CollectionRail'
import { HeroSlider, type Slide } from '@/components/home/HeroSlider'
import { ProductImage } from '@/components/ui/ProductImage'
import { Reveal, RevealItem } from '@/components/ui/Reveal'
import { recentPosts } from '@/lib/blog'
import { bestSellers, featuredProducts, getProduct } from '@/lib/catalog'
import { SITE } from '@/lib/site'
import { formatCurrency, formatDate } from '@/lib/utils'

const SLIDES: Slide[] = [
  {
    overline: 'Perfumería importada · Bogotá',
    title: 'Encuentra tu',
    accent: 'firma olfativa',
    body: 'Publicamos la pirámide completa, cuánto dura y cuánto proyecta cada fragancia. Nadie debería comprar un perfume a ciegas.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1800&q=80',
    ctaLabel: 'Ver el catálogo',
    ctaHref: '/catalogo',
  },
  {
    overline: 'Set de descubrimiento',
    title: 'Prueba antes de',
    accent: 'decidir',
    body: 'Hasta cinco muestras de 2 ml en viales de vidrio. Si después compras el frasco, te descontamos lo que pagaste por la muestra.',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1800&q=80',
    ctaLabel: 'Armar mi set',
    ctaHref: '/muestras',
  },
  {
    overline: 'Un minuto, cinco preguntas',
    title: 'Dinos cómo eres y te',
    accent: 'decimos cómo oler',
    body: 'El test cruza tus respuestas con las ocho familias olfativas y devuelve tres fragancias, con el motivo de cada una.',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1800&q=80',
    ctaLabel: 'Empezar el test',
    ctaHref: '/quiz',
  },
  {
    overline: 'Garantía de autenticidad',
    title: 'Originales, de',
    accent: 'distribuidor autorizado',
    body: 'Cada frasco llega con su código de lote intacto. Si dudas de algo que te vendimos, lo retiramos y devolvemos el importe completo.',
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=1800&q=80',
    ctaLabel: 'Cómo lo verificamos',
    ctaHref: '/legal/autenticidad',
  },
]

const DETAILS = [
  {
    icon: Truck,
    title: `Envío gratis desde ${formatCurrency(SITE.commerce.freeShippingThreshold)}`,
    body: `Entrega en ${SITE.commerce.deliveryDays} a todo el país, con seguimiento.`,
  },
  {
    icon: Droplets,
    title: 'Muestras de 2 ml',
    body: 'Prueba en tu piel antes de gastar el frasco entero.',
  },
  {
    icon: BadgeCheck,
    title: '100% originales',
    body: 'De distribuidores autorizados, con código de lote intacto.',
  },
  {
    icon: RotateCcw,
    title: `Cambios por ${SITE.commerce.returnDays} días`,
    body: 'Con el frasco cerrado, sin preguntas ni cargos.',
  },
]

const STEPS = [
  {
    title: 'Pides hasta 5 muestras',
    body: 'Eliges las que te llaman la atención, o dejas que el test decida.',
  },
  {
    title: 'Las pruebas una semana',
    body: 'En tu piel, en tu clima, con tu ropa. Es la única prueba que vale.',
  },
  {
    title: 'Descontamos la muestra',
    body: 'Lo que pagaste se acredita cuando compras el frasco completo.',
  },
]

export default function HomePage() {
  const collection = [...featuredProducts(4), ...bestSellers(12)].filter(
    (product, index, all) => all.findIndex((p) => p.id === product.id) === index
  )
  const posts = recentPosts(3)
  const detailProduct = getProduct('coco-mademoiselle')

  const collage = ['bleu-de-chanel', 'good-girl', 'libre']
    .map(getProduct)
    .filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <>
      <HeroSlider slides={SLIDES} />

      {/* ── Esencia del lujo ─────────────────────────────────────────────── */}
      {/* Sin Reveal en el envoltorio: sus hijos ya entran por separado y animar
          las dos capas hacía que el bloque se moviera dos veces. */}
      <section className="shell py-[var(--spacing-section)]">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/*
            Tres fotos del MISMO tamaño y la misma proporción, en escalera.
            Antes cada una medía distinto y, al ser fotos de stock con fondos
            que no combinan, la diferencia de tamaño se leía como descuido en
            vez de como composición. Iguales y desfasadas en vertical, el ojo
            lee un ritmo deliberado.
          */}
          <Reveal variant="scale" className="mx-auto w-full max-w-[30rem]">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {collage.map((product, index) => (
                <figure
                  key={product.id}
                  className="foto-marco aspect-[3/4] overflow-hidden rounded-soft"
                  style={{ marginTop: `${index * 1.75}rem` }}
                >
                  <ProductImage src={product.image_url} alt="" sizes="(max-width: 640px) 30vw, 160px" static />
                </figure>
              ))}
            </div>
          </Reveal>

          <Reveal variant="right" delay={140}>
            <p className="font-display text-[1.375rem] italic text-gilt">Sobre nosotros</p>

            <h2 className="mt-4 text-h1">
              Esencia <span className="accent-word">del</span>
              <br />
              lujo
            </h2>

            <span className="section-rule mt-7" aria-hidden="true" />

            <p className="mt-7 max-w-[34rem] text-[16px] leading-[1.85] text-bone-2">
              Empezamos porque nos cansamos de comprar a ciegas. En la mayoría de las tiendas la
              ficha dice “fragancia fresca y elegante” y no mucho más, cuando lo que uno necesita
              saber es qué notas tiene, cuántas horas dura y si se va a notar a dos metros.
            </p>

            <p className="mt-4 max-w-[34rem] text-[16px] leading-[1.85] text-bone-2">
              Aquí cada fragancia publica su pirámide olfativa completa, la duración y la estela
              medidas, la concentración explicada y el stock real.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/catalogo" className="btn btn-primary">
                Ver el catálogo
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
              <Link href="/legal/autenticidad" className="btn btn-quiet">
                Nuestra garantía
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Nueva colección ──────────────────────────────────────────────── */}
      <Reveal as="section" className="shell pb-[var(--spacing-section)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-h1">
            Nueva <span className="accent-word">colección</span>
          </h2>
          <Link href="/catalogo" className="btn btn-quiet btn-sm">
            Ver todo
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-10">
          <CollectionRail products={collection} />
        </div>
      </Reveal>

      {/* ── Bloque editorial: las muestras ───────────────────────────────── */}
      <Reveal as="section" className="shell pb-[var(--spacing-section)]">
        <div className="gold-bath overflow-hidden rounded-brand shadow-[var(--shadow-warm)]">
          <div className="gold-bath-photo">
            <ProductImage
              src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1800&q=80"
              alt=""
              sizes="100vw"
              static
            />
          </div>

          <div className="gold-bath-content grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-14 lg:py-20">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-white/85">
                El problema del perfume online
              </p>
              <h2 className="mt-4 text-h1 text-white">
                Nadie compra
                <br />
                <span className="accent-word-light">a ciegas</span>
              </h2>
              <p className="mt-6 max-w-[30rem] text-[16px] leading-[1.8] text-white/85">
                Siete de cada diez personas abandonan la compra de una fragancia porque no saben
                cómo va a oler en su piel. Una descripción no alcanza: el mismo perfume cambia
                según la química de cada persona.
              </p>
              <Link href="/muestras" className="btn mt-9 bg-white text-bone hover:bg-amber-light">
                Armar mi set de muestras
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>
            </div>

            <Reveal as="ol" variant="right" stagger={130} className="space-y-4 self-center">
              {STEPS.map((step, index) => (
                /* Fondo OSCURO translúcido, no blanco: estas tarjetas caen en la
                   mitad luminosa del degradado, donde el blanco sobre blanco
                   translúcido no llegaba al contraste mínimo. */
                <li
                  key={step.title}
                  className="flex gap-4 rounded-soft bg-bone/60 p-5 backdrop-blur-sm"
                >
                  <span className="tnum font-display text-[1.5rem] leading-none text-amber-light">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[1.125rem] text-white">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/85">{step.body}</p>
                  </div>
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Reveal>

      {/* ── Elegancia en cada detalle ────────────────────────────────────── */}
      <Reveal as="section" className="shell pb-[var(--spacing-section)]">
        <header className="text-center">
          <p className="font-display text-[1.375rem] italic text-gilt">Por qué aquí</p>
          <h2 className="section-title mt-3">
            Elegancia <span className="accent-word">en cada</span> detalle
          </h2>
          <span className="section-rule mx-auto mt-6" aria-hidden="true" />
        </header>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          <Reveal as="ul" variant="left" stagger={140} className="space-y-8">
            {DETAILS.slice(0, 2).map((item) => (
              <li key={item.title} className="lg:text-right">
                <item.icon
                  className="size-5 text-gilt lg:ml-auto"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
                <h3 className="mt-3 font-display text-h3">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-bone-2">{item.body}</p>
              </li>
            ))}
          </Reveal>

          {/* El frasco al centro, como eje de la composición */}
          <Reveal variant="scale" className="relative mx-auto aspect-[3/4] w-[min(20rem,70vw)] overflow-hidden rounded-brand bg-ink-sunken shadow-[var(--shadow-warm)]">
            {detailProduct && (
              <ProductImage
                src={detailProduct.image_url}
                alt={`${detailProduct.house} ${detailProduct.name}`}
                sizes="320px"
                static
              />
            )}
          </Reveal>

          <Reveal as="ul" variant="right" stagger={140} className="space-y-8">
            {DETAILS.slice(2).map((item) => (
              <li key={item.title}>
                <item.icon className="size-5 text-gilt" strokeWidth={1.25} aria-hidden="true" />
                <h3 className="mt-3 font-display text-h3">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-bone-2">{item.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Reveal>

      {/* ── Del blog ─────────────────────────────────────────────────────── */}
      <section className="shell pb-[var(--spacing-section)]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-display text-[1.375rem] italic text-gilt">Notas</p>
            <h2 className="mt-3 text-h1">
              Del <span className="accent-word">blog</span>
            </h2>
          </div>
          <Link href="/blog" className="btn btn-quiet btn-sm">
            Ver todas
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.map((post, index) => (
            <RevealItem key={post.slug} index={index} variant="blur">
            <article className="group flex flex-col">
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-[4/3] overflow-hidden rounded-brand bg-ink-sunken"
                tabIndex={-1}
                aria-hidden="true"
              >
                <ProductImage src={post.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" />
              </Link>

              <p className="mt-5 text-[13px] text-bone-3">
                {post.category} · {post.readingMinutes} min de lectura
              </p>

              <h3 className="mt-2 font-display text-h3 leading-tight">
                <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-gilt">
                  {post.title}
                </Link>
              </h3>

              <p className="mt-3 flex-1 text-[15px] leading-[1.8] text-bone-2">{post.excerpt}</p>

              <p className="mt-4 text-[13px] text-bone-3">
                {post.author} · {formatDate(post.date)}
              </p>
            </article>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* ── Test olfativo ────────────────────────────────────────────────── */}
      <Reveal as="section" className="shell pb-[var(--spacing-section)]">
        <div className="surface grid items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1.2fr_1fr] lg:px-14 lg:py-16">
          <div>
            <p className="font-display text-[1.375rem] italic text-gilt">Un minuto</p>
            <h2 className="mt-3 text-h1">
              Dinos cómo eres y te decimos
              <br />
              <span className="accent-word">cómo deberías oler</span>
            </h2>
            <p className="mt-6 max-w-[34rem] text-[16px] leading-[1.8] text-bone-2">
              Cinco preguntas. El test cruza tus respuestas con las ocho familias olfativas y te
              devuelve tres fragancias del catálogo, con la explicación de por qué te tocaron.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <Link href="/quiz" className="btn btn-primary btn-lg">
              Empezar el test
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </Reveal>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <Reveal as="section" className="shell pb-[var(--spacing-section)]">
        <div className="on-dark overflow-hidden rounded-brand px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="font-display text-[1.375rem] italic text-gilt">Cartas olfativas</p>
              <h2 className="mt-3 text-h2 text-bone">
                Quedate <span className="accent-word">al día</span>
              </h2>
              <p className="mt-5 max-w-[32rem] text-[16px] leading-[1.8] text-bone-2">
                Una vez por mes: lanzamientos, notas de temporada y ofertas reales. Sin spam y con
                un clic para darte de baja.
              </p>
            </div>

            <NewsletterForm />
          </div>
        </div>
      </Reveal>
    </>
  )
}
