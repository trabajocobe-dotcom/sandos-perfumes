'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { SearchOverlay } from '@/components/commerce/SearchOverlay'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { FAMILIES } from '@/lib/catalog'
import { cn } from '@/lib/utils'

/**
 * Sin "Ella" y "Él": eran el mismo catálogo con un filtro puesto, y el filtro
 * por género ya vive dentro de /catalogo. Repetirlo arriba hacía parecer que
 * eran secciones distintas.
 */
const NAV = [
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/muestras', label: 'Muestras' },
  { href: '/quiz', label: 'Tu firma' },
  { href: '/blog', label: 'Blog' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { itemCount, openCart } = useCart()
  const { count: savedCount } = useWishlist()

  /**
   * La portada es la única página con una foto a sangre debajo del header, así
   * que ahí arranca transparente sobre la imagen y se vuelve blanco al bajar.
   * En el resto es blanco desde el primer píxel.
   */
  const overHero = pathname === '/'
  const transparent = overHero && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    // En un recargo con scroll restaurado la posición ya no es 0: se comprueba
    // en el siguiente frame para no arrancar con el header transparente.
    const frame = requestAnimationFrame(onScroll)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
    }
  }, [mobileOpen])

  // Atajo estándar de e-commerce: "/" abre el buscador.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable
      if (e.key === '/' && !typing) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  /** Navegar desde el menú móvil lo cierra: si no, queda abierto sobre la página nueva. */
  const closeMobile = () => setMobileOpen(false)

  const iconButton = cn(
    'relative grid size-10 place-items-center rounded-pill transition-colors',
    transparent
      ? 'text-white hover:bg-white/20'
      : 'text-bone-2 hover:bg-ink-sunken hover:text-bone'
  )

  return (
    <>
      <header
        className={cn(
          'z-[70] transition-[colors,box-shadow] duration-500',
          // Sobre el hero se superpone; en el resto empuja el contenido.
          overHero ? 'sticky top-0 -mb-[5rem] lg:-mb-[6rem]' : 'sticky top-0',
          transparent ? 'bg-transparent' : 'border-b border-ink-line bg-ink/95 backdrop-blur-xl',
          // La sombra aparece recién al despegarse del tope: así se lee que la
          // barra flota por encima del contenido que pasa por debajo.
          scrolled && 'shadow-[0_10px_30px_-18px_rgb(90_62_12/0.45)]'
        )}
      >
        <div className="shell">
          {/* Logo a la izquierda, navegación en pastilla flotante a la derecha */}
          <div className="flex h-20 items-center gap-4 lg:h-24">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className={cn(iconButton, '-ml-2 lg:hidden')}
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>

            <Link
              href="/"
              className={cn(
                'mr-auto transition-opacity hover:opacity-80',
                transparent && 'text-white'
              )}
              aria-label="Sandós Perfumes, ir al inicio"
            >
              <Logo variant="horizontal" />
            </Link>

            <nav
              className={cn('nav-links hidden lg:flex', transparent && 'on-photo')}
              aria-label="Navegación principal"
            >
              {NAV.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={iconButton}
                aria-label="Buscar fragancias"
              >
                <Search className="size-[1.125rem]" strokeWidth={1.5} />
              </button>

              <Link
                href="/favoritos"
                className={cn(iconButton, 'hidden sm:grid')}
                aria-label={`Favoritos${savedCount ? `, ${savedCount} guardados` : ''}`}
              >
                <Heart className="size-[1.125rem]" strokeWidth={1.5} />
                {savedCount > 0 && <Dot>{savedCount}</Dot>}
              </Link>

              <Link
                href="/auth/login"
                className={cn(iconButton, 'hidden sm:grid')}
                aria-label="Mi cuenta"
              >
                <User className="size-[1.125rem]" strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                onClick={openCart}
                className={cn(
                  'ml-1 flex items-center gap-2.5 rounded-pill px-4 py-2.5 transition-colors',
                  itemCount > 0
                    ? 'bg-bone text-white hover:bg-gilt-deep'
                    : transparent
                      ? 'bg-white/90 text-bone backdrop-blur hover:bg-white'
                      : 'bg-ink-raised text-bone-2 shadow-[var(--shadow-warm-sm)] hover:text-bone'
                )}
                aria-label={
                  itemCount === 0
                    ? 'Carrito vacío'
                    : `Carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`
                }
              >
                <ShoppingBag className="size-[1.0625rem]" strokeWidth={1.5} />
                <span className="hidden text-[14px] sm:inline">Carrito</span>
                {itemCount > 0 && <span className="tnum text-[13px]">{itemCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[75] lg:hidden">
          <div className="animate-fade absolute inset-0 bg-ink" />
          <div className="relative flex h-full flex-col">
            <div className="shell flex h-[4.5rem] items-center justify-between">
              <span className="overline">Menú</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={cn(iconButton, '-mr-2')}
                aria-label="Cerrar menú"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            <nav className="shell flex-1 overflow-y-auto pb-12" aria-label="Navegación móvil">
              <ul className="border-t border-ink-line">
                {NAV.map((link) => (
                  <li key={link.label} className="border-b border-ink-line">
                    <Link
                      href={link.href}
                      onClick={closeMobile}
                      className="block py-5 font-display text-[1.5rem] transition-colors hover:text-gilt"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="overline mt-10">Familias olfativas</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {FAMILIES.map((family) => (
                  <Link
                    key={family.id}
                    href={`/catalogo?familia=${family.key}`}
                    onClick={closeMobile}
                    className="chip"
                  >
                    {family.name}
                  </Link>
                ))}
              </div>

              <div className="mt-10 grid gap-2">
                <Link href="/favoritos" onClick={closeMobile} className="btn btn-quiet w-full">
                  Favoritos {savedCount > 0 && `(${savedCount})`}
                </Link>
                <Link href="/auth/login" onClick={closeMobile} className="btn btn-quiet w-full">
                  Mi cuenta
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function Dot({ children }: { children: React.ReactNode }) {
  return (
    <span className="tnum absolute right-0.5 top-0.5 grid min-w-[1.05rem] place-items-center rounded-pill bg-amber px-1 text-[0.625rem] font-semibold leading-[1.05rem] text-bone">
      {children}
    </span>
  )
}
