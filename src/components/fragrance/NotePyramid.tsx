import Link from 'next/link'
import type { OlfactivePyramid } from '@/types'

const LAYERS = [
  {
    key: 'top' as const,
    title: 'Salida',
    timing: 'Primeros 15 minutos',
    blurb: 'Lo que se siente al rociar. Es efímero y no define la fragancia.',
  },
  {
    key: 'heart' as const,
    title: 'Corazón',
    timing: 'De 2 a 4 horas',
    blurb: 'El carácter real del perfume. Es lo que se percibe la mayor parte del día.',
  },
  {
    key: 'base' as const,
    title: 'Fondo',
    timing: 'Hasta el final',
    blurb: 'La estela que queda en la piel y en la ropa. Lo que la gente recuerda.',
  },
]

/**
 * Pirámide olfativa desplegada en capas con su tiempo y su explicación.
 *
 * Listar "Top: bergamota · Base: vetiver" es técnicamente correcto y
 * comercialmente inútil: quien compra sin oler necesita saber CUÁNDO percibe
 * cada capa y QUÉ significa. Cada nota además enlaza al catálogo filtrado.
 */
export function NotePyramid({ pyramid }: { pyramid: OlfactivePyramid }) {
  return (
    <ol className="space-y-0">
      {LAYERS.map((layer, index) => {
        const notes = pyramid[layer.key]
        if (!notes?.length) return null

        return (
          <li
            key={layer.key}
            className="grid gap-4 border-t border-ink-line py-7 sm:grid-cols-[9rem_1fr] sm:gap-8"
          >
            <div>
              <p className="flex items-baseline gap-2">
                <span className="tnum font-display text-[1.75rem] leading-none text-gilt">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-h3 leading-none">{layer.title}</span>
              </p>
              <p className="overline mt-2">{layer.timing}</p>
            </div>

            <div>
              <ul className="flex flex-wrap gap-2">
                {notes.map((note) => (
                  <li key={note}>
                    <Link
                      href={`/catalogo?nota=${encodeURIComponent(note)}`}
                      className="chip"
                      title={`Ver fragancias con ${note.toLowerCase()}`}
                    >
                      {note}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 max-w-prose text-[14px] leading-relaxed text-bone-3">
                {layer.blurb}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
