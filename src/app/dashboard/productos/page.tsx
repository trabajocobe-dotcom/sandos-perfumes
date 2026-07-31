'use client'

/* eslint-disable @next/next/no-img-element -- Miniaturas del panel: la URL la
   escribe el administrador a mano y puede apuntar a cualquier dominio, que no
   estaría en images.remotePatterns. next/image fallaría; <img> degrada bien. */

import { useState } from 'react'
import { Plus, Search, Edit3, Trash2, Copy, Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Dialog } from '@/components/ui/Dialog'
import { formatCurrency, slugify } from '@/lib/utils'
import { products as initialProducts, categories } from '@/lib/demo-data'
import type { Product } from '@/types'

/** Valores por defecto de una fragancia nueva, alineados con el modelo actual. */
const emptyProduct: Product = {
  id: '',
  name: '',
  house: '',
  slug: '',
  tagline: '',
  description: '',
  price: 0,
  image_url: '',
  stock: 0,
  category_id: '1',
  family: 'amaderada',
  pyramid: { top: [], heart: [], base: [] },
  concentration: 'EDP',
  longevity: 3,
  sillage: 3,
  volume: '100 ml',
  gender: 'masculino',
  occasions: ['diario'],
  seasons: ['otono'],
  sample_available: true,
  sample_price: 18000,
  rating: 0,
  review_count: 0,
  featured: false,
  created_at: '',
  updated_at: '',
}

export default function ProductsPage() {
  const [search, setSearch] = useState('')
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState<Product>({ ...emptyProduct, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  const [error, setError] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()))
  )

  const openNew = () => {
    setEditing(null)
    setForm({ ...emptyProduct, id: `p${Date.now()}`, slug: '', created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    setError('')
    setShowModal(true)
  }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({ ...product })
    setError('')
    setShowModal(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.description || !form.price || !form.image_url) {
      setError('Completa todos los campos requeridos (*)')
      return
    }

    const now = new Date().toISOString()

    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...form, updated_at: now } : p))
      )
    } else {
      const newProduct: Product = {
        ...form,
        id: `p${Date.now()}`,
        slug: slugify(form.name),
        created_at: now,
        updated_at: now,
      }
      setProducts((prev) => [...prev, newProduct])
    }

    setShowModal(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar este producto permanentemente?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleDuplicate = (product: Product) => {
    const dup: Product = {
      ...product,
      id: `p${Date.now()}`,
      name: `${product.name} (copia)`,
      slug: slugify(`${product.name} copia`),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setProducts((prev) => [...prev, dup])
  }

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-bone">Productos</h2>
          <p className="text-sm text-bone-2">{products.length} fragancias registradas</p>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Plus className="size-4" /> Nuevo producto
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bone-3" />
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
              <tr className="border-b border-ink-line text-left text-xs font-medium text-bone-3 uppercase">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Destacado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const category = categories.find((c) => c.id === product.category_id)
                return (
                  <tr key={product.id} className="border-b border-ink-line hover:bg-ink-sunken/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-sunken">
                          <img src={product.image_url} alt="" className="size-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-bone">{product.name}</p>
                          <p className="text-xs text-bone-2">{product.notes}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-bone-2">{category?.name || '—'}</td>
                    <td className="p-4 font-medium text-bone">{formatCurrency(product.price)}</td>
                    <td className="p-4 text-bone-2">{product.stock} uds.</td>
                    <td className="p-4">
                      <Badge
                        variant={
                          product.stock === 0 ? 'danger' : product.stock <= 3 ? 'warn' : 'ok'
                        }
                      >
                        {product.stock === 0 ? 'Agotado' : product.stock <= 3 ? 'Stock bajo' : 'Disponible'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`transition-colors cursor-pointer ${product.featured ? 'text-gilt' : 'text-bone-3 hover:text-bone-2'}`}
                      >
                        <Star className={`size-4 ${product.featured ? 'fill-gilt' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="rounded-lg p-1.5 text-bone-3 hover:text-gilt hover:bg-gilt/5 transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(product)}
                          className="rounded-lg p-1.5 text-bone-3 hover:text-bone hover:bg-ink-sunken transition-colors cursor-pointer"
                          title="Duplicar"
                        >
                          <Copy className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-lg p-1.5 text-bone-3 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-sm text-bone-2">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {showModal && (
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          title={editing ? 'Editar producto' : 'Nuevo producto'}
        >
          <form onSubmit={handleSave} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Nombre *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Precio *" type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-bone-3">Descripción *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none resize-none"
                rows={3}
                required
              />
            </div>
            <Input label="URL de imagen *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." required />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-bone-3">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-bone-3">Categoría</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Notas" value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Pomelo, Jengibre" />
              <div>
                <label className="mb-1 block text-xs font-medium text-bone-3">Volumen</label>
                <select
                  value={form.volume}
                  onChange={(e) => setForm({ ...form, volume: e.target.value })}
                  className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                >
                  <option value="30ml">30ml</option>
                  <option value="50ml">50ml</option>
                  <option value="60ml">60ml</option>
                  <option value="75ml">75ml</option>
                  <option value="80ml">80ml</option>
                  <option value="100ml">100ml</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-bone-3">Género</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as Product['gender'] })}
                  className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-bone pt-2">
              <input
                type="checkbox"
                checked={form.featured || false}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded border-ink-line/30 accent-gold"
              />
              Producto destacado
            </label>

            {form.image_url && (
              <div className="rounded-lg overflow-hidden border border-ink-line">
                <img src={form.image_url} alt="Preview" className="h-24 w-full object-cover" />
              </div>
            )}

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-2 border-t border-ink-line">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {editing ? 'Guardar cambios' : 'Crear producto'}
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  )
}
