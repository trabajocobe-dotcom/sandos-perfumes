'use client'

/* eslint-disable @next/next/no-img-element -- Miniaturas del panel: la URL la
   escribe el administrador a mano y puede apuntar a cualquier dominio, que no
   estaría en images.remotePatterns. next/image fallaría; <img> degrada bien. */

import { useState, useRef } from 'react'
import jsPDF from 'jspdf'
import { Download, Eye, FileText, Settings } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { products, categories } from '@/lib/demo-data'

export default function CatalogoPage() {
  const previewRef = useRef<HTMLDivElement>(null)
  const [generating, setGenerating] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [brandName, setBrandName] = useState('Sandós Perfumes')
  const [brandTagline, setBrandTagline] = useState('Fragancias que Dejan Huella')
  const [showSettings, setShowSettings] = useState(false)
  const [includePrices, setIncludePrices] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('todas')

  const filtered = selectedCategory === 'todas'
    ? products
    : products.filter((p) => p.category_id === selectedCategory)

  const generateSimplePDF = () => {
    setGenerating(true)
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')
      let y = 20

      pdf.setFontSize(22)
      pdf.setTextColor(26, 26, 26)
      pdf.text(brandName, 105, y, { align: 'center' })
      y += 8
      pdf.setFontSize(11)
      pdf.setTextColor(139, 126, 116)
      pdf.text(brandTagline, 105, y, { align: 'center' })
      y += 6
      pdf.setFontSize(8)
      pdf.setTextColor(180, 180, 180)
      pdf.text(`Generado el ${new Date().toLocaleDateString('es-CO')}`, 105, y, { align: 'center' })
      y += 14

      pdf.setDrawColor(201, 168, 76)
      pdf.setLineWidth(0.5)
      pdf.line(15, y, 195, y)
      y += 8

      filtered.forEach((product, i) => {
        if (y > 265) {
          pdf.addPage()
          y = 20
        }

        const category = categories.find((c) => c.id === product.category_id)

        pdf.setFontSize(14)
        pdf.setTextColor(26, 26, 26)
        pdf.setFont('helvetica', 'bold')
        pdf.text(product.name, 20, y)

        pdf.setFontSize(9)
        pdf.setTextColor(139, 126, 116)
        pdf.setFont('helvetica', 'normal')
        const descLines = pdf.splitTextToSize(product.description, 120)
        pdf.text(descLines, 20, y + 5)

        pdf.setFontSize(10)
        pdf.setTextColor(139, 126, 116)
        pdf.text(`Notas: ${product.notes || '—'}`, 20, y + 5 + descLines.length * 4 + 2)
        pdf.text(`Vol: ${product.volume || '—'} | ${category?.name || '—'} | ${product.gender || 'Unisex'}`, 20, y + 5 + descLines.length * 4 + 7)

        if (includePrices) {
          pdf.setFontSize(16)
          pdf.setTextColor(201, 168, 76)
          pdf.setFont('helvetica', 'bold')
          pdf.text(formatCurrency(product.price), 170, y, { align: 'right' })
        }

        if (product.stock <= 3) {
          pdf.setFontSize(8)
          pdf.setTextColor(239, 68, 68)
          pdf.text('STOCK BAJO', 170, y + 6, { align: 'right' })
        }

        y += 12 + descLines.length * 4 + 10

        if (i < filtered.length - 1) {
          pdf.setDrawColor(220, 220, 220)
          pdf.setLineWidth(0.3)
          pdf.line(20, y, 190, y)
          y += 5
        }
      })

      pdf.save(`catalogo-sandos-${new Date().toISOString().split('T')[0]}.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
      alert('Error al generar el PDF.')
    }
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-bone">Catálogo PDF</h2>
          <p className="text-sm text-bone-2">Genera y descarga tu catálogo de productos actualizado</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
            <Settings className="size-4" /> Configurar
          </Button>
          <Button variant="primary" size="sm" onClick={generateSimplePDF} disabled={generating || filtered.length === 0}>
            <FileText className="size-4" /> {generating ? 'Generando…' : 'Generar PDF'}
          </Button>
        </div>
      </div>

      {showSettings && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-bone flex items-center gap-2">
            <Settings className="size-4" /> Configuración del catálogo
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-bone-3">Nombre de la marca</label>
              <input
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-bone-3">Eslogan</label>
              <input
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-bone">
              <input
                type="checkbox"
                checked={includePrices}
                onChange={(e) => setIncludePrices(e.target.checked)}
                className="rounded border-ink-line/30 accent-gold"
              />
              Incluir precios
            </label>
            <div>
              <label className="mb-1 block text-xs font-medium text-bone-3">Filtrar por categoría</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-ink-line bg-ink-raised px-3 py-1.5 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
              >
                <option value="todas">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-bone-3">{filtered.length} productos incluidos</p>
        </Card>
      )}

      <div className="flex gap-2">
        <Button
          variant={showPreview ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setShowPreview(true)}
        >
          <Eye className="size-4" /> Vista previa
        </Button>
        <Button
          variant={!showPreview ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setShowPreview(false)}
        >
          <FileText className="size-4" /> Vista simple
        </Button>
      </div>

      {showPreview ? (
        <div ref={previewRef} className="space-y-6">
          <Card className="catalog-page overflow-hidden">
            <div className="bg-gradient-to-br from-charcoal to-charcoal/90 p-8 text-center">
              <h1 className="font-display text-3xl font-bold text-bone">{brandName}</h1>
              <p className="mt-2 text-sm text-gilt">{brandTagline}</p>
              <p className="mt-1 text-[10px] text-bone-3">
                Catálogo • {new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="mx-auto mt-4 h-px w-20 bg-gilt/40" />
              <p className="mt-3 text-xs text-bone-3">{filtered.length} fragancias</p>
            </div>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((product) => {
              const category = categories.find((c) => c.id === product.category_id)
              return (
                <Card key={product.id} className="catalog-page overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-ink-sunken">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="size-full object-cover"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-base font-bold text-bone">{product.name}</h3>
                          <Badge variant="gilt" className="mt-0.5">
                            {category?.name || '—'}
                          </Badge>
                        </div>
                        {includePrices && (
                          <p className="shrink-0 font-display text-lg font-bold text-gilt-deep">
                            {formatCurrency(product.price)}
                          </p>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-bone-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-bone-3">
                        {product.notes && <span>🌿 {product.notes}</span>}
                        {product.volume && <span>📦 {product.volume}</span>}
                        {product.gender && (
                          <span>
                            {product.gender === 'masculino' ? '👔' : product.gender === 'femenino' ? '👗' : '🧑'} {product.gender}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="catalog-page overflow-hidden">
            <div className="bg-ink-sunken/80 p-6 text-center">
              <p className="font-display text-lg font-bold text-bone">{brandName}</p>
              <p className="mt-1 text-xs text-bone-2">{brandTagline}</p>
              <div className="mx-auto mt-3 h-px w-16 bg-gilt/30" />
              <p className="mt-3 text-[10px] text-bone-3">
                Catálogo generado el {new Date().toLocaleDateString('es-CO')} • Los precios pueden variar sin previo aviso
              </p>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="p-5">
          <div className="space-y-0 divide-y divide-ink-line">
            {filtered.map((product, i) => {
              const category = categories.find((c) => c.id === product.category_id)
              return (
                <div key={product.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs text-bone-3 w-5 shrink-0">{i + 1}.</span>
                    <div className="size-10 shrink-0 overflow-hidden rounded-lg bg-ink-sunken">
                      <img src={product.image_url} alt="" className="size-full object-cover" crossOrigin="anonymous" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-bone truncate">{product.name}</p>
                      <p className="text-[10px] text-bone-2">
                        {category?.name} • {product.volume || '—'} • {product.notes?.split(',')[0] || ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {includePrices && (
                      <p className="text-sm font-bold text-gilt-deep">{formatCurrency(product.price)}</p>
                    )}
                    <Badge variant={product.stock <= 3 ? 'warn' : 'ok'}>
                      {product.stock} uds.
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card className="p-4 bg-ink-sunken/50">
        <div className="flex items-start gap-3">
          <Download className="size-5 text-gilt shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-bone">Descargar catálogo</p>
            <p className="mt-0.5 text-xs text-bone-2">
              El PDF se genera con los datos actuales. Asegurate de que los precios y stocks estén actualizados antes de descargar.
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-3"
              onClick={generateSimplePDF}
              disabled={generating || filtered.length === 0}
            >
              <FileText className="size-4" /> {generating ? 'Generando PDF…' : `Descargar PDF (${filtered.length} productos)`}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
