'use client'

import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { getOrders } from '@/lib/local-orders'
import { useClientValue } from '@/hooks/useClientValue'
import type { Order } from '@/types'
import {
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'

const COLORS = ['#C9A84C', '#1A1A1A', '#8B7E74', '#059669', '#2563EB']

export default function SalesPage() {
  const [orders] = useClientValue<Order[]>(getOrders, [])

  const totalRevenue = orders.reduce((a, o) => a + o.total, 0)
  const totalCost = Math.round(totalRevenue * 0.5)
  const totalProfit = totalRevenue - totalCost
  const profitMargin = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0

  const monthlyMap: Record<string, { revenue: number; cost: number; orders: number }> = {}
  const paymentMap: Record<string, number> = {}

  orders.forEach((o) => {
    const month = new Date(o.created_at).toLocaleString('es-CO', { month: 'short', year: '2-digit' })
    if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, cost: 0, orders: 0 }
    monthlyMap[month].revenue += o.total
    monthlyMap[month].cost += Math.round(o.total * 0.5)
    monthlyMap[month].orders += 1

    const method = o.payment_method || 'otro'
    paymentMap[method] = (paymentMap[method] || 0) + o.total
  })

  const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
    month: month.charAt(0).toUpperCase() + month.slice(1),
    revenue: data.revenue,
    cost: data.cost,
    profit: data.revenue - data.cost,
    orders: data.orders,
  }))

  const paymentTotal = Object.values(paymentMap).reduce((a, b) => a + b, 0) || 1
  const paymentSplit = Object.entries(paymentMap).map(([name, total]) => ({
    name: name === 'mercadopago' ? 'Mercado Pago' : name === 'transferencia' ? 'Transferencia' : name === 'efectivo' ? 'Efectivo' : name,
    value: Math.round((total / paymentTotal) * 100),
    total,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-bone">Ventas</h2>
          <p className="text-sm text-bone-2">Analítica de ingresos y métodos de pago</p>
        </div>
        <span className="text-xs text-bone-3">{orders.length} pedidos procesados</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Ingresos brutos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Costo estimado</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totalCost)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Margen</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{formatCurrency(totalProfit)}</p>
          <p className="mt-1 text-xs text-emerald-600">{profitMargin}% de margen</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Evolución mensual</h3>
          <div className="mt-4 h-72">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                    formatter={(value) => [formatCurrency(Number(value) || 0), '']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2} dot={{ fill: '#C9A84C', r: 4 }} />
                  <Line type="monotone" dataKey="cost" stroke="#8B7E74" strokeWidth={2} strokeDasharray="4 4" dot={{ fill: '#8B7E74', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-bone-2">Sin datos de ventas</div>
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Ingresos por método de pago</h3>
          <div className="mt-4 space-y-4">
            {paymentSplit.length > 0 ? (
              paymentSplit.map((method, i) => (
                <div key={method.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-bone-2">{method.name}</span>
                    <span className="font-medium text-bone">{formatCurrency(method.total)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${method.value}%`, backgroundColor: COLORS[i % COLORS.length] }}
                    />
                  </div>
                  <p className="mt-0.5 text-xs text-bone-3">{method.value}% de las ventas</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-bone-2">Sin datos de pago</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
