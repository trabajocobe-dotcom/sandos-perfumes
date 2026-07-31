'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductImage } from '@/components/ui/ProductImage'
import { cn } from '@/lib/utils'

export interface Slide {
  overline: string
  title: string
  accent: string
  body: string
  image: string
  ctaLabel: string
  ctaHref: string
}

const AUTOPLAY_MS = 7000

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const go = useCallback(
    (next: number) => setIndex((next + slides.length) % slides.length),
    [slides.length]
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  // Autoplay: se detiene con hover, con foco dentro y con movimiento reducido.
  useEffect(() => {
    if (paused || slides.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setTimeout(next, AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [index, paused, next, slides.length])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      prev()
    }
  }

  const current = slides[index]

  /*
   * Hero a sangre: ocupa el ancho completo de la ventana. El contenido de
   * adentro sí se alinea al contenedor del sitio, para que el titular quede en
   * el mismo eje que el resto de las secciones.
   */
  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Fragancias destacadas"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="gold-bath relative overflow-hidden"
    >
      {/* Fotos: se tiñen de oro por composición, no por retoque */}
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== index}
          className={cn(
            'gold-bath-photo transition-opacity duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            i === index ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div
            className={cn(
              'absolute inset-0 transition-transform duration-[11000ms] ease-out motion-reduce:transform-none',
              i === index ? 'scale-105' : 'scale-100'
            )}
          >
            <ProductImage src={slide.image} alt="" priority={i === 0} sizes="100vw" static />
          </div>
        </div>
      ))}

      <div className="gold-bath-content grid min-h-[clamp(34rem,88vh,48rem)] items-end">
        {/* Texto — alineado al contenedor del sitio, no al borde de la ventana */}
        <div className="shell pb-8 pt-[8rem] lg:pb-14 lg:pt-44">
          <div className="max-w-[34rem]">
            <p
              key={`over-${index}`}
              className="animate-rise text-[13px] font-medium uppercase tracking-[0.04em] text-white/85"
            >
              {current.overline}
            </p>

            <h1
              key={`title-${index}`}
              className="animate-rise mt-4 text-hero leading-[1.05] text-white"
              style={{ animationDelay: '120ms' }}
            >
              {current.title}
              <br />
              <span className="accent-word-light">{current.accent}</span>
            </h1>

            <p
              key={`body-${index}`}
              className="animate-rise mt-6 max-w-[28rem] text-[16px] leading-[1.75] text-white/85"
              style={{ animationDelay: '220ms' }}
            >
              {current.body}
            </p>

            <div
              key={`cta-${index}`}
              className="animate-rise mt-8 flex flex-wrap items-center gap-3"
              style={{ animationDelay: '320ms' }}
            >
              <Link
                href={current.ctaHref}
                className="btn bg-white text-bone hover:bg-amber-light"
              >
                {current.ctaLabel}
                <ArrowRight className="size-4" strokeWidth={2} />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Fragancia anterior"
                  className="btn-circle size-10 bg-white/20 text-white backdrop-blur hover:bg-white hover:text-bone"
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Fragancia siguiente"
                  className="btn-circle size-10 bg-white/20 text-white backdrop-blur hover:bg-white hover:text-bone"
                >
                  <ChevronRight className="size-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*
          La posición dentro del carrusel ya no se dibuja, pero se sigue
          anunciando: quien navega con lector de pantalla necesita saber en qué
          diapositiva está, y las flechas por sí solas no lo dicen.
        */}
        <p className="sr-only" aria-live="polite">
          Diapositiva {index + 1} de {slides.length}
        </p>
      </div>
    </section>
  )
}
