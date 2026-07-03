'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { products, categories } from '@/lib/demo-data'

export default function ProductsPage() {
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-charcoal">Productos</h2>
          <p className="text-sm text-warm-gray">{products.length} fragancias registradas</p>
        </div>
        <Button variant="secondary">
          <Plus className="size-4" /> Agregar producto
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-warm-gray-light" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto…"
          className="pl-10"
        />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-charcoal/10 text-left text-xs font-medium text-warm-gray-light uppercase">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const category = categories.find((c) => c.id === product.category_id)
                return (
                  <tr key={product.id} className="border-b border-charcoal/5 hover:bg-ivory/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ivory">
                          <img src={product.image_url} alt="" className="size-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-charcoal">{product.name}</p>
                          <p className="text-xs text-warm-gray">{product.notes}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-warm-gray">{category?.name || '—'}</td>
                    <td className="p-4 font-medium text-charcoal">{formatCurrency(product.price)}</td>
                    <td className="p-4 text-warm-gray">{product.stock} uds.</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.stock === 0
                            ? 'danger'
                            : product.stock <= 3
                              ? 'warning'
                              : 'success'
                        }
                      >
                        {product.stock === 0 ? 'Agotado' : product.stock <= 3 ? 'Stock bajo' : 'Disponible'}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
