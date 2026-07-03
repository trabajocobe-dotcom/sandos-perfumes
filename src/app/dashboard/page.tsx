'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { demoOrders, products } from '@/lib/demo-data'
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

const COLORS = ['#C9A84C', '#1A1A1A', '#8B7E74']

const paymentData = [
  { name: 'Efectivo', value: 35 },
  { name: 'Transferencia', value: 25 },
  { name: 'Mercado Pago', value: 40 },
]

const monthlyData = [
  { month: 'Ene', revenue: 180000, orders: 8 },
  { month: 'Feb', revenue: 220000, orders: 12 },
  { month: 'Mar', revenue: 195000, orders: 10 },
  { month: 'Abr', revenue: 310000, orders: 15 },
  { month: 'May', revenue: 280000, orders: 13 },
  { month: 'Jun', revenue: 350000, orders: 18 },
]

const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0)
const totalOrders = monthlyData.reduce((a, b) => a + b.orders, 0)
const lowStock = products.filter((p) => p.stock <= 5).length

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Ingresos totales</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{formatCurrency(totalRevenue)}</p>
          <p className="mt-1 text-xs text-emerald-600">+12% vs mes anterior</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Pedidos</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{totalOrders}</p>
          <p className="mt-1 text-xs text-emerald-600">+3 esta semana</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Productos</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{products.length}</p>
          <p className="mt-1 text-xs text-warm-gray">{lowStock} con stock bajo</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Ticket promedio</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">
            {formatCurrency(Math.round(totalRevenue / totalOrders))}
          </p>
          <p className="mt-1 text-xs text-warm-gray">Por pedido</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-charcoal">Ingresos mensuales</h3>
          <div className="mt-4 h-64">
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
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-charcoal">Métodos de pago</h3>
          <div className="mt-4 flex h-64 items-center justify-center">
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
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                  formatter={(value) => [`${Number(value) || 0}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <p className="text-2xl font-bold text-charcoal">100%</p>
              <p className="text-xs text-warm-gray">Ventas</p>
            </div>
          </div>
          <div className="mt-2 flex justify-center gap-6">
            {paymentData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-warm-gray">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {d.name} {d.value}%
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-charcoal">Pedidos recientes</h3>
          <Badge variant="gold">Demo</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs font-medium text-warm-gray-light uppercase">
                <th className="pb-3 pr-4">Pedido</th>
                <th className="pb-3 pr-4">Productos</th>
                <th className="pb-3 pr-4">Total</th>
                <th className="pb-3 pr-4">Método</th>
                <th className="pb-3 pr-4">Estado</th>
                <th className="pb-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((order) => (
                <tr key={order.id} className="border-b border-charcoal/5">
                  <td className="py-3 pr-4 font-medium text-charcoal">#{order.id}</td>
                  <td className="py-3 pr-4 text-warm-gray">
                    {order.items.map((i) => i.product_name).join(', ')}
                  </td>
                  <td className="py-3 pr-4 font-medium text-charcoal">{formatCurrency(order.total)}</td>
                  <td className="py-3 pr-4 text-warm-gray">{order.payment_method}</td>
                  <td className="py-3 pr-4">
                    <Badge
                      variant={
                        order.status === 'entregado' ? 'success' : order.status === 'confirmado' ? 'gold' : 'warning'
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 text-warm-gray">
                    {new Date(order.created_at).toLocaleDateString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
