import { cn } from '@/lib/utils'

/**
 * Identidad de Sandós.
 *
 * El logo se construye con SVG en línea + texto HTML en lugar de un archivo de
 * imagen: el emblema lleva su degradado dorado propio y la palabra "SANDÓS"
 * hereda `currentColor`, así el mismo componente sirve sobre fondo claro
 * (header, cuerpo) y sobre fondo oscuro (pie de página, hero sobre foto).
 *
 * La versión en archivo (`public/brand/logo-sandos.svg`) queda para metadatos
 * y Open Graph, donde no hay DOM que herede nada.
 */

/**
 * Id del degradado dorado.
 *
 * Es fijo a propósito. Un contador incremental daría ids distintos entre el
 * render del servidor y el del cliente y rompería la hidratación, y `useId`
 * no está disponible aquí porque el logo se usa desde componentes de servidor.
 * Todas las instancias declaran el mismo degradado, así que compartir el id es
 * visualmente indistinto: `url(#…)` resuelve a la primera definición y todas
 * son idénticas.
 */
const GOLD = 'sandos-gold'

/**
 * Frasco redondo con la S caligráfica.
 *
 * La altura llega por `className` y el valor por defecto vive en el parámetro,
 * no en `cn(...)`: si se combinaran dos utilidades `h-*` ganaría la que esté
 * más abajo en la hoja de estilos, no la que se pasó, y el SVG podría colapsar.
 *
 * `shrink-0` es necesario porque dentro de un flex apretado —el header en
 * móvil— el navegador achata el SVG en vez de respetar su proporción.
 */
export function LogoMark({ className = 'h-10' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 132 178"
      className={cn('block w-auto shrink-0', className)}
      role="presentation"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={GOLD} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e0c07d" />
          <stop offset="42%" stopColor="#c9a24c" />
          <stop offset="100%" stopColor="#8f6f22" />
        </linearGradient>
      </defs>

      <g fill="none" stroke={`url(#${GOLD})`} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Cuello y tapón */}
        <path d="M57 10h18c2.2 0 4 1.8 4 4v7c0 4.5 3.5 6.5 3.5 11.5V44H49.5V32.5C49.5 27.5 53 25.5 53 21v-7c0-2.2 1.8-4 4-4z" />
        {/* Cuerpo circular */}
        <circle cx="66" cy="106" r="56" />
        {/* Voluta interior: la gota que envuelve la S */}
        <path d="M48 146c-20-14-26-42-11-61 13-16 37-17 47-4" />
        <path d="M84 66c20 14 26 42 11 61-13 16-37 17-47 4" />
      </g>

      {/* La S va en la display del sitio, con el mismo degradado */}
      <text
        x="66"
        y="134"
        textAnchor="middle"
        fill={`url(#${GOLD})`}
        fontFamily="var(--font-brand)"
        fontSize="86"
      >
        S
      </text>
    </svg>
  )
}

interface LogoProps {
  /** `horizontal` para el header · `stacked` para el pie y portadas · `mark` solo el emblema. */
  variant?: 'horizontal' | 'stacked' | 'mark'
  className?: string
}

export function Logo({ variant = 'horizontal', className }: LogoProps) {
  if (variant === 'mark') {
    return <LogoMark className={className} />
  }

  if (variant === 'stacked') {
    return (
      <span className={cn('inline-flex shrink-0 flex-col items-center', className)}>
        <LogoMark className="h-20" />
        <span className="mt-4 font-brand text-[2rem] leading-none tracking-[0.16em]">
          SANDÓS
        </span>
        <span className="mt-3 font-brand text-[13px] tracking-[0.3em] opacity-80">
          PERFUMES &amp; FRAGANCIAS
        </span>
      </span>
    )
  }

  return (
    <span className={cn('inline-flex shrink-0 items-center gap-3', className)}>
      <LogoMark className="h-11 sm:h-12" />
      <span className="flex flex-col leading-none">
        <span className="font-brand text-[1.375rem] tracking-[0.16em] sm:text-[1.5rem]">
          SANDÓS
        </span>
        {/* Sin corte: partido en dos líneas el bajada pierde el aire del logo */}
        <span className="mt-1.5 whitespace-nowrap font-brand text-[9px] tracking-[0.16em] opacity-80 sm:text-[11px] sm:tracking-[0.2em]">
          PERFUMES &amp; FRAGANCIAS
        </span>
      </span>
    </span>
  )
}

/** Rombo dorado del lockup. Se reutiliza como separador de secciones. */
export function Diamond({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 12"
      className={cn('size-2 text-gilt', className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 0l1.6 4.4L12 6l-4.4 1.6L6 12l-1.6-4.4L0 6l4.4-1.6z" />
    </svg>
  )
}
