'use client'

import { useCallback, useState } from 'react'
import { IngredienteArte } from '@/components/brand/IngredienteArte'
import { INGREDIENTES } from '@/lib/ingredientes'
import { cn } from '@/lib/utils'

/**
 * La pirámide olfativa, armándose de arriba abajo.
 *
 * Las tres capas aparecen EN ORDEN —salida, corazón, fondo— porque ese es el
 * orden en que las huele una persona. Que aparezcan a la vez contaría otra
 * cosa: que un perfume se percibe de golpe, que es justo lo que no pasa.
 *
 * Una advertencia que vino de la investigación del rubro: la pirámide dibujada
 * como tabla de tres columnas se rompe en teléfono. Acá cada capa es una fila
 * completa que apila sus notas, así que al angostarse se hace más alta pero
 * nunca se desarma.
 */

const CAPAS = [
  {
    nivel: 'salida' as const,
    titulo: 'Salida',
    cuando: 'Primeros 15 minutos',
    que: 'Lo que sientes al rociar. Es efímero y no define la fragancia.',
  },
  {
    nivel: 'corazon' as const,
    titulo: 'Corazón',
    cuando: 'De 2 a 4 horas',
    que: 'El carácter real del perfume. Es lo que se percibe la mayor parte del día.',
  },
  {
    nivel: 'fondo' as const,
    titulo: 'Fondo',
    cuando: 'Hasta el final',
    que: 'La estela que queda en la piel y en la ropa. Lo que la gente recuerda.',
  },
]

export function PiramideViva() {
  const [visible, setVisible] = useState(false)

  const observar = useCallback((nodo: HTMLDivElement | null) => {
    if (!nodo) return
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        setVisible(true)
        obs.disconnect()
      },
      { threshold: 0.2 }
    )
    obs.observe(nodo)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="shell pb-[var(--spacing-section)]" aria-labelledby="piramide-titulo">
      <div className="mx-auto max-w-[44rem] text-center">
        <p className="overline overline-gilt">La arquitectura de una fragancia</p>
        <h2 id="piramide-titulo" className="mt-4 text-h1">
          Un perfume no huele igual <span className="accent-word">a los cinco minutos</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[34rem] text-[16px] leading-[1.85] text-bone-2">
          Se despliega en tres capas que van apareciendo una detrás de otra. Por eso probarlo en
          el papel de la tienda no sirve de nada.
        </p>
      </div>

      <div ref={observar} className="piramide" data-armada={visible}>
        {CAPAS.map((capa, i) => {
          const notas = INGREDIENTES.filter((ing) => ing.nivel === capa.nivel)
          return (
            <div
              key={capa.nivel}
              className="piramide-capa"
              style={{ transitionDelay: visible ? `${i * 260}ms` : '0ms' }}
            >
              <div className="piramide-encabezado">
                <span className="piramide-indice tnum">{`0${i + 1}`}</span>
                <div>
                  <h3 className="font-display text-[1.375rem] leading-none">{capa.titulo}</h3>
                  <p className="mt-1.5 text-[13px] uppercase tracking-[0.04em] text-gilt">
                    {capa.cuando}
                  </p>
                </div>
              </div>

              <p className="piramide-que">{capa.que}</p>

              <ul className="piramide-notas">
                {notas.map((ing, j) => (
                  <li
                    key={ing.clave}
                    className="piramide-nota"
                    style={{
                      transitionDelay: visible ? `${i * 260 + 180 + j * 70}ms` : '0ms',
                    }}
                  >
                    <span className="piramide-nota-dibujo">
                      <IngredienteArte clave={ing.clave} />
                    </span>
                    <span>
                      <span className="block font-medium">{ing.nombre}</span>
                      <span className="block text-[13px] text-bone-3">{ing.extraccion}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}

        {/* Barra de tiempo: traduce las tres capas a una sola línea */}
        <div className={cn('piramide-tiempo', visible && 'es-visible')} aria-hidden="true">
          <span className="piramide-tiempo-tramo" data-tramo="salida" />
          <span className="piramide-tiempo-tramo" data-tramo="corazon" />
          <span className="piramide-tiempo-tramo" data-tramo="fondo" />
        </div>
      </div>
    </section>
  )
}
