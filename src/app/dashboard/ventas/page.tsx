'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'

const monthlyData = [
  { month: 'Ene', revenue: 180000, orders: 8, cost: 90000 },
  { month: 'Feb', revenue: 220000, orders: 12, cost: 110000 },
  { month: 'Mar', revenue: 195000, orders: 10, cost: 98000 },
  { month: 'Abr', revenue: 310000, orders: 15, cost: 155000 },
  { month: 'May', revenue: 280000, orders: 13, cost: 140000 },
  { month: 'Jun', revenue: 350000, orders: 18, cost: 175000 },
]

const paymentSplit = [
  { name: 'Efectivo', value: 35, total: 472500 },
  { name: 'Transferencia', value: 25, total: 337500 },
  { name: 'Mercado Pago', value: 40, total: 540000 },
]

const COLORS = ['#C9A84C', '#1A1A1A', '#8B7E74']

const totalRevenue = monthlyData.reduce((a: number, b) => a + b.revenue, 0)
const totalCost = monthlyData.reduce((a: number, b) => a + b.cost, 0)

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">Ventas</h2>
          <p className="text-sm text-warm-gray">Analítica de ingresos y métodos de pago</p>
        </div>
        <Badge variant="gold">Demo — datos simulados</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Ingresos brutos</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{formatCurrency(totalRevenue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Costo estimado</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{formatCurrency(totalCost)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Margen</p>
          <p className="mt-1 font-serif text-2xl font-bold text-emerald-600">
            {formatCurrency(totalRevenue - totalCost)}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {Math.round(((totalRevenue - totalCost) / totalRevenue) * 100)}% de margen
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-charcoal">Evolución mensual</h3>
          <div className="mt-4 h-72">
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
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-charcoal">Ingresos por método de pago</h3>
          <div className="mt-4 space-y-4">
            {paymentSplit.map((method, i) => (
              <div key={method.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-gray">{method.name}</span>
                  <span className="font-medium text-charcoal">{formatCurrency(method.total)}</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${method.value}%`, backgroundColor: COLORS[i] }}
                  />
                </div>
                <p className="mt-0.5 text-xs text-warm-gray-light">{method.value}% de las ventas</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
