'use client'

import { useCallback, useEffect, useRef } from 'react'
import { ProductImage } from '@/components/ui/ProductImage'
import type { Product } from '@/types'

/**
 * Carrusel curvo: la fila de tarjetas que se comba como el interior de un
 * cilindro, de la referencia que pasó el usuario.
 *
 * La geometría de cada tarjeta sale de SU POSICIÓN, no de una clase: cuanto
 * más lejos del centro, más ancha, más alta, y con el canto de afuera más alto
 * que el de adentro. Por eso las del medio se ven rectas y las de los bordes
 * se inclinan.
 *
 * Las constantes vienen de la referencia (ancho 170 + 48·d², paso 196, alto de
 * cada canto 280 + 92·q^2.6, centro vertical 687 − 12·d²) y se escalan con una
 * unidad `u` para que la curva sea la misma en cualquier pantalla.
 *
 * Todo se escribe directamente en el estilo de los nodos desde un rAF. En
 * React sería un render por fotograma y a 60 fps con diez tarjetas eso es
 * inviable.
 */

/* Medidas de la referencia, en unidades de marco */
const PASO = 196
const ANCHO_BASE = 170
const ANCHO_CURVA = 48
const ALTO_BASE = 280
const ALTO_CURVA = 92
const CENTRO_Y = 687
const CENTRO_CURVA = 12
const RADIO = 15
const MEDIO = 706
const EMPUJE = 0.083
/** Unidades de marco por segundo que se desplaza sola la fila. */
const DERIVA = 50

/** Camino de un cuadrilátero con las esquinas redondeadas. */
function caminoRedondeado(puntos: [number, number][], r: number) {
  const n = puntos.length
  let d = ''
  for (let i = 0; i < n; i++) {
    const anterior = puntos[(i - 1 + n) % n]
    const actual = puntos[i]
    const siguiente = puntos[(i + 1) % n]

    const haciaAnterior = normalizar(anterior, actual)
    const haciaSiguiente = normalizar(siguiente, actual)

    // El radio no puede comerse más de la mitad de ninguno de los dos lados
    const tope = Math.min(
      r,
      distancia(anterior, actual) / 2,
      distancia(actual, siguiente) / 2
    )

    const entra: [number, number] = [
      actual[0] + haciaAnterior[0] * tope,
      actual[1] + haciaAnterior[1] * tope,
    ]
    const sale: [number, number] = [
      actual[0] + haciaSiguiente[0] * tope,
      actual[1] + haciaSiguiente[1] * tope,
    ]

    d += i === 0 ? `M${entra[0]} ${entra[1]}` : `L${entra[0]} ${entra[1]}`
    d += `Q${actual[0]} ${actual[1]} ${sale[0]} ${sale[1]}`
  }
  return `${d}Z`
}

function normalizar(desde: [number, number], hasta: [number, number]): [number, number] {
  const dx = desde[0] - hasta[0]
  const dy = desde[1] - hasta[1]
  const l = Math.hypot(dx, dy) || 1
  return [dx / l, dy / l]
}

function distancia(a: [number, number], b: [number, number]) {
  return Math.hypot(a[0] - b[0], a[1] - b[1])
}

