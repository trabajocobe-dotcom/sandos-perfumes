'use client'

import { useCallback, useRef, useState } from 'react'
import { PROCESO } from '@/lib/ingredientes'
import { cn } from '@/lib/utils'

/**
 * "Cómo nace un aroma": los cinco pasos reales de fabricación.
 *
 * El patrón es el de scrollytelling clásico: una columna izquierda PEGADA que
 * no se mueve y una columna derecha que scrollea. Cada paso avisa cuando entra
 * en la banda central de la pantalla y la columna pegada cambia con él.
 *
 * Se detecta con IntersectionObserver y un `rootMargin` que recorta la pantalla
 * a su franja central (-45% arriba y abajo): así el paso activo es el que está
 * de verdad a la altura de los ojos, y no el primero que asoma por abajo.
 *
 * En móvil no hay columna pegada —no hay ancho para dos columnas— y cada paso
 * se lee como una tarjeta suelta. El observer sigue corriendo porque la cifra
 * grande vive dentro de cada paso.
 */
export function ComoNaceUnAroma() {
  const [activo, setActivo] = useState(0)
  const observador = useRef<IntersectionObserver | null>(null)

  /* El observer se crea UNA vez, en el primer paso que se monta, y después
     solo se le suman nodos. Crear uno por paso multiplicaría por cinco el
     trabajo que el navegador hace en cada fotograma de scroll. */
  const observar = useCallback((nodo: HTMLDivElement | null) => {
    if (!nodo || typeof IntersectionObserver === 'undefined') return

    if (!observador.current) {
      observador.current = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (!entrada.isIntersecting) continue
            const i = Number((entrada.target as HTMLElement).dataset.paso)
            if (!Number.isNaN(i)) setActivo(i)
          }
        },
        { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
      )
    }
    observador.current.observe(nodo)
    return () => observador.current?.unobserve(nodo)
  }, [])

  const paso = PROCESO[activo]

  return (
    <section className="proceso" aria-labelledby="proceso-titulo">
      <div className="shell proceso-rejilla">
        {/* Columna pegada: el encabezado y la cifra del paso activo */}
        <div className="proceso-fijo">
          <p className="font-display text-[1.375rem] italic text-gilt">Del campo al frasco</p>
          <h2 id="proceso-titulo" className="mt-4 text-h1">
            Cómo nace <span className="accent-word">un aroma</span>
          </h2>
          <span className="section-rule mt-7" aria-hidden="true" />

          <p className="mt-7 max-w-[30rem] text-[16px] leading-[1.85] text-bone-2">
            Un perfume no se mezcla: se cultiva, se extrae, se compone y se espera. Estos son los
            cinco pasos, con los números del oficio.
          </p>

          {/* La cifra cambia con el paso. `aria-live` lo anuncia a quien no ve
              la pantalla, porque si no el cambio sería invisible para esa persona. */}
          <div className="proceso-cifra" aria-live="polite">
            <span key={paso.numero} className="proceso-cifra-valor">
              {paso.cifra}
            </span>
            <span className="proceso-cifra-pie">{paso.cifraPie}</span>
          </div>

          <ol className="proceso-marcadores" aria-hidden="true">
            {PROCESO.map((p, i) => (
              <li key={p.numero} className={cn('proceso-marca', i === activo && 'es-activo')}>
                <span className="tnum">{p.numero}</span>
                <span className="proceso-marca-linea" />
                <span>{p.titulo}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Columna que scrollea: los pasos */}
        <ol className="proceso-pasos">
          {PROCESO.map((p, i) => (
            <li key={p.numero}>
              <div
                ref={observar}
                data-paso={i}
                className={cn('proceso-paso', i === activo && 'es-activo')}
              >
                <p className="proceso-paso-numero tnum">{p.numero}</p>
                <p className="overline overline-gilt mt-5">{p.entradilla}</p>
                <h3 className="mt-3 font-display text-h3 leading-tight">{p.titulo}</h3>
                <p className="mt-4 text-[16px] leading-[1.85] text-bone-2">{p.cuerpo}</p>

                {/* En teléfono la cifra viaja con el paso, porque allí no hay
                    columna pegada donde mostrarla. */}
                <p className="proceso-cifra-movil">
                  <span className="tnum">{p.cifra}</span>
                  <span>{p.cifraPie}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
