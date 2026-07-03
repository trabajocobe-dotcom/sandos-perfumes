'use client'

import Link from 'next/link'
import { ShoppingBag, Star, Sparkles } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Carousel } from '@/components/ui/Carousel'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { useToast } from '@/components/ui/Toast'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/hooks/useCart'
import { products } from '@/lib/demo-data'

function FeaturedSlide({ product }: { product: (typeof products)[0] }) {
  const { addItem } = useCart()
  const { toast } = useToast()
  return (
    <div className="relative flex flex-col lg:flex-row items-center min-h-[420px] bg-glass-card rounded-xl overflow-hidden">
      <div className="flex-1 p-8 lg:p-12 z-10">
        <Badge variant="gold">Destacado</Badge>
        <h3 className="mt-3 font-serif text-2xl font-bold text-cream lg:text-3xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-cream/60 line-clamp-3">
          {product.description}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-cream/40">
          <Star className="size-3.5 fill-gold text-gold" />
          <span>{product.notes?.split(',')[0] || 'Premium'}</span>
        </div>
        <div className="mt-6 flex items-center gap-4">
          <span className="font-serif text-2xl font-bold text-gradient-gold">
            {formatCurrency(product.price)}
          </span>
          <Button size="sm" onClick={() => { addItem(product); toast('Agregado al carrito') }}>
            <ShoppingBag className="size-4" /> Agregar
          </Button>
          <Link href={`/producto/${product.id}`}>
            <Button variant="outline" size="sm">Ver detalle</Button>
          </Link>
        </div>
      </div>
      <div className="w-full lg:w-1/2 aspect-square lg:aspect-auto lg:h-[420px]">
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
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal to-charcoal/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/8 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/3 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-28 pb-20">
            <div className="grid lg:grid-cols-2 items-center gap-12">
              <div className="animate-fade-in-up">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-gold/5 px-3.5 py-1 text-xs font-medium tracking-wider text-gold-light uppercase">
                  <Sparkles className="size-3" />
                  Colección 2026
                </span>
                <h1 className="mt-6 font-serif text-5xl font-bold leading-tight tracking-tight text-cream sm:text-6xl lg:text-7xl">
                  Fragancias que
                  <br />
                  <span className="text-gradient-gold">Dejan Huella</span>
                </h1>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-cream/50">
                  Descubrí nuestra exclusiva colección de perfumes importados. Calidad premium, asesoramiento personalizado y los mejores precios del mercado.
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
                <div className="mt-10 flex items-center gap-8 text-sm text-cream/40">
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-gold" />
                    <span>150+ Fragancias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-gold" />
                    <span>100% Originales</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-1.5 rounded-full bg-gold" />
                    <span>12K+ Clientes</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 via-transparent to-gold/5 blur-2xl" />
                  <img
                    src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80"
                    alt="Perfume destacado"
                    className="relative size-full object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -bottom-4 -left-4 right-4 bg-glass-card rounded-2xl p-4 backdrop-blur-xl">
                    <p className="text-xs text-cream/40">Más vendido</p>
                    <p className="font-serif text-lg font-bold text-cream">Bleu de Chanel</p>
                    <p className="text-gold-light text-sm">{formatCurrency(85000)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-charcoal to-transparent pointer-events-none" />
        </section>

        {featured.length > 0 && (
          <ScrollReveal>
            <section className="py-24">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs font-semibold tracking-widest uppercase text-gold/60">Destacados</span>
                    <h2 className="mt-2 font-serif text-4xl font-bold text-cream">Los más buscados</h2>
                    <p className="mt-2 text-cream/50">Los favoritos de la temporada</p>
                  </div>
                  <Link
                    href="/catalogo"
                    className="hidden text-sm font-medium text-gold hover:text-gold-light transition-colors sm:inline"
                  >
                    Ver todos →
                  </Link>
                </div>
                <div className="mt-12">
                  <Carousel
                    items={featured}
                    renderItem={(product) => <FeaturedSlide product={product} />}
                    autoPlayInterval={5000}
                    className="group"
                  />
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        <ScrollReveal>
          <section id="nosotros" className="py-24 border-y border-cream/5">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-gold/60">Nosotros</span>
                  <h2 className="mt-2 font-serif text-4xl font-bold text-cream">Sobre Sandós</h2>
                  <p className="mt-4 leading-relaxed text-cream/60">
                    En Sandós Perfumes seleccionamos personalmente cada fragancia para ofrecerte
                    solo lo mejor. Trabajamos con importadores directos para garantizar
                    autenticidad y precios competitivos.
                  </p>
                  <p className="mt-4 leading-relaxed text-cream/60">
                    Creemos que un perfume es más que un aroma: es una extensión de tu
                    personalidad. Por eso te acompañamos a encontrar el que realmente te define.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-6 border-t border-cream/5 pt-8">
                    {[
                      { number: '150+', label: 'Fragancias' },
                      { number: '100%', label: 'Originales' },
                      { number: '12K+', label: 'Clientes' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <p className="font-serif text-3xl font-bold text-gradient-gold">{stat.number}</p>
                        <p className="text-xs text-cream/40 mt-1">{stat.label}</p>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="contacto" className="py-24">
            <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold/60">Contacto</span>
              <h2 className="mt-2 font-serif text-4xl font-bold text-cream">¿Consultas?</h2>
              <p className="mt-2 text-cream/60">
                Escribinos por WhatsApp y te asesoramos sin compromiso.
              </p>
              <div className="mt-10 flex justify-center">
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
        </ScrollReveal>
      </main>
      <Footer />
    </>
  )
}
