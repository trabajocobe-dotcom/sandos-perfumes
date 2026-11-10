'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'

export interface Slide {
  overline: string
  title: string
  accent: string
  body: string
  image: string
  ctaLabel: string
  ctaHref: string
  /** Palabra gigante que corre por detrás de la foto. Una sola, en mayúsculas. */
  palabra: string
  /** Fichas sueltas alrededor de la foto, como en una ficha técnica. */
  etiquetas: string[]
}

const AUTOPLAY_MS = 7000

/**
 * Héroe editorial: una palabra enorme por detrás y la foto encima, tapándola.
 *
 * El recurso viene de la referencia que pasó el usuario (un sitio de skincare
 * donde el frasco se come la mitad de la palabra NOURISH). Ahí el producto va
 * recortado sobre fondo transparente; acá las fotos son rectangulares y traen
 * su propio fondo, así que quien tapa la palabra es la TARJETA de la foto. El
 * gesto es el mismo —tipografía que pasa por detrás— y es honesto con el
 * material que hay.
 *
 * La palabra se mueve un poco al scrollear, más despacio que la página: es lo
 * que la empuja hacia atrás y evita que se lea como un fondo pegado.
 */
export function HeroAroma({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const palabra = useRef<HTMLParagraphElement | null>(null)

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = window.setTimeout(next, AUTOPLAY_MS)
    return () => window.clearTimeout(t)
  }, [index, paused, next, slides.length])

  /* Paralaje de la palabra. Va por variable CSS desde un rAF para que el
     navegador lo resuelva en el compositor y no haya un render por píxel. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let vivo = true
    let objetivo = 0

    const alScrollear = () => {
      objetivo = window.scrollY
    }
    const marco = () => {
      if (!vivo) return
      palabra.current?.style.setProperty('--desvio', `${(objetivo * 0.18).toFixed(1)}px`)
      requestAnimationFrame(marco)
    }
    window.addEventListener('scroll', alScrollear, { passive: true })
    requestAnimationFrame(marco)
    return () => {
      vivo = false
      window.removeEventListener('scroll', alScrollear)
    }
  }, [])

  const alTeclear = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      prev()
    }
  }

  const actual = slides[index]

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Fragancias destacadas"
      tabIndex={-1}
      onKeyDown={alTeclear}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="hero-aroma"
    >
      {/* Luz ámbar: lo único que queda del baño de oro anterior */}
      <span className="hero-luz" aria-hidden="true" />

      {/* La palabra. Decorativa: el titular de verdad es el h1 de abajo. */}
      <p ref={palabra} key={`palabra-${index}`} className="hero-palabra" aria-hidden="true">
        {actual.palabra}
      </p>

      <div className="shell hero-rejilla">
        <div className="hero-texto">
          <p key={`over-${index}`} className="animate-rise overline overline-gilt">
            {actual.overline}
          </p>

          <h1
            key={`titulo-${index}`}
            className="animate-rise mt-5 text-hero leading-[1.05]"
            style={{ animationDelay: '120ms' }}
          >
            {actual.title}
            <br />
            <span className="accent-word">{actual.accent}</span>
          </h1>

          <p
            key={`cuerpo-${index}`}
            className="animate-rise mt-6 max-w-[30rem] text-[16px] leading-[1.85] text-bone-2"
            style={{ animationDelay: '220ms' }}
          >
            {actual.body}
          </p>

          <div
            key={`cta-${index}`}
            className="animate-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '320ms' }}
          >
            <Link href={actual.ctaHref} className="btn btn-primary">
              {actual.ctaLabel}
              <ArrowRight className="size-4" strokeWidth={2} />
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Fragancia anterior"
                className="btn-circle size-10 bg-ink-raised text-bone shadow-[var(--shadow-warm-sm)] hover:bg-bone hover:text-white"
              >
                <ChevronLeft className="size-4" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Fragancia siguiente"
                className="btn-circle btn-circle-gold size-10"
              >
                <ChevronRight className="size-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* La foto: es la que tapa la palabra */}
        <figure className="hero-foto">
          <div key={`foto-${index}`} className="hero-foto-marco foto-marco">
            <ProductImage src={actual.image} alt="" priority sizes="(max-width: 1024px) 80vw, 34vw" static />
          </div>

          <ul className="hero-etiquetas" aria-hidden="true">
            {actual.etiquetas.map((e, i) => (
              <li key={e} className="hero-etiqueta" style={{ transitionDelay: `${i * 90}ms` }}>
                {e}
              </li>
            ))}
          </ul>
        </figure>
      </div>

      <p className="sr-only" aria-live="polite">
        Diapositiva {index + 1} de {slides.length}
      </p>
    </section>
  )
}
