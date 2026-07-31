'use client'

import { Children, cloneElement, isValidElement, useCallback, useState } from 'react'
import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

type RevealVariant = 'up' | 'fade' | 'scale' | 'blur' | 'left' | 'right' | 'card'

interface RevealProps {
  children: React.ReactNode
  className?: string
  /** Retardo en ms para escalonar elementos hermanos. */
  delay?: number
  variant?: RevealVariant
  as?: 'div' | 'section' | 'li' | 'ul' | 'ol' | 'article' | 'header'
  /**
   * Escalona a los hijos directos en vez de animar el bloque entero.
   * Cada hijo entra `stagger` ms después del anterior.
   */
  stagger?: number
}

/** Estado inicial de cada variante. El final siempre es neutro. */
const HIDDEN: Record<RevealVariant, string> = {
  up: 'translate-y-10 opacity-0',
  fade: 'opacity-0',
  scale: 'scale-[0.96] opacity-0',
  blur: 'translate-y-6 opacity-0 blur-[6px]',
  left: '-translate-x-10 opacity-0',
  right: 'translate-x-10 opacity-0',
  /* Para grillas de producto: recorrido corto y una pizca de escala. Una card
     que sube 40 px arrastra la vista; a 24 px la grilla se arma sin marear. */
  card: 'translate-y-6 scale-[0.985] opacity-0',
}

const SHOWN = 'translate-x-0 translate-y-0 scale-100 opacity-100 blur-0'

/**
 * Aparición al entrar en viewport.
 *
 * Usa IntersectionObserver (no listeners de scroll) y anima solo opacity,
 * transform y filter, así el hilo principal queda libre. El observer se conecta
 * desde un callback ref —no desde un efecto— para que el nodo esté disponible
 * en el mismo momento en que React lo monta.
 *
 * Con `stagger`, los hijos directos entran en cascada: es lo que da la sensación
 * de que la grilla "se arma" en lugar de aparecer de golpe.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  stagger,
}: RevealProps) {
  const [visible, setVisible] = useState(false)

  const attach = useCallback((node: HTMLElement | null) => {
    if (!node) return

    // Sin soporte o con movimiento reducido: se muestra de una, sin animación.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setVisible(true)
        observer.disconnect()
      },
      { threshold: 0.05, rootMargin: '0px 0px -80px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const motion =
    'transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none'

  if (stagger != null) {
    /*
     * Se CLONAN los hijos en vez de envolverlos. Un `<div>` de más rompería la
     * grilla del padre y sería inválido dentro de un `<ul>`, donde solo pueden
     * vivir elementos `<li>`.
     */
    let position = 0
    const staggered = Children.map(children, (child) => {
      if (
        !isValidElement<{ className?: string; style?: CSSProperties; 'data-reveal'?: string }>(
          child
        )
      )
        return child
      const index = position++
      return cloneElement(child, {
        'data-reveal': '',
        className: cn(child.props.className, motion, visible ? SHOWN : HIDDEN[variant]),
        style: {
          ...child.props.style,
          transitionDelay: visible ? `${delay + index * stagger}ms` : '0ms',
        },
      })
    })

    return (
      <Tag ref={attach as never} className={className} data-reveal="">
        {staggered}
      </Tag>
    )
  }

  return (
    <Tag
      ref={attach as never}
      data-reveal=""
      className={cn(motion, visible ? SHOWN : HIDDEN[variant], className)}
      style={{ transitionDelay: visible && delay ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}

/**
 * Escalona una lista de nodos ya existente sin envolverlos en un contenedor
 * extra: útil dentro de grillas, donde un `<div>` de más rompería el layout.
 */
export function RevealItem({
  children,
  index = 0,
  stagger = 90,
  variant = 'up',
  className,
}: {
  children: React.ReactNode
  index?: number
  stagger?: number
  variant?: RevealVariant
  className?: string
}) {
  return (
    <Reveal variant={variant} delay={index * stagger} className={className}>
      {children}
    </Reveal>
  )
}
