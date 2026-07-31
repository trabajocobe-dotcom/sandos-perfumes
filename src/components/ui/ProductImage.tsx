'use client'

import Image from 'next/image'
import { useCallback, useState } from 'react'
import { cn } from '@/lib/utils'

const FALLBACK = '/brand/bottle-placeholder.svg'

interface ProductImageProps {
  src: string
  alt: string
  className?: string
  /** Se pasa a next/image; describe el ancho renderizado por breakpoint. */
  sizes?: string
  priority?: boolean
  /** Desactiva el zoom al hacer hover (por ejemplo en el carrito). */
  static?: boolean
}

/**
 * Imagen de producto con `next/image` (AVIF/WebP, srcset y lazy automáticos)
 * y respaldo LOCAL: si la URL remota cae, no queda un hueco roto ni se dispara
 * otra petición de red.
 */
export function ProductImage({
  src,
  alt,
  className,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  priority = false,
  static: isStatic = false,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false)

  /*
   * Fundido de entrada solo para las fotos que todavía no llegaron.
   *
   * Se decide sobre el nodo real —`img.complete`— y no con un estado de React:
   * una imagen ya cacheada se pinta antes de que corra cualquier efecto y su
   * evento `load` puede no volver a dispararse. Marcar primero y esperar el
   * evento después dejaría esa foto invisible para siempre.
   */
  const fundir = useCallback((img: HTMLImageElement | null) => {
    if (!img || img.complete) return
    img.classList.add('img-fade')
    const listo = () => img.classList.add('is-loaded')
    img.addEventListener('load', listo, { once: true })
    img.addEventListener('error', listo, { once: true })
    return () => {
      img.removeEventListener('load', listo)
      img.removeEventListener('error', listo)
    }
  }, [])

  return (
    <Image
      ref={fundir}
      src={failed || !src ? FALLBACK : src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      className={cn(
        'object-cover',
        !isStatic &&
          'transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]',
        className
      )}
    />
  )
}
