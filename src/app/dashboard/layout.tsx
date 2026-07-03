import Link from 'next/link'
import { BarChart3, Package, ShoppingBag, TrendingUp, Users, LogOut } from 'lucide-react'

const sidebarLinks = [
  { href: '/dashboard', label: 'Resumen', icon: BarChart3 },
  { href: '/dashboard/ventas', label: 'Ventas', icon: TrendingUp },
  { href: '/dashboard/productos', label: 'Productos', icon: Package },
  { href: '/dashboard/inventario', label: 'Inventario', icon: ShoppingBag },
  { href: '/dashboard/pedidos', label: 'Pedidos', icon: Users },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-charcoal/10 bg-white p-6 lg:flex">
        <Link href="/dashboard" className="font-serif text-xl font-bold text-charcoal">
          Sandós
        </Link>
        <p className="mt-0.5 text-xs text-warm-gray-light">Panel de administración</p>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-warm-gray transition-colors hover:bg-ivory hover:text-charcoal"
            >
              <link.icon className="size-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-warm-gray-light hover:text-red-500 transition-colors"
        >
          <LogOut className="size-4" />
          Salir
        </Link>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-white/90 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">Dashboard</h2>
            <Link
              href="/"
              className="text-sm text-warm-gray hover:text-charcoal transition-colors"
            >
              Ver sitio →
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
