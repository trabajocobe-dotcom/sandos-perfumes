'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BarChart3, Package, ShoppingBag, TrendingUp, Users, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

const sidebarLinks = [
  { href: '/dashboard', label: 'Resumen', icon: BarChart3 },
  { href: '/dashboard/ventas', label: 'Ventas', icon: TrendingUp },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { href: '/dashboard/inventario', label: 'Inventario', icon: ShoppingBag },
  { href: '/dashboard/pedidos', label: 'Pedidos', icon: Users },
  { href: '/dashboard/usuarios', label: 'Usuarios', icon: Shield, adminOnly: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, logout, hasRole } = useAuth()

  // Si está en la página de login, no aplicar el layout
  if (pathname === '/dashboard/login') return <>{children}</>

  useEffect(() => {
    if (!loading && !user) {
      router.push('/dashboard/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-sm text-warm-gray">Verificando sesión…</div>
      </div>
    )
  }

  if (!user) return null

  const isSuperAdmin = hasRole('super-admin')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-charcoal/10 bg-white p-6 lg:flex">
        <div>
          <Link href="/dashboard" className="font-serif text-xl font-bold text-charcoal">
            Sandós
          </Link>
          <p className="mt-0.5 text-xs text-warm-gray-light">Panel de administración</p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-dark uppercase">
              {user.role === 'super-admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Visor'}
            </span>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {sidebarLinks
            .filter((link) => !link.adminOnly || isSuperAdmin)
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-charcoal text-cream'
                    : 'text-warm-gray hover:bg-ivory hover:text-charcoal'
                }`}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="space-y-2">
          <div className="border-t border-charcoal/10 pt-4">
            <p className="text-xs text-warm-gray-light truncate">{user.name}</p>
            <p className="text-[10px] text-warm-gray-light truncate">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm">Sitio</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="size-3" /> Salir
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-white/90 backdrop-blur-sm px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-serif text-lg font-bold text-charcoal lg:hidden">Sandós</span>
              <h2 className="text-sm font-semibold text-charcoal lg:text-lg capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Resumen'}
              </h2>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <span className="inline-flex items-center rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-dark uppercase">
                {user.role}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="size-3" />
              </Button>
            </div>
          </div>
          {/* Mobile nav */}
          <nav className="mt-2 flex gap-1 overflow-x-auto lg:hidden">
            {sidebarLinks
              .filter((link) => !link.adminOnly || isSuperAdmin)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    pathname === link.href
                      ? 'bg-charcoal text-cream'
                      : 'text-warm-gray hover:bg-ivory'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
