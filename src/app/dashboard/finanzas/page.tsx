'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { products, demoOrders } from '@/lib/demo-data'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Area, AreaChart,
} from 'recharts'

const monthlyData = [
  { month: 'Ene', revenue: 180000, cost: 360000, profit: 90000, orders: 8 },
  { month: 'Feb', revenue: 220000, cost: 440000, profit: 110000, orders: 12 },
  { month: 'Mar', revenue: 195000, cost: 392000, profit: 97000, orders: 10 },
  { month: 'Abr', revenue: 310000, cost: 620000, profit: 155000, orders: 15 },
  { month: 'May', revenue: 280000, cost: 560000, profit: 140000, orders: 13 },
  { month: 'Jun', revenue: 350000, cost: 700000, profit: 175000, orders: 18 },
]


const periodTotals = {
  daily: { revenue: 28000, cost: 56000, orders: 2, expenses: 3500 },
  weekly: { revenue: 185000, cost: 370000, orders: 14, expenses: 28000 },
  monthly: { revenue: 350000, cost: 700000, orders: 18, expenses: 95000 },
}

const stockValue = products.reduce((a, b) => a + b.price * b.stock, 0)
const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0)
const totalCost = monthlyData.reduce((a, b) => a + b.cost, 0)
const totalProfit = totalRevenue - totalCost
const profitMargin = Math.round((totalProfit / totalRevenue) * 100)

export default function FinanzasPage() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const totals = periodTotals[period]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-bone">Finanzas y Contabilidad</h2>
        <p className="text-sm text-bone-2">Ingresos, egresos, márgenes y más</p>
      </div>

      <div className="flex gap-2">
        {(['daily', 'weekly', 'monthly'] as const).map((p) => (
          <Button
            key={p}
            variant={period === p ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setPeriod(p)}
          >
            {p === 'daily' ? 'Hoy' : p === 'weekly' ? 'Esta semana' : 'Este mes'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Ingresos</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{formatCurrency(totals.revenue)}</p>
          <p className="mt-1 text-xs text-bone-2">{period === 'daily' ? 'Hoy' : period === 'weekly' ? 'Esta semana' : 'Este mes'}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Costos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totals.cost)}</p>
          <p className="mt-1 text-xs text-bone-2">Costo estimado de productos</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Ganancia neta</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">
            {formatCurrency(totals.revenue - totals.cost - totals.expenses)}
          </p>
          <p className="mt-1 text-xs text-emerald-600">
            {Math.round(((totals.revenue - totals.cost - totals.expenses) / totals.revenue) * 100) || 0}% margen
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Gastos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totals.expenses)}</p>
          <p className="mt-1 text-xs text-bone-2">Operativos y administrativos</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Evolución de ingresos vs costos</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                  formatter={(value) => [formatCurrency(Number(value) || 0), '']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="cost" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Ganancia mensual</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#8B7E74' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
                  formatter={(value) => [formatCurrency(Number(value) || 0), 'Ganancia']}
                />
                <Bar dataKey="profit" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Resumen anual</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-bone-2">Ingresos totales</span>
              <span className="font-medium text-bone">{formatCurrency(totalRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bone-2">Costos totales</span>
              <span className="font-medium text-bone">{formatCurrency(totalCost)}</span>
            </div>
            <div className="border-t border-ink-line pt-2 flex justify-between text-sm font-bold">
              <span className="text-bone-2">Ganancia bruta</span>
              <span className="text-emerald-600">{formatCurrency(totalProfit)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-bone-2">Margen de ganancia</span>
              <span className="font-medium text-emerald-600">{profitMargin}%</span>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Valor del inventario</h3>
          <div className="mt-4 space-y-3">
            <p className="font-display text-2xl font-bold text-bone">{formatCurrency(stockValue)}</p>
            <p className="text-xs text-bone-2">{products.length} productos • {products.reduce((a, b) => a + b.stock, 0)} unidades</p>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-bone-2">Costo estimado del stock</span>
                <span className="font-medium text-bone">{formatCurrency(Math.round(stockValue * 0.5))}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-bone-2">Ganancia potencial</span>
                <span className="font-medium text-emerald-600">{formatCurrency(Math.round(stockValue * 0.5))}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone">Métricas rápidas</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-bone-2">Ticket promedio</span>
              <span className="font-medium text-bone">{formatCurrency(Math.round(totalRevenue / monthlyData.reduce((a, b) => a + b.orders, 0)))}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bone-2">Productos vendidos</span>
              <span className="font-medium text-bone">{demoOrders.reduce((a, o) => a + o.items.reduce((s, i) => s + i.quantity, 0), 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-bone-2">Pedidos totales</span>
              <span className="font-medium text-bone">{demoOrders.length}</span>
            </div>
            <div className="border-t border-ink-line pt-2 flex justify-between text-sm">
              <span className="text-bone-2">Relación costo/ingreso</span>
              <span className="font-medium text-bone">{Math.round((totalCost / totalRevenue) * 100)}%</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-bone">Gastos registrados (demo)</h3>
          <Badge variant="gilt">Demo</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                <th className="pb-3 pr-4">Concepto</th>
                <th className="pb-3 pr-4">Monto</th>
                <th className="pb-3 pr-4">Categoría</th>
                <th className="pb-3 pr-4">Período</th>
                <th className="pb-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {[
                { concept: 'Alquiler local', amount: 180000, category: 'Operativo', period: 'Mensual', status: 'Pagado' },
                { concept: 'Servicios (luz, agua, internet)', amount: 48000, category: 'Operativo', period: 'Mensual', status: 'Pagado' },
                { concept: 'Marketing digital', amount: 100000, category: 'Marketing', period: 'Mensual', status: 'Pagado' },
                { concept: 'Envíos y logística', amount: 34000, category: 'Logística', period: 'Semanal', status: 'Pendiente' },
                { concept: 'Seguro', amount: 14000, category: 'Administrativo', period: 'Mensual', status: 'Pagado' },
              ].map((expense, i) => (
                <tr key={i} className="border-b border-ink-line">
                  <td className="py-3 pr-4 font-medium text-bone">{expense.concept}</td>
                  <td className="py-3 pr-4 text-bone">{formatCurrency(expense.amount)}</td>
                  <td className="py-3 pr-4 text-bone-2">{expense.category}</td>
                  <td className="py-3 pr-4 text-bone-2">{expense.period}</td>
                  <td className="py-3">
                    <Badge variant={expense.status === 'Pagado' ? 'ok' : 'warn'}>
                      {expense.status}
                    </Badge>
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
