'use client'

import { useState, useMemo } from 'react'
import { Search, Eye, ChevronDown, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { formatCurrency } from '@/lib/utils'
import { getOrders, updateOrderStatus } from '@/lib/local-orders'
import { useClientValue } from '@/hooks/useClientValue'
import type { Order, OrderStatus } from '@/types'

const statusConfig: Record<OrderStatus, { label: string; color: 'warn' | 'gilt' | 'neutral' | 'ok' | 'danger'; icon: React.ReactNode }> = {
  pendiente: { label: 'Pendiente', color: 'warn', icon: <Clock className="size-3.5" /> },
  confirmado: { label: 'Confirmado', color: 'gilt', icon: <Package className="size-3.5" /> },
  enviado: { label: 'Enviado', color: 'neutral', icon: <Truck className="size-3.5" /> },
  entregado: { label: 'Entregado', color: 'ok', icon: <CheckCircle className="size-3.5" /> },
  cancelado: { label: 'Cancelado', color: 'danger', icon: <XCircle className="size-3.5" /> },
}

const statusFlow: OrderStatus[] = ['pendiente', 'confirmado', 'enviado', 'entregado']

const paymentLabels: Record<string, string> = {
  mercadopago: 'Mercado Pago',
  transferencia: 'Transferencia',
  efectivo: 'Efectivo',
}

export default function OrdersPage() {
  const [orders, refreshOrders] = useClientValue<Order[]>(getOrders, [])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'todas'>('todas')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showDetail, setShowDetail] = useState(false)

  const filtered = useMemo(() => {
    let result = orders
    if (filterStatus !== 'todas') {
      result = result.filter((o) => o.status === filterStatus)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          (o.customer_name && o.customer_name.toLowerCase().includes(q)) ||
          (o.customer_email && o.customer_email.toLowerCase().includes(q)) ||
          o.items.some((i) => i.product_name.toLowerCase().includes(q))
      )
    }
    return result
  }, [orders, search, filterStatus])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { todas: orders.length }
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    return counts
  }, [orders])

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = updateOrderStatus(orderId, newStatus)
    if (updated) {
      // Se relee desde el almacenamiento en vez de parchear el estado local:
      // así la lista no puede divergir de lo que quedó realmente guardado.
      refreshOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated)
      }
    }
  }

  const handleNextStatus = (order: Order) => {
    const currentIdx = statusFlow.indexOf(order.status)
    if (currentIdx < statusFlow.length - 1) {
      handleStatusChange(order.id, statusFlow[currentIdx + 1])
    }
  }

  const handleCancel = (orderId: string) => {
    if (confirm('¿Cancelar este pedido? No se puede deshacer.')) {
      handleStatusChange(orderId, 'cancelado')
    }
  }

  const openDetail = (order: Order) => {
    setSelectedOrder(order)
    setShowDetail(true)
  }

  const totalRevenue = orders.reduce((a, o) => a + o.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-bone">Pedidos</h2>
          <p className="text-sm text-bone-2">Gestión de pedidos de clientes</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-bone-3">
          <span>{orders.length} pedidos</span>
          <span className="text-bone font-medium">{formatCurrency(totalRevenue)}</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['todas', 'pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              filterStatus === status
                ? 'bg-gilt text-gilt-ink'
                : 'text-bone-2 hover:bg-ink-sunken'
            }`}
          >
            {status === 'todas' ? 'Todas' : statusConfig[status as OrderStatus]?.label || status}
            <span className="ml-1.5 opacity-60">({statusCounts[status] || 0})</span>
          </button>
        ))}
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bone-3" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar pedido, cliente o producto…"
          className="pl-10"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                <th className="p-4">Pedido</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Productos</th>
                <th className="p-4">Total</th>
                <th className="p-4">Método</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Fecha</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const cfg = statusConfig[order.status]
                return (
                  <tr key={order.id} className="border-b border-ink-line hover:bg-ink-sunken/50 transition-colors">
                    <td className="p-4 font-medium text-bone">#{order.id.slice(0, 10)}</td>
                    <td className="p-4">
                      <div>
                        <p className="text-sm text-bone">{order.customer_name || '—'}</p>
                        {order.customer_email && (
                          <p className="text-[10px] text-bone-3">{order.customer_email}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <ul className="list-inside list-disc text-bone-2 text-xs space-y-0.5">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.product_name} x{item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-medium text-bone">{formatCurrency(order.total)}</td>
                    <td className="p-4 text-bone-2 text-xs">{paymentLabels[order.payment_method] || order.payment_method}</td>
                    <td className="p-4">
                      <Badge variant={cfg.color}>{cfg.label}</Badge>
                    </td>
                    <td className="p-4 text-bone-2 text-xs">
                      {new Date(order.created_at).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openDetail(order)}
                          className="rounded-lg p-1.5 text-bone-3 hover:text-gilt hover:bg-gilt/5 transition-colors cursor-pointer"
                          title="Ver detalle"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        {order.status !== 'entregado' && order.status !== 'cancelado' && (
                          <button
                            onClick={() => handleNextStatus(order)}
                            className="rounded-lg px-2 py-1 text-[10px] font-medium text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title={`Avanzar a ${statusFlow[statusFlow.indexOf(order.status) + 1] || ''}`}
                          >
                            <ChevronDown className="size-3.5" />
                          </button>
                        )}
                        {order.status !== 'cancelado' && order.status !== 'entregado' && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="rounded-lg p-1.5 text-bone-3 hover:text-red-500 transition-colors cursor-pointer"
                            title="Cancelar pedido"
                          >
                            <XCircle className="size-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-sm text-bone-2">
                    {search || filterStatus !== 'todas' ? 'No se encontraron pedidos con esos filtros' : 'No hay pedidos aún'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showDetail && selectedOrder && (
        <Dialog open={showDetail} onClose={() => setShowDetail(false)} title={`Pedido #${selectedOrder.id.slice(0, 10)}`}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Cliente</p>
                <p className="text-sm font-medium text-bone mt-0.5">{selectedOrder.customer_name || '—'}</p>
                {selectedOrder.customer_email && (
                  <p className="text-xs text-bone-2">{selectedOrder.customer_email}</p>
                )}
                {selectedOrder.customer_phone && (
                  <p className="text-xs text-bone-2">{selectedOrder.customer_phone}</p>
                )}
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Estado actual</p>
                <div className="mt-1">
                  <Badge variant={statusConfig[selectedOrder.status].color}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedOrder.shipping_address && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Dirección de envío</p>
                <p className="text-sm text-bone mt-0.5">{selectedOrder.shipping_address}</p>
              </div>
            )}

            {selectedOrder.notes && (
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Notas</p>
                <p className="text-sm text-bone-2 mt-0.5">{selectedOrder.notes}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Productos</p>
              <div className="mt-1 space-y-1">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-bone">{item.product_name} <span className="text-bone-2">x{item.quantity}</span></span>
                    <span className="font-medium text-bone">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between border-t border-ink-line pt-2 text-sm font-bold">
                <span className="text-bone">Total</span>
                <span className="text-bone">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-bone-3">Método de pago</p>
              <p className="text-sm text-bone mt-0.5">{paymentLabels[selectedOrder.payment_method] || selectedOrder.payment_method}</p>
            </div>

            <div className="text-[10px] text-bone-3">
              Creado: {new Date(selectedOrder.created_at).toLocaleString('es-CO')}
            </div>

            {selectedOrder.status !== 'cancelado' && selectedOrder.status !== 'entregado' && (
              <div className="border-t border-ink-line pt-3">
                <p className="text-xs font-medium text-bone mb-2">Cambiar estado</p>
                <div className="flex flex-wrap gap-1">
                  {statusFlow.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                        selectedOrder.status === s
                          ? 'bg-gilt text-gilt-ink'
                          : 'text-bone-2 hover:bg-ink-sunken'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                  <button
                    onClick={() => handleCancel(selectedOrder.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </Dialog>
      )}
    </div>
  )
}
