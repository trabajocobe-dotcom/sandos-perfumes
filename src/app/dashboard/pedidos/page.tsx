'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { demoOrders } from '@/lib/demo-data'

const statusCounts = {
  pendiente: demoOrders.filter((o) => o.status === 'pendiente').length,
  confirmado: demoOrders.filter((o) => o.status === 'confirmado').length,
  enviado: demoOrders.filter((o) => o.status === 'enviado').length,
  entregado: demoOrders.filter((o) => o.status === 'entregado').length,
  cancelado: demoOrders.filter((o) => o.status === 'cancelado').length,
}

const statusBadge = {
  pendiente: 'warning' as const,
  confirmado: 'gold' as const,
  enviado: 'default' as const,
  entregado: 'success' as const,
  cancelado: 'danger' as const,
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-charcoal">Pedidos</h2>
        <p className="text-sm text-warm-gray">Gestión de pedidos de clientes</p>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-5">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">
              {status}
            </p>
            <p className="mt-1 font-serif text-xl font-bold text-charcoal">{count}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs font-medium text-warm-gray-light uppercase">
                <th className="p-4">Pedido</th>
                <th className="p-4">Productos</th>
                <th className="p-4">Total</th>
                <th className="p-4">Método</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {demoOrders.map((order) => (
                <tr key={order.id} className="border-b border-charcoal/5 hover:bg-ivory/50 transition-colors">
                  <td className="p-4 font-medium text-charcoal">#{order.id}</td>
                  <td className="p-4">
                    <ul className="list-inside list-disc text-warm-gray">
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.product_name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4 font-medium text-charcoal">{formatCurrency(order.total)}</td>
                  <td className="p-4 text-warm-gray">{order.payment_method}</td>
                  <td className="p-4">
                    <Badge variant={statusBadge[order.status]}>{order.status}</Badge>
                  </td>
                  <td className="p-4 text-warm-gray">
                    {new Date(order.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
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
