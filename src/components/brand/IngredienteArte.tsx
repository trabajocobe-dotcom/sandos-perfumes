import type { ClaveIngrediente } from '@/lib/ingredientes'
import { cn } from '@/lib/utils'

/**
 * Retratos de las materias primas, dibujados en vez de fotografiados.
 *
 * Las fotos de banco de un jazmín y de un trozo de sándalo vienen con fondos,
 * luces y encuadres que no combinan: puestas en fila se ven como ocho fotos
 * sueltas. Dibujadas con el mismo trazo y el mismo dorado se ven como una
 * colección, que es lo que son. Además pesan unos cientos de bytes cada una y
 * se mantienen nítidas a cualquier tamaño.
 */

const TRAZO = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const DIBUJOS: Record<ClaveIngrediente, React.ReactNode> = {
  /* Cítrico cortado por la mitad: gajos desde el centro */
  bergamota: (
    <g {...TRAZO}>
      <circle cx="32" cy="34" r="19" />
      <circle cx="32" cy="34" r="15.5" strokeDasharray="1 3" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 3}
            y1={34 + Math.sin(a) * 3}
            x2={32 + Math.cos(a) * 15}
            y2={34 + Math.sin(a) * 15}
          />
        )
      })}
      <path d="M32 15v-5M32 10c3-2 6-1 6-1s-1 3-4 3z" />
    </g>
  ),

  /* Flor de cinco pétalos y botón */
  jazmin: (
    <g {...TRAZO}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 5 - Math.PI / 2
        return (
          <ellipse
            key={i}
            cx={30 + Math.cos(a) * 11}
            cy={30 + Math.sin(a) * 11}
            rx="7"
            ry="4.6"
            transform={`rotate(${(a * 180) / Math.PI} ${30 + Math.cos(a) * 11} ${30 + Math.sin(a) * 11})`}
          />
        )
      })}
      <circle cx="30" cy="30" r="3.4" />
      <path d="M30 44c0 6 2 10 6 13M36 50c-4 0-7 2-8 5" />
    </g>
  ),

  /* Tronco cortado: anillos de crecimiento */
  sandalo: (
    <g {...TRAZO}>
      <ellipse cx="24" cy="24" rx="13" ry="10" />
      <path d="M11 24v14c0 5.5 5.8 10 13 10s13-4.5 13-10V24" />
      <ellipse cx="24" cy="24" rx="8.4" ry="6.2" />
      <ellipse cx="24" cy="24" rx="4" ry="2.8" />
      <path d="M41 40l12 6M41 47l12 4M44 33l9 3" />
    </g>
  ),

  /* Vainas largas, una cruzada sobre la otra */
  vainilla: (
    <g {...TRAZO}>
      <path d="M20 9c-4 9-5 24-3 34 1.6 8 4.6 12 7.6 12s4.4-5 3.6-13c-1-10-4.2-24-8.2-33z" />
      <path d="M41 13c-5 8-8 22-7.6 32 .3 8 2.6 12.6 5.6 12.4 3-.2 4.8-5.4 4.6-13.4-.3-10-1.6-23-2.6-31z" />
      <path d="M22 20c1.4 8 2.6 18 2.8 26M40 23c-1 8-1.6 18-1.4 26" strokeDasharray="1 3.5" />
    </g>
  ),

  /* Resina: gota con brillo interior */
  ambar: (
    <g {...TRAZO}>
      <path d="M32 9c7 11 14 20 14 28a14 14 0 0 1-28 0c0-8 7-17 14-28z" />
      <path d="M26 37c0-4 2.4-7.6 5.4-9.6" />
      <circle cx="37" cy="42" r="2.6" strokeDasharray="1 2.6" />
    </g>
  ),

  /* Hoja ancha con nervadura */
  pachuli: (
    <g {...TRAZO}>
      <path d="M32 10c12 6 17 16 16 26-1 9-7 15-16 17-9-2-15-8-16-17-1-10 4-20 16-26z" />
      <path d="M32 12v41" />
      <path d="M32 22l9 5M32 22l-9 5M32 32l10 5M32 32l-10 5M32 42l8 4M32 42l-8 4" />
    </g>
  ),

  /* Conífera esquemática */
  cedro: (
    <g {...TRAZO}>
      <path d="M32 7l-9 15h5l-8 13h5l-8 13h30l-8-13h5l-8-13h5z" />
      <path d="M32 48v9M27 57h10" />
    </g>
  ),

  /* Haba: forma arriñonada con surco */
  'haba-tonka': (
    <g {...TRAZO}>
      <path d="M22 14c11-4 22 3 24 14 2 12-6 23-17 24-9 .8-16-5-16-14 0-10 2-21 9-24z" />
      <path d="M20 19c-2 9-2 20 1 28" strokeDasharray="1 3" />
      <path d="M30 16c7 8 9 20 5 30" />
    </g>
  ),

  /* Cítrico pequeño y redondo */
  mandarina: (
    <g {...TRAZO}>
      <circle cx="32" cy="35" r="16" />
      <circle cx="32" cy="35" r="12.5" strokeDasharray="1 3" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 9
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 3}
            y1={35 + Math.sin(a) * 3}
            x2={32 + Math.cos(a) * 12.0}
            y2={35 + Math.sin(a) * 12.0}
          />
        )
      })}
      <path d="M32 19v-4" />
    </g>
  ),

  /* Cítrico grande, de gajos anchos */
  pomelo: (
    <g {...TRAZO}>
      <circle cx="32" cy="34" r="20" />
      <circle cx="32" cy="34" r="16.5" strokeDasharray="1 3" />
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i * 2 * Math.PI) / 7
        return (
          <line
            key={i}
            x1={32 + Math.cos(a) * 3}
            y1={34 + Math.sin(a) * 3}
            x2={32 + Math.cos(a) * 16.0}
            y2={34 + Math.sin(a) * 16.0}
          />
        )
      })}
      <path d="M32 14v-4" />
    </g>
  ),

  /* Rosa: espiral de pétalos vista desde arriba */
  rosa: (
    <g {...TRAZO}>
      <circle cx="32" cy="30" r="19" />
      <path d="M32 11c-7 4-11 11-11 19 0 6 4 11 11 11s11-5 11-11c0-8-4-15-11-19z" />
      <path d="M32 19c-4 3-6 7-6 11 0 3.4 2.6 6 6 6s6-2.6 6-6c0-4-2-8-6-11z" />
      <circle cx="32" cy="30" r="2.6" />
      <path d="M32 49v8M32 53c-5 0-8-2-9-5M32 55c5 0 8-2 9-5" />
    </g>
  ),

  /* Lavanda: tres espigas */
  lavanda: (
    <g {...TRAZO}>
      {[18, 32, 46].map((x, i) => (
        <g key={x} transform={`translate(${x} ${i === 1 ? 6 : 12})`}>
          <path d="M0 14v38" />
          {[0, 1, 2, 3, 4].map((j) => (
            <g key={j}>
              <ellipse cx="-3.4" cy={`${4 + j * 5}`} rx="2.8" ry="2" />
              <ellipse cx="3.4" cy={`${6.5 + j * 5}`} rx="2.8" ry="2" />
            </g>
          ))}
        </g>
      ))}
    </g>
  ),
}

export function IngredienteArte({
  clave,
  className,
}: {
  clave: ClaveIngrediente
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('block size-full text-gilt-soft', className)}
      aria-hidden="true"
    >
      {DIBUJOS[clave]}
    </svg>
  )
}
