import type { Metadata } from 'next'
import Link from 'next/link'
import { SampleBuilder } from '@/components/commerce/SampleBuilder'
import { Reveal } from '@/components/ui/Reveal'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Set de muestras de 2 ml',
  description:
    'Arma tu set de descubrimiento con hasta 5 muestras de 2 ml. Prueba en tu piel antes de comprar el frasco: lo que pagues por la muestra se te descuenta después.',
  alternates: { canonical: '/muestras' },
  openGraph: {
    title: `Set de muestras · ${SITE.name}`,
    description: 'Hasta 5 muestras de 2 ml para probar antes de comprar el frasco.',
    url: `${SITE.url}/muestras`,
  },
}

export default function SamplesPage() {
  return (
    <section className="shell py-16 lg:py-24">
      <nav aria-label="Ruta de navegación" className="miga">
        <Link href="/" className="transition-colors hover:text-bone">
          Inicio
        </Link>
        <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
        <span className="text-bone-2">Muestras</span>
      </nav>

      <header className="mt-8 max-w-[38rem]">
        <p className="overline overline-gilt">Set de descubrimiento</p>
        <h1 className="mt-4 text-h1">
          Prueba antes de <span className="accent-word">decidir</span>
        </h1>
        <p className="mt-5 text-lead leading-[1.75] text-bone-2">
          Elige hasta 5 muestras de 2 ml. Te llegan en viales de vidrio con atomizador, alcanzan
          para unas 20 aplicaciones cada una y son suficientes para saber cómo evoluciona la
          fragancia en tu piel a lo largo del día.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-bone-3">
          Cuando compres el frasco completo de cualquiera de ellas, te acreditamos lo que pagaste
          por su muestra.
        </p>
      </header>

      <Reveal className="mt-14">
        <SampleBuilder />
      </Reveal>
    </section>
  )
}
