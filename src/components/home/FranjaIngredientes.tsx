'use client'

import { useCallback, useEffect, useRef } from 'react'
import { IngredienteArte } from '@/components/brand/IngredienteArte'
import { INGREDIENTES } from '@/lib/ingredientes'

/**
 * Franja de materias primas que cruza la página.
 *
 * Dos movimientos superpuestos: una deriva constante, que existe aunque nadie
 * toque nada, y un empujón proporcional a lo que la persona scrollea. El
 * segundo es el que convierte la franja en algo que RESPONDE: al bajar, los
 * ingredientes pasan más rápido; al parar, vuelven a su deriva.
 *
 * El desplazamiento se escribe en una variable CSS desde un `requestAnimationFrame`
 * en vez de en el `style` de React: así el navegador lo resuelve en el
 * compositor y no se dispara un render de React por cada píxel de scroll.
 */
export function FranjaIngredientes() {
  const pista = useRef<HTMLUListElement | null>(null)
  const empuje = useRef(0)
  const ultimoScroll = useRef(0)

  const medir = useCallback(() => {
    const y = window.scrollY
    // Lo que se movió desde el último fotograma, amortiguado
    empuje.current += (y - ultimoScroll.current) * 0.35
    ultimoScroll.current = y
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    ultimoScroll.current = window.scrollY
    let vivo = true

    const marco = () => {
      if (!vivo) return
      // El empuje se va apagando solo, así la franja regresa a su deriva
      empuje.current *= 0.92
      if (Math.abs(empuje.current) < 0.01) empuje.current = 0
      pista.current?.style.setProperty('--empuje', `${empuje.current.toFixed(2)}px`)
      requestAnimationFrame(marco)
    }

    window.addEventListener('scroll', medir, { passive: true })
    requestAnimationFrame(marco)
    return () => {
      vivo = false
      window.removeEventListener('scroll', medir)
    }
  }, [medir])

  /* La lista va DOS veces: la copia es lo que permite que el bucle no tenga
     costura. La segunda queda fuera del árbol de accesibilidad. */
  const vuelta = (oculta: boolean) =>
    INGREDIENTES.map((ing) => (
      <li
        key={`${ing.clave}-${oculta}`}
        className="franja-pieza"
        aria-hidden={oculta || undefined}
      >
        <span className="franja-dibujo">
          <IngredienteArte clave={ing.clave} />
        </span>
        <span className="franja-texto">
          <span className="franja-nombre">{ing.nombre}</span>
          <span className="franja-familia">{ing.familia}</span>
        </span>
      </li>
    ))

  return (
    <section className="franja" aria-labelledby="franja-titulo">
      <h2 id="franja-titulo" className="sr-only">
        Materias primas con las que trabajamos
      </h2>
      <div className="franja-ventana">
        <ul ref={pista} className="franja-pista">
          {vuelta(false)}
          {vuelta(true)}
        </ul>
      </div>
    </section>
  )
}
