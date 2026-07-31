'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BarChart3, Package, ShoppingBag, TrendingUp, Users, LogOut, Shield, FileText, DollarSign, MessageCircle, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

const sidebarLinks = [
  { href: '/dashboard', label: 'Resumen', icon: BarChart3 },
  { href: '/dashboard/ventas', label: 'Ventas', icon: TrendingUp },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { href: '/dashboard/inventario', label: 'Inventario', icon: ShoppingBag },
  { href: '/dashboard/catalogo', label: 'Catálogo PDF', icon: FileText },
  { href: '/dashboard/finanzas', label: 'Finanzas', icon: DollarSign },
  { href: '/dashboard/pedidos', label: 'Pedidos', icon: Users },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageCircle },
  { href: '/dashboard/configuracion', label: 'Configuración', icon: Settings },
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

  const isLoginPage = pathname === '/dashboard/login'

  // El efecto va ANTES de cualquier return: si se devuelve temprano en la página
  // de login, React ve una cantidad distinta de hooks entre renders y rompe.
  useEffect(() => {
    if (isLoginPage) return
    if (!loading && !user) router.push('/dashboard/login')
  }, [isLoginPage, user, loading, router])

  if (isLoginPage) return <>{children}</>

  if (loading) {
    return (
      <div className="panel flex min-h-screen items-center justify-center">
        <div className="text-sm text-bone-2">Verificando sesión…</div>
      </div>
    )
  }

  if (!user) return null

  const isSuperAdmin = hasRole('super-admin')

  return (
    <div className="panel flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r border-ink-line bg-ink-raised p-6 lg:flex">
        <div>
          <Link href="/dashboard" className="font-display text-xl font-bold text-bone">
            Sandós
          </Link>
          <p className="mt-0.5 text-xs text-bone-3">Panel de administración</p>
          <div className="mt-2">
            <span className="inline-flex items-center rounded-full bg-gilt/15 px-2 py-0.5 text-[10px] font-medium text-gilt-deep uppercase">
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
                    ? 'bg-gilt text-gilt-ink'
                    : 'text-bone-2 hover:bg-ink-sunken hover:text-bone'
                }`}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
        </nav>

        <div className="space-y-2">
          <div className="border-t border-ink-line pt-4">
            <p className="text-xs text-bone-3 truncate">{user.name}</p>
            <p className="text-[10px] text-bone-3 truncate">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="quiet" size="sm">Sitio</Button>
            </Link>
            <Button variant="quiet" size="sm" onClick={logout}>
              <LogOut className="size-3" /> Salir
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-ink-line bg-ink-raised/90 backdrop-blur-sm px-4 py-3 lg:px-6 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display text-lg font-bold text-bone lg:hidden">Sandós</span>
              <h2 className="text-sm font-semibold text-bone lg:text-lg capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Resumen'}
              </h2>
            </div>
            <div className="flex items-center gap-2 lg:hidden">
              <span className="inline-flex items-center rounded-full bg-gilt/15 px-2 py-0.5 text-[10px] font-medium text-gilt-deep uppercase">
                {user.role}
              </span>
              <Button variant="quiet" size="sm" onClick={logout}>
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
                      ? 'bg-gilt text-gilt-ink'
                      : 'text-bone-2 hover:bg-ink-sunken'
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
