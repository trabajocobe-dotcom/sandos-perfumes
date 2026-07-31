'use client'

import { useEffect, useRef, useState } from 'react'
import { Logo, LogoMark } from '@/components/brand/Logo'
import { cn } from '@/lib/utils'

/**
 * Cuánto se ve el velo, en milisegundos.
 *
 * `min` evita el parpadeo: sin un piso, en una carga rápida el logo aparece y
 * desaparece en un cuadro y se lee como un defecto. `max` es el seguro: si una
 * imagen tarda o nunca llega, el velo se va igual y nadie queda encerrado.
 *
 * La primera visita de la sesión muestra el logo completo; las siguientes, solo
 * el emblema y más corto, porque la marca ya se presentó.
 */
const TIEMPOS = {
  intro: { min: 1800, max: 3000 },
  nav: { min: 500, max: 1200 },
} as const

const YA_VISTO = 'sandos_intro_visto'

/**
 * Velo de carga con la marca.
 *
 * Se renderiza también en el servidor —si esperara al montaje, el sitio asomaría
 * un instante antes de taparse y el efecto sería peor que no tenerlo— y se
 * retira solo, sin dejar nodo en el DOM.
 *
 * Cuál de los dos logos se ve lo decide un atributo `data-variante` escrito
 * sobre el nodo, no un estado de React: el servidor no puede leer
 * `sessionStorage`, así que cualquier estado inicial distinto rompería la
 * hidratación. Los dos logos van en el HTML y CSS esconde el que sobra.
 */
export function Preloader() {
  const velo = useRef<HTMLDivElement>(null)
  const [oculto, setOculto] = useState(false)
  const [retirado, setRetirado] = useState(false)

  useEffect(() => {
    const repetida = sessionStorage.getItem(YA_VISTO) === '1'
    if (repetida) velo.current?.setAttribute('data-variante', 'nav')
    else sessionStorage.setItem(YA_VISTO, '1')

    /*
     * Con movimiento reducido el logo no respira, así que el velo pasa a ser
     * una pantalla quieta: sostenerla 1,8 s sería hacer esperar sin dar nada a
     * cambio. Se usa el tiempo corto, el mismo de las navegaciones internas.
     */
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const { min, max } = TIEMPOS[repetida || quieto ? 'nav' : 'intro']
    const desde = Date.now()
    let cerrado = false
    const temporizadores: number[] = []

    const cerrar = () => {
      if (cerrado) return
      cerrado = true
      temporizadores.push(
        window.setTimeout(() => setOculto(true), Math.max(0, min - (Date.now() - desde)))
      )
    }

    if (document.readyState === 'complete') cerrar()
    else window.addEventListener('load', cerrar, { once: true })
    temporizadores.push(window.setTimeout(cerrar, max))

    return () => {
      window.removeEventListener('load', cerrar)
      temporizadores.forEach(window.clearTimeout)
    }
  }, [])

  if (retirado) return null

  return (
    <div
      ref={velo}
      aria-hidden
      data-variante="intro"
      onTransitionEnd={() => setRetirado(true)}
      className={cn(
        'velo-carga fixed inset-0 z-[300] flex items-center justify-center bg-ink',
        'transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        oculto && 'velo-oculto pointer-events-none opacity-0'
      )}
    >
      <span className="animate-breathe motion-reduce:animate-none">
        <Logo variant="stacked" className="velo-intro text-bone" />
        <LogoMark className="velo-nav h-16" />
      </span>
    </div>
  )
}
