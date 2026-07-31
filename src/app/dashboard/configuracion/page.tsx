'use client'

import { useState } from 'react'
import { Save, ShoppingBag, Palette, Globe, Shield, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export default function ConfigPage() {
  const [saved, setSaved] = useState(false)
  const [storeName, setStoreName] = useState('Sandós Perfumes')
  const [storeEmail, setStoreEmail] = useState('info@sandosperfumes.com')
  const [storePhone, setStorePhone] = useState('+57 310 234 5678')
  const [storeAddress, setStoreAddress] = useState('Bogotá, Colombia')
  const [currency, setCurrency] = useState('COP')
  const [whatsappNumber, setWhatsappNumber] = useState('541123456789')

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-bone">Configuración</h2>
        <p className="text-sm text-bone-2">Ajustes generales del sistema</p>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-bone flex items-center gap-2 mb-4">
          <ShoppingBag className="size-4" /> Información de la tienda
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nombre de la tienda" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
          <Input label="Email de contacto" type="email" value={storeEmail} onChange={(e) => setStoreEmail(e.target.value)} />
          <Input label="Teléfono" value={storePhone} onChange={(e) => setStorePhone(e.target.value)} />
          <Input label="Dirección" value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
          <Input label="Número de WhatsApp (sin +)" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
          <div>
            <label className="mb-1 block text-xs font-medium text-bone-3">Moneda</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
            >
              <option value="COP">COP - Peso colombiano</option>
              <option value="USD">USD - Dólar estadounidense</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-bone flex items-center gap-2 mb-4">
          <Shield className="size-4" /> Roles de usuario
        </h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-ink-line p-3">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="gilt">Super Admin</Badge>
                <p className="mt-1 text-xs text-bone-2">Acceso total: usuarios, finanzas, productos, configuración</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-ink-line p-3">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="neutral">Admin</Badge>
                <p className="mt-1 text-xs text-bone-2">Gestiona productos, pedidos, inventario y ventas</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-ink-line p-3">
            <div className="flex items-center justify-between">
              <div>
                <Badge variant="warn">Visor</Badge>
                <p className="mt-1 text-xs text-bone-2">Solo lectura del dashboard y reportes</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-bone flex items-center gap-2 mb-3">
          <Globe className="size-4" /> Integración con Meta Ads
        </h3>
        <div className="space-y-4">
          <div className="rounded-brand border border-ink-line bg-ink-sunken p-4">
            <p className="text-sm font-medium text-bone">¿Cómo conectar Meta Ads?</p>
            <ol className="mt-2 space-y-2 text-xs text-bone-2 list-decimal list-inside">
              <li>Crea una cuenta en <strong>Meta Business Suite</strong> (business.facebook.com)</li>
              <li>Configura tu <strong>Catálogo de productos</strong> en Commerce Manager</li>
              <li>Instala el <strong>píxel de Meta</strong> en tu sitio para rastrear conversiones</li>
              <li>Usa el <strong>API de Conversiones</strong> para eventos del servidor (recomendado)</li>
              <li>Crea campañas en <strong>Ads Manager</strong> con el objetivo «Ventas» o «Catálogo»</li>
            </ol>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-ink-line p-4">
              <p className="text-xs font-medium text-bone-3 uppercase tracking-wider">Píxel de Meta</p>
              <div className="mt-2 flex gap-2">
                <input
                  placeholder="ID del píxel (ej: 1234567890)"
                  className="flex-1 rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-xs text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                />
              </div>
              <p className="mt-1.5 text-[10px] text-bone-3">
                Agregalo en <code className="bg-ink-sunken px-1 rounded text-bone-2">next.config.ts</code> o en el Layout
              </p>
            </div>
            <div className="rounded-lg border border-ink-line p-4">
              <p className="text-xs font-medium text-bone-3 uppercase tracking-wider">API de Conversiones</p>
              <div className="mt-2 flex gap-2">
                <input
                  placeholder="Access Token"
                  type="password"
                  className="flex-1 rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-xs text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                />
              </div>
              <p className="mt-1.5 text-[10px] text-bone-3">
                Configura el Events Manager para enviar compras y leads
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-ink-sunken/50 p-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="size-4 text-gilt shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-bone">Recursos útiles</p>
                <ul className="mt-1 space-y-1 text-xs text-bone-2">
                  <li>• <a href="https://developers.facebook.com/docs/meta-pixel" target="_blank" rel="noopener noreferrer" className="text-gilt-deep hover:underline">Documentación del píxel de Meta</a></li>
                  <li>• <a href="https://developers.facebook.com/docs/marketing-api/conversions-api" target="_blank" rel="noopener noreferrer" className="text-gilt-deep hover:underline">API de Conversiones</a></li>
                  <li>• <a href="https://www.facebook.com/business/ads" target="_blank" rel="noopener noreferrer" className="text-gilt-deep hover:underline">Meta Ads Manager</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-bone flex items-center gap-2 mb-3">
          <Palette className="size-4" /> Personalización del catálogo PDF
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-bone-3">Color primario</label>
            <div className="flex gap-2">
              {['#C9A84C', '#1A1A1A', '#8B7E74', '#059669', '#2563EB'].map((color) => (
                <button
                  key={color}
                  className="size-8 rounded-full border-2 border-transparent hover:border-ink-line/30 transition-all cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-bone-3">Fuente del catálogo</label>
            <select className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none">
              <option>Playfair Display (serif)</option>
              <option>Inter (sans-serif)</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>
          <Save className="size-4" /> {saved ? 'Guardado ✓' : 'Guardar configuración'}
        </Button>
      </div>
    </div>
  )
}
