'use client'

import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { products } from '@/lib/demo-data'

const totalStock = products.reduce((a, b) => a + b.stock, 0)
const totalValue = products.reduce((a, b) => a + b.price * b.stock, 0)
const lowStock = products.filter((p) => p.stock <= 5)
const outOfStock = products.filter((p) => p.stock === 0)

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-charcoal">Inventario</h2>
        <p className="text-sm text-warm-gray">Control de stock y valorización</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Unidades totales</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{totalStock}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Valor del stock</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{formatCurrency(totalValue)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-warm-gray-light">Productos distintos</p>
          <p className="mt-1 font-serif text-2xl font-bold text-charcoal">{products.length}</p>
        </Card>
      </div>

      {lowStock.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-charcoal">Productos con stock bajo</h3>
            <Badge variant="warning">{lowStock.length} productos</Badge>
          </div>
          <div className="mt-4 space-y-3">
            {lowStock.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg bg-ivory/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-white">
                    <img src={product.image_url} alt="" className="size-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-charcoal">{product.name}</p>
                    <p className="text-xs text-warm-gray">{formatCurrency(product.price)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${product.stock === 0 ? 'text-red-500' : 'text-amber-600'}`}>
                    {product.stock} uds.
                  </p>
                  <Badge variant={product.stock === 0 ? 'danger' : 'warning'}>
                    {product.stock === 0 ? 'Agotado' : 'Por reponer'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-charcoal">Distribución de stock</h3>
        <div className="mt-4 space-y-3">
          {products.map((product) => {
            const maxStock = Math.max(...products.map((p) => p.stock))
            const percentage = (product.stock / maxStock) * 100
            return (
              <div key={product.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-warm-gray">{product.name}</span>
                  <span className="font-medium text-charcoal">{product.stock} uds.</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor:
                        product.stock <= 3 ? '#ef4444' : product.stock <= 8 ? '#f59e0b' : '#C9A84C',
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