export function ArcoDeFrascos({ productos }: { productos: Product[] }) {
  const fila = useRef<HTMLDivElement | null>(null)
  const tarjetas = useRef<(HTMLElement | null)[]>([])

  /* Todo el estado del movimiento vive en refs: si viviera en useState,
     cada fotograma dispararía un render. */
  const desvio = useRef(0)
  const velocidad = useRef(0)
  const arrastrando = useRef(false)
  const ultimoX = useRef(0)
  const ultimoT = useRef(0)

  const registrar = useCallback(
    (i: number) => (nodo: HTMLElement | null) => {
      tarjetas.current[i] = nodo
    },
    []
  )

  useEffect(() => {
    const contenedor = fila.current
    if (!contenedor) return

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const total = productos.length * PASO
    let vivo = true
    let anterior = performance.now()

    const dibujar = (ahora: number) => {
      if (!vivo) return
      const dt = Math.min((ahora - anterior) / 1000, 0.05)
      anterior = ahora

      const ancho = contenedor.clientWidth
      const alto = contenedor.clientHeight
      /* La unidad de marco la fija el CSS (--u). Leerla de ahí es lo que
         mantiene a JS y a CSS midiendo con la MISMA regla: cuando cada uno
         calculaba la suya, la fila quedaba más baja que las tarjetas y el
         recorte se cortaba. */
      const u = parseFloat(getComputedStyle(contenedor).getPropertyValue('--u')) || ancho / 1440
      const cx = ancho / 2
      const medio = MEDIO * u

      if (!arrastrando.current) {
        if (!quieto) desvio.current += DERIVA * u * dt
        // La inercia se apaga al 95 % por segundo
        desvio.current -= velocidad.current * dt
        velocidad.current *= Math.pow(0.05, dt)
        if (Math.abs(velocidad.current) < 0.5) velocidad.current = 0
      }

      const vuelta = total * u
      for (let i = 0; i < productos.length; i++) {
        const nodo = tarjetas.current[i]
        if (!nodo) continue

        // Posición sin curvar, replegada al intervalo centrado
        const crudo = i * PASO * u - desvio.current
        const t = ((((crudo + vuelta / 2) % vuelta) + vuelta) % vuelta) - vuelta / 2

        // Las de los bordes se separan un poco más: así el hueco no se cierra
        const x = cx + t * (1 + EMPUJE * Math.pow(t / medio, 2))
        const d = Math.abs(x - cx) / medio

        const w = (ANCHO_BASE + ANCHO_CURVA * d * d) * u
        const cy = (CENTRO_Y - CENTRO_CURVA * d * d) * u * (alto / (1080 * u))

        // Cada canto vertical mide según SU propia distancia al centro
        const qIzq = Math.abs(x - w / 2 - cx) / medio
        const qDer = Math.abs(x + w / 2 - cx) / medio
        const hIzq = (ALTO_BASE + ALTO_CURVA * Math.pow(qIzq, 2.6)) * u
        const hDer = (ALTO_BASE + ALTO_CURVA * Math.pow(qDer, 2.6)) * u

        const yc = alto / 2
        const esquinas: [number, number][] = [
          [0, yc - hIzq / 2],
          [w, yc - hDer / 2],
          [w, yc + hDer / 2],
          [0, yc + hIzq / 2],
        ]

        // El pie de la forma visible, para que la etiqueta no se salga del recorte
        nodo.style.setProperty('--pie', `${alto - (yc + Math.min(hIzq, hDer) / 2) + 12 * u}px`)
        nodo.style.width = `${w}px`
        nodo.style.transform = `translate3d(${x - w / 2}px, 0, 0)`
        nodo.style.clipPath = `path('${caminoRedondeado(esquinas, RADIO * u)}')`
        // Fuera de cuadro no hace falta ni pintarla
        nodo.style.visibility = x + w < -40 || x - w > ancho + 40 ? 'hidden' : 'visible'
        void cy
      }

      requestAnimationFrame(dibujar)
    }

    const id = requestAnimationFrame(dibujar)

    /* ---- Arrastre ---- */
    const alBajar = (e: PointerEvent) => {
      arrastrando.current = true
      velocidad.current = 0
      ultimoX.current = e.clientX
      ultimoT.current = performance.now()
      contenedor.setPointerCapture(e.pointerId)
    }
    const alMover = (e: PointerEvent) => {
      if (!arrastrando.current) return
      const ahora = performance.now()
      const dx = e.clientX - ultimoX.current
      const dt = Math.max((ahora - ultimoT.current) / 1000, 0.001)
      desvio.current -= dx
      velocidad.current = dx / dt
      ultimoX.current = e.clientX
      ultimoT.current = ahora
    }
    const alSoltar = (e: PointerEvent) => {
      if (!arrastrando.current) return
      arrastrando.current = false
      if (contenedor.hasPointerCapture(e.pointerId)) contenedor.releasePointerCapture(e.pointerId)
    }

    contenedor.addEventListener('pointerdown', alBajar)
    contenedor.addEventListener('pointermove', alMover)
    contenedor.addEventListener('pointerup', alSoltar)
    contenedor.addEventListener('pointercancel', alSoltar)

    return () => {
      vivo = false
      cancelAnimationFrame(id)
      contenedor.removeEventListener('pointerdown', alBajar)
      contenedor.removeEventListener('pointermove', alMover)
      contenedor.removeEventListener('pointerup', alSoltar)
      contenedor.removeEventListener('pointercancel', alSoltar)
    }
  }, [productos.length])

  return (
    <div ref={fila} className="arco" aria-label="Fragancias destacadas" role="group">
      {productos.map((p, i) => (
        <article key={p.id} ref={registrar(i)} className="arco-tarjeta">
          <ProductImage
            src={p.image_url}
            alt={`${p.house} ${p.name}`}
            sizes="240px"
            priority={i < 4}
            static
          />
          <span className="arco-marca" aria-hidden="true">
            {p.name}
          </span>
        </article>
      ))}
    </div>
  )
}
