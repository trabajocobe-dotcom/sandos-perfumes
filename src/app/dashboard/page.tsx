'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { getOrders } from '@/lib/local-orders'
import { useClientValue } from '@/hooks/useClientValue'
import { products } from '@/lib/demo-data'
import type { Order } from '@/types'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const COLORS = ['#C9A84C', '#1A1A1A', '#8B7E74', '#059669', '#2563EB']

export default function DashboardPage() {
  const [orders] = useClientValue<Order[]>(getOrders, [])

  const totalRevenue = orders.reduce((a, o) => a + o.total, 0)
  const totalOrders = orders.length
  const lowStock = products.filter((p) => p.stock <= 5).length
  const avgTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0

  const monthlyMap: Record<string, { revenue: number; orders: number }> = {}
  const paymentMap: Record<string, number> = {}

  orders.forEach((o) => {
    const month = new Date(o.created_at).toLocaleString('es-CO', { month: 'short', year: '2-digit' })
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, orders: 0 }
    monthlyMap[month].revenue += o.total
    monthlyMap[month].orders += 1

    const method = o.payment_method || 'otro'
    paymentMap[method] = (paymentMap[method] || 0) + o.total
  })

  const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    revenue: data.revenue,
    orders: data.orders,
  }))

  const paymentTotal = Object.values(paymentMap).reduce((a, b) => a + b, 0) || 1
  const paymentData = Object.entries(paymentMap).map(([name, value]) => ({
    name: name === 'mercadopago' ? 'Mercado Pago' : name === 'transferencia' ? 'Transferencia' : name === 'efectivo' ? 'Efectivo' : name,
    value: Math.round((value / paymentTotal) * 100),
    total: value,
  }))

  const recentOrders = orders.slice(0, 5)

  const statusBadge: Record<string, 'warn' | 'gilt' | 'neutral' | 'ok' | 'danger'> = {
    pendiente: 'warn',
    confirmado: 'gilt',
    enviado: 'neutral',
    entregado: 'ok',
    cancelado: 'danger',
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Ingresos totales</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-xs text-emerald-600">{totalOrders} pedidos</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Pedidos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{totalOrders}</p>
          <p className="mt-1 text-xs text-bone-2">{orders.filter((o) => o.status === 'pendiente').length} pendientes</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Productos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{products.length}</p>
          <p className="mt-1 text-xs text-bone-2">{lowStock} con stock bajo</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Ticket promedio</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(avgTicket)}</p>
          <p className="mt-1 text-xs text-bone-2">Por pedido</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Ingresos mensuales</h3>
          <div className="mt-4 h-64">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                    formatter={(value) => [formatCurrency(Number(value) || 0), 'Ingresos']}
                  />
                  <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-bone-2">Cargando…</div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Métodos de pago</h3>
          <div className="mt-4 flex h-64 items-center justify-center">
            {paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {paymentData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                    formatter={(value) => [`${Number(value) || 0}%`, '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-bone-2">Cargando…</p>
            )}
          </div>
          {paymentData.length > 0 && (
            <div className="mt-2 flex justify-center gap-6">
              {paymentData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-bone-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  {d.name} {d.value}%
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-bone">Pedidos recientes</h3>
          <span className="text-xs text-bone-3">{orders.length} total</span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                <th className="pb-3 pr-4">Pedido</th>
                <th className="pb-3 pr-4">Cliente</th>
                <th className="pb-3 pr-4">Productos</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Método</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-ink-line">
                  <td className="py-3 pr-4 font-medium text-bone">
                    {order.id.length > 10 ? `#${order.id.slice(0, 10)}` : `#${order.id}`}
                  </td>
                  <td className="py-3 pr-4 text-bone-2">{order.customer_name || '—'}</td>
                  <td className="py-3 pr-4 text-bone-2">
                    {order.items.map((i) => i.product_name).join(', ')}
                  </td>
                  <td className="py-3 pr-4 font-medium text-bone">{formatCurrency(order.total)}</td>
                  <td className="py-3 pr-4 text-bone-2">{order.payment_method}</td>
                  <td className="py-3 pr-4">
                    <Badge variant={statusBadge[order.status] || 'neutral'}>{order.status}</Badge>
                  </td>
                  <td className="py-3 text-bone-2">
                    {new Date(order.created_at).toLocaleDateString('es-CO')}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-bone-2">No hay pedidos aún</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
