'use client'

import Link from 'next/link'
import { ArcoDeFrascos } from '@/components/home/ArcoDeFrascos'
import type { Product } from '@/types'

/**
 * Héroe con la composición de la referencia: todo centrado en una columna
 * —insignia, titular, bajada, botón— y debajo la fila curva de frascos.
 *
 * La referencia es un marketplace de video con paleta menta y verde bosque.
 * Acá la ESTRUCTURA es la misma y lo que cambia son los colores, porque la
 * marca ya está decidida y publicada. Si el verde era parte de lo que te
 * gustaba, es cambiar tokens, no rehacer esto.
 *
 * Las notas a mano son el gesto que más define la referencia: una frase
 * torcida con una flecha que apunta a lo que importa. Van en Caveat, la única
 * tercera familia del sitio, y solo aparecen acá.
 */
export function HeroArco({ productos }: { productos: Product[] }) {
  return (
    <section className="heroarco" aria-labelledby="heroarco-titulo">
      <div className="heroarco-centro">
        <p className="heroarco-insignia">18 fragancias con su pirámide completa</p>

        <h1 id="heroarco-titulo" className="heroarco-titular">
          Nadie debería comprar{' '}
          <br />
          un perfume a ciegas
        </h1>

        <p className="heroarco-bajada">
          Publicamos qué notas tiene, cuántas horas dura y cuánto proyecta cada{' '}
          <br />
          fragancia. Y te mandamos la muestra de 2 ml antes del frasco, para que{' '}
          <br />
          decidas oliéndola en tu piel y no leyendo una ficha.
        </p>

        {/* Nota a mano, arriba a la derecha, con su flecha hacia el arco */}
        <span className="heroarco-nota heroarco-nota-arriba" aria-hidden="true">
          Probá antes
          <br />
          de pagar
          <svg className="heroarco-flecha" viewBox="0 0 120 150" fill="none">
            <path
              d="M18 8c22 16 34 38 30 62-4 23-22 42-36 56"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M4 118l8 12 16-4"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <div className="heroarco-anillo">
          <Link href="/muestras" className="heroarco-boton">
            Armar mi set de muestras
          </Link>

          {/* Dentro del anillo para que la nota siga al botón esté donde esté */}
          <span className="heroarco-nota heroarco-nota-abajo" aria-hidden="true">
            Se te descuenta
            <svg className="heroarco-flecha-corta" viewBox="0 0 90 60" fill="none">
            <path
              d="M6 50c16-18 38-30 72-34"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M62 4l16 8-6 15"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            </svg>
          </span>
        </div>
      </div>

      <ArcoDeFrascos productos={productos} />
    </section>
  )
}
