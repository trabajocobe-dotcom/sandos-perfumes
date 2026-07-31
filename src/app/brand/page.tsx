'use client'

/* eslint-disable @next/next/no-img-element -- Miniaturas del panel: la URL la
   escribe el administrador a mano y puede apuntar a cualquier dominio, que no
   estaría en images.remotePatterns. next/image fallaría; <img> degrada bien. */

const colors = [
  { name: 'Charcoal', hex: '#1A1A1A' },
  { name: 'Gold', hex: '#C9A84C' },
  { name: 'Gold Light', hex: '#D4BA6A' },
  { name: 'Gold Dark', hex: '#A88A3A' },
  { name: 'Cream', hex: '#FAF8F5' },
]

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-[#f5f5f5] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-3xl text-center text-[#1A1A1A] mb-2">Sandós Perfumes</h1>
        <p className="text-center text-sm text-[#999] mb-12 tracking-[0.15em] uppercase">LOGO DESIGN PREVIEW</p>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-ink-raised rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-[#fafafa] border-b border-[#eee] flex justify-between items-center">
              <span className="text-xs text-[#666]">Variante - Fondo Blanco</span>
              <span className="bg-[#C9A84C] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">Principal</span>
            </div>
            <div className="p-8 flex items-center justify-center min-h-[260px]">
              <img src="/brand/logo.png" alt="Sandós Logo" className="max-w-full h-auto max-h-[200px]" />
            </div>
          </div>

          <div className="bg-ink-raised rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-[#fafafa] border-b border-[#eee] flex justify-between items-center">
              <span className="text-xs text-[#666]">Variante - Fondo Oscuro</span>
              <span className="bg-[#C9A84C] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">Dark Mode</span>
            </div>
            <div className="p-8 flex items-center justify-center min-h-[260px] bg-[#1A1A1A]">
              <img src="/brand/logo.png" alt="Sandós Logo" className="max-w-full h-auto max-h-[200px]" />
            </div>
          </div>

          <div className="bg-ink-raised rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-[#fafafa] border-b border-[#eee] flex justify-between items-center">
              <span className="text-xs text-[#666]">Ícono / Favicon</span>
              <span className="bg-[#C9A84C] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">128x128</span>
            </div>
            <div className="p-8 flex items-center justify-center min-h-[200px]">
              <img src="/brand/logo.png" alt="Sandós Icon" className="size-28 object-contain" />
            </div>
          </div>

          <div className="bg-ink-raised rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3 bg-[#fafafa] border-b border-[#eee] flex justify-between items-center">
              <span className="text-xs text-[#666]">Aplicación - Tarjeta</span>
              <span className="bg-[#C9A84C] text-white text-[10px] font-medium px-2.5 py-1 rounded-full">Mockup</span>
            </div>
            <div className="p-8 flex items-center justify-center min-h-[200px]" style={{ background: 'linear-gradient(135deg, #faf8f5, #fff)' }}>
              <div className="text-center">
                <img src="/brand/logo.png" alt="Sandós" className="mx-auto mb-3 size-16 object-contain" />
                <div className="font-display text-xl text-[#1A1A1A] tracking-[0.15em] mb-1">SANDÓS</div>
                <div className="text-[10px] text-[#C9A84C] tracking-[0.3em] uppercase">PERFUMES</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-ink-raised rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="font-display text-xl text-[#1A1A1A] mb-6">Especificaciones de Marca</h2>

          <div className="flex flex-wrap gap-5 mb-6">
            {colors.map((c) => (
              <div key={c.hex} className="flex items-center gap-3">
                <div
                  className="size-11 rounded-lg border-2"
                  style={{
                    background: c.hex,
                    borderColor: c.hex === '#FAF8F5' || c.hex === '#FFFFFF' ? '#ddd' : c.hex,
                  }}
                />
                <div>
                  <span className="font-semibold text-xs text-[#333] block">{c.name}</span>
                  <span className="text-[11px] text-[#999] font-mono">{c.hex}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#eee] pt-6">
            <h3 className="text-xs text-[#666] uppercase tracking-[0.15em] mb-4">Tipografía</h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-[#999] uppercase tracking-[0.15em] mb-1">Playfair Display (Wordmark)</p>
                <p className="font-display text-3xl text-[#1A1A1A]">SANDÓS</p>
              </div>
              <div>
                <p className="text-[10px] text-[#999] uppercase tracking-[0.15em] mb-1">Inter (Subtítulos)</p>
                <p className="text-lg text-[#666] tracking-[0.15em]">PERFUMES</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-[#999] tracking-wide">
          Sandós Perfumes &mdash; Fragancias que dejan huella
        </p>
      </div>
    </main>
  )
}
