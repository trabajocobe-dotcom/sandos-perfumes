'use client'

import Link from 'next/link'
import { ShoppingBag, Star } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Carousel } from '@/components/ui/Carousel'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { products } from '@/lib/demo-data'

function FeaturedSlide({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart()
  return (
    <div className="relative flex flex-col lg:flex-row items-center bg-gradient-to-br from-ivory to-cream min-h-[400px]">
      <div className="flex-1 p-8 lg:p-12">
        <Badge variant="gold">Destacado</Badge>
        <h3 className="mt-3 font-serif text-2xl font-bold text-charcoal lg:text-3xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-warm-gray line-clamp-3">
          {product.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-warm-gray">
          <Star className="size-3.5 fill-gold text-gold" />
          <span>{product.notes?.split(',')[0] || 'Premium'}</span>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <span className="font-serif text-2xl font-bold text-gold-dark">
            {formatCurrency(product.price)}
          </span>
          <Button size="sm" onClick={() => addItem(product)}>
            <ShoppingBag className="size-4" /> Agregar
          </Button>
          <Link href={`/producto/${product.id}`}>
            <Button variant="outline" size="sm">Ver detalle</Button>
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto lg:h-[400px]">
        <img
          src={product.image_url}
          alt={product.name}
          className="size-full object-cover"
        />
      </div>
    </div>
  )
}

export default function HomePage() {
  const featured = products.filter((p) => p.featured)

  return (
    <>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-charcoal to-charcoal/95">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full border border-gold/30 px-3 py-1 text-xs font-medium tracking-wider text-gold-light uppercase">
                Colección 2024
              </span>
              <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl">
                Fragancias que
                <br />
                <span className="text-gold">Dejan Huella</span>
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/60">
                Descubrí nuestra exclusiva colección de perfumes importados.
                Calidad premium, asesoramiento personalizado y los mejores precios del mercado.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/catalogo">
                  <Button variant="secondary" size="lg">
                    Explorar Catálogo
                  </Button>
                </Link>
                <Link href="#nosotros">
                  <Button variant="outline" size="lg">
                    Conocer Más
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {featured.length > 0 && (
          <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-charcoal">Destacados</h2>
                  <p className="mt-2 text-warm-gray">Los más buscados de la temporada</p>
                </div>
                <Link
                  href="/catalogo"
                  className="hidden text-sm font-medium text-gold-dark hover:text-gold sm:inline"
                >
                  Ver todos →
                </Link>
              </div>
              <div className="mt-10">
                <Carousel
                  items={featured}
                  renderItem={(product) => <FeaturedSlide product={product} />}
                  autoPlayInterval={5000}
                  className="group"
                />
              </div>
            </div>
          </section>
        )}

        <section id="nosotros" className="bg-ivory py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-3xl font-bold text-charcoal">Sobre Sandós</h2>
                <p className="mt-4 leading-relaxed text-warm-gray">
                  En Sandós Perfumes seleccionamos personalmente cada fragancia para ofrecerte
                  solo lo mejor. Trabajamos con importadores directos para garantizar
                  autenticidad y precios competitivos.
                </p>
                <p className="mt-4 leading-relaxed text-warm-gray">
                  Creemos que un perfume es más que un aroma: es una extensión de tu
                  personalidad. Por eso te acompañamos a encontrar el que realmente te define.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-6 border-t border-charcoal/10 pt-8">
                  {[
                    { number: '150+', label: 'Fragancias' },
                    { number: '100%', label: 'Originales' },
                    { number: '12K+', label: 'Clientes' },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="font-serif text-2xl font-bold text-gold-dark">{stat.number}</p>
                      <p className="text-xs text-warm-gray">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80"
                  alt="Perfumes Sandós"
                  className="size-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className="py-20">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-charcoal">¿Consultas?</h2>
            <p className="mt-2 text-warm-gray">
              Escribinos por WhatsApp y te asesoramos sin compromiso.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="https://wa.me/541123456789?text=Hola%20Sandós!%20Quiero%20consultar%20sobre..."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Escribinos a WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
