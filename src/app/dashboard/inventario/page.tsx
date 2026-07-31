'use client'

/* eslint-disable @next/next/no-img-element -- Miniaturas del panel: la URL la
   escribe el administrador a mano y puede apuntar a cualquier dominio, que no
   estaría en images.remotePatterns. next/image fallaría; <img> degrada bien. */

import { useState } from 'react'
import { Plus, Search, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { formatCurrency } from '@/lib/utils'
import { products as initialProducts } from '@/lib/demo-data'
import type { Product } from '@/types'

const lowStockThreshold = 5

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [showAdjust, setShowAdjust] = useState(false)
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null)
  const [adjustQty, setAdjustQty] = useState(0)
  const [adjustReason, setAdjustReason] = useState('')
  const [movements, setMovements] = useState<{ productId: string; productName: string; qty: number; reason: string; date: string }[]>([])

  const totalStock = products.reduce((a, b) => a + b.stock, 0)
  const totalValue = products.reduce((a, b) => a + b.price * b.stock, 0)
  const lowStock = products.filter((p) => p.stock <= lowStockThreshold && p.stock > 0)
  const outOfStock = products.filter((p) => p.stock === 0)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()))
  )

  const openAdjust = (product: Product) => {
    setAdjustProduct(product)
    setAdjustQty(0)
    setAdjustReason('')
    setShowAdjust(true)
  }

  const handleAdjust = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adjustProduct || adjustQty === 0 || !adjustReason) return

    setProducts((prev) =>
      prev.map((p) =>
        p.id === adjustProduct.id
          ? { ...p, stock: Math.max(0, p.stock + adjustQty), updated_at: new Date().toISOString() }
          : p
      )
    )

    setMovements((prev) => [
      {
        productId: adjustProduct.id,
        productName: adjustProduct.name,
        qty: adjustQty,
        reason: adjustReason,
        date: new Date().toISOString(),
      },
      ...prev,
    ])

    setShowAdjust(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-bone">Inventario</h2>
        <p className="text-sm text-bone-2">Control de stock y valorización</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Unidades totales</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{totalStock}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Valor del stock</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(totalValue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Productos</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{products.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-bone-3">Costo del stock</p>
          <p className="mt-1 font-display text-2xl font-bold text-bone">{formatCurrency(Math.round(totalValue * 0.5))}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {lowStock.length > 0 && (
          <Card className="p-5 border border-clay/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-bone flex items-center gap-2">
                <AlertTriangle className="size-4 text-clay" /> Stock bajo por reponer
              </h3>
              <Badge variant="warn">{lowStock.length} productos</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg bg-clay/8 p-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-raised">
                      <img src={product.image_url} alt="" className="size-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-bone">{product.name}</p>
                      <p className="text-xs text-bone-2">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-clay">{product.stock} uds.</p>
                    <Button variant="outline" size="sm" onClick={() => openAdjust(product)}>
                      <Plus className="size-3" /> Reponer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {outOfStock.length > 0 && (
          <Card className="p-5 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-bone flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-500" /> Productos agotados
              </h3>
              <Badge variant="danger">{outOfStock.length} productos</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {outOfStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between rounded-lg bg-red-50/50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-raised">
                      <img src={product.image_url} alt="" className="size-full object-cover" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-bone">{product.name}</p>
                      <p className="text-xs text-bone-2">{formatCurrency(product.price)}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => openAdjust(product)}>
                    <Plus className="size-3" /> Ingresar stock
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-bone">Todos los productos</h3>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-bone-3" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en inventario…"
              className="pl-9 text-sm"
            />
          </div>
        </div>
        <div className="space-y-2">
          {filtered.map((product) => {
            const maxStock = Math.max(...products.map((p) => p.stock), 1)
            const percentage = (product.stock / maxStock) * 100
            return (
              <div key={product.id} className="flex items-center gap-4 rounded-lg border border-ink-line p-3 hover:bg-ink-sunken/50 transition-colors">
                <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-sunken">
                  <img src={product.image_url} alt="" className="size-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-bone">{product.name}</p>
                    <p className="text-sm font-medium text-bone">{product.stock} uds.</p>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          product.stock <= 0 ? '#ef4444' :
                          product.stock <= lowStockThreshold ? '#f59e0b' : '#10b981',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] text-bone-3">
                      {formatCurrency(product.price)} • {product.stock <= 0 ? 'Agotado' : product.stock <= lowStockThreshold ? 'Por reponer' : 'Stock OK'}
                    </p>
                    <Button variant="quiet" size="sm" onClick={() => openAdjust(product)} className="text-[10px]">
                      Ajustar stock
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {movements.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-bone mb-4 flex items-center gap-2">
            <TrendingUp className="size-4" /> Movimientos de stock
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                  <th className="pb-3 pr-4">Producto</th>
                  <th className="pb-3 pr-4">Cantidad</th>
                  <th className="pb-3 pr-4">Motivo</th>
                  <th className="pb-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m, i) => (
                  <tr key={i} className="border-b border-ink-line">
                    <td className="py-3 pr-4 font-medium text-bone">{m.productName}</td>
                    <td className="py-3 pr-4">
                      <span className={`flex items-center gap-1 font-medium ${m.qty > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {m.qty > 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {m.qty > 0 ? '+' : ''}{m.qty}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-bone-2">{m.reason}</td>
                    <td className="py-3 text-bone-2 text-xs">{new Date(m.date).toLocaleString('es-CO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {showAdjust && adjustProduct && (
        <Dialog open={showAdjust} onClose={() => setShowAdjust(false)} title={`Ajustar stock: ${adjustProduct.name}`}>
          <form onSubmit={handleAdjust} className="space-y-4">
            <div>
              <p className="text-xs text-bone-2 mb-2">
                Stock actual: <strong className="text-bone">{adjustProduct.stock} uds.</strong>
              </p>
              <label className="mb-1 block text-xs font-medium text-bone-3">
                Cantidad a ajustar (positivo para ingresar, negativo para egresar)
              </label>
              <input
                type="number"
                value={adjustQty}
                onChange={(e) => setAdjustQty(Number(e.target.value))}
                className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                placeholder="Ej: +10 o -5"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-bone-3">Motivo del ajuste</label>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                required
              >
                <option value="">Seleccionar motivo…</option>
                <option value="Compra a proveedor">Compra a proveedor</option>
                <option value="Devolución de cliente">Devolución de cliente</option>
                <option value="Ajuste de inventario">Ajuste de inventario</option>
                <option value="Merma o pérdida">Merma o pérdida</option>
                <option value="Venta">Venta</option>
                <option value="Transferencia">Transferencia entre sucursales</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => setShowAdjust(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={adjustQty === 0 || !adjustReason}>
                Guardar ajuste
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  )
}
