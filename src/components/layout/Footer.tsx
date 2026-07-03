import { MessageCircle, MapPin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-charcoal/10 bg-charcoal text-cream/80">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-lg font-semibold text-cream">Sandós Perfumes</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream/60">
              Fragancias que dejan huella. Perfumes importados de alta calidad con atención personalizada.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-cream">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="text-cream/60 transition-colors hover:text-cream">Catálogo</Link></li>
              <li><Link href="/#nosotros" className="text-cream/60 transition-colors hover:text-cream">Nosotros</Link></li>
              <li><Link href="/#contacto" className="text-cream/60 transition-colors hover:text-cream">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-cream">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-cream/60">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.938.013 5.33.06 1.292.045 2.195.247 2.973.515.804.277 1.486.647 2.167 1.328.68.68 1.05 1.362 1.328 2.167.268.778.47 1.68.515 2.973.047 1.392.06 2.126.06 5.33s-.013 3.938-.06 5.33c-.045 1.292-.247 2.195-.515 2.973-.277.804-.647 1.486-1.328 2.167-.68.68-1.362 1.05-2.167 1.328-.778.268-1.68.47-2.973.515-1.392.047-2.126.06-5.33.06s-3.938-.013-5.33-.06c-1.292-.045-2.195-.247-2.973-.515-.804-.277-1.486-.647-2.167-1.328-.68-.68-1.05-1.362-1.328-2.167-.268-.778-.47-1.68-.515-2.973-.047-1.392-.06-2.126-.06-5.33s.013-3.938.06-5.33c.045-1.292.247-2.195.515-2.973.277-.804.647-1.486 1.328-2.167.68-.68 1.362-1.05 2.167-1.328.778-.268 1.68-.47 2.973-.515 1.392-.047 2.126-.06 5.33-.06zm0-2.163c-3.265 0-3.676.014-4.96.072-1.283.058-2.17.262-2.94.562-.8.31-1.49.725-2.17 1.405-.68.68-1.095 1.37-1.405 2.17-.3.77-.504 1.657-.562 2.94-.058 1.284-.072 1.695-.072 4.96 0 3.265.014 3.676.072 4.96.058 1.283.262 2.17.562 2.94.31.8.725 1.49 1.405 2.17.68.68 1.37 1.095 2.17 1.405.77.3 1.657.504 2.94.562 1.284.058 1.695.072 4.96.072 3.265 0 3.676-.014 4.96-.072 1.283-.058 2.17-.262 2.94-.562.8-.31 1.49-.725 2.17-1.405.68-.68 1.095-1.37 1.405-2.17.3-.77.504-1.657.562-2.94.058-1.284.072-1.695.072-4.96 0-3.265-.014-3.676-.072-4.96-.058-1.283-.262-2.17-.562-2.94-.31-.8-.725-1.49-1.405-2.17-.68-.68-1.37-1.095-2.17-1.405-.77-.3-1.657-.504-2.94-.562-1.284-.058-1.695-.072-4.96-.072zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
                @sandosperfumes
              </li>
              <li className="flex items-center gap-2 text-cream/60">
                <MessageCircle className="size-4" />
                11 2345-6789
              </li>
              <li className="flex items-center gap-2 text-cream/60">
                <MapPin className="size-4" />
                CABA, Argentina
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-cream">Horarios</h4>
            <ul className="space-y-1 text-sm text-cream/60">
              <li>Lun – Vie: 10:00 – 19:00</li>
              <li>Sáb: 10:00 – 14:00</li>
              <li className="mt-2 text-cream/40">Consultas por WhatsApp</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-cream/10 pt-6 text-center text-xs text-cream/40">
          &copy; {new Date().getFullYear()} Sandós Perfumes. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
