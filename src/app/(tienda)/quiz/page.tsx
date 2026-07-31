import type { Metadata } from 'next'
import Link from 'next/link'
import { QuizFlow } from '@/components/quiz/QuizFlow'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Test de firma olfativa',
  description:
    'Cinco preguntas y te recomendamos tres fragancias del catálogo, con la explicación de por qué encajan con ti. Gratis y sin registro.',
  alternates: { canonical: '/quiz' },
  openGraph: {
    title: `Test de firma olfativa · ${SITE.name}`,
    description: 'Cinco preguntas, tres fragancias recomendadas y el motivo de cada una.',
    url: `${SITE.url}/quiz`,
  },
}

export default function QuizPage() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div
        className="haze left-1/2 top-0 h-[30rem] w-[42rem] -translate-x-1/2 opacity-70"
        aria-hidden="true"
      />
      <div className="shell relative">
        {/*
          La página no tenía `h1`: las preguntas son `h2` porque cambian a cada
          paso, y arriba no quedaba nadie. Sin un `h1` el buscador no sabe de
          qué trata la página y quien navega por encabezados entra sin saber
          dónde está. Va discreto para no robarle peso a la pregunta.
        */}
        <nav aria-label="Ruta de navegación" className="miga">
          <Link href="/" className="transition-colors hover:text-bone">
            Inicio
          </Link>
          <span className="mx-2 text-bone-3" aria-hidden="true">/</span>
          <span className="text-bone-2">Test de firma olfativa</span>
        </nav>

        <h1 className="mt-6 font-display text-[1.5rem] leading-tight">
          Test de <span className="accent-word">firma olfativa</span>
        </h1>

        <QuizFlow />
      </div>
    </section>
  )
}
