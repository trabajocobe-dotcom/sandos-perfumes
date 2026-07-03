import { MessageCircle, MapPin, Mail } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-cream/5 bg-charcoal">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-cream">Sandós</h3>
            <p className="mt-3 text-sm leading-relaxed text-cream/50">
              Fragancias que dejan huella. Perfumes importados de alta calidad con atención personalizada.
            </p>
            <div className="mt-5 flex gap-3">
              <div className="size-9 rounded-full bg-cream/5 flex items-center justify-center text-cream/40 border border-cream/5">
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.938.013 5.33.06 1.292.045 2.195.247 2.973.515.804.277 1.486.647 2.167 1.328.68.68 1.05 1.362 1.328 2.167.268.778.47 1.68.515 2.973.047 1.392.06 2.126.06 5.33s-.013 3.938-.06 5.33c-.045 1.292-.247 2.195-.515 2.973-.277.804-.647 1.486-1.328 2.167-.68.68-1.362 1.05-2.167 1.328-.778.268-1.68.47-2.973.515-1.392.047-2.126.06-5.33.06s-3.938-.013-5.33-.06c-1.292-.045-2.195-.247-2.973-.515-.804-.277-1.486-.647-2.167-1.328-.68-.68-1.05-1.362-1.328-2.167-.268-.778-.47-1.68-.515-2.973-.047-1.392-.06-2.126-.06-5.33s.013-3.938.06-5.33c.045-1.292.247-2.195.515-2.973.277-.804.647-1.486 1.328-2.167.68-.68 1.362-1.05 2.167-1.328.778-.268 1.68-.47 2.973-.515 1.392-.047 2.126-.06 5.33-.06zm0-2.163c-3.265 0-3.676.014-4.96.072-1.283.058-2.17.262-2.94.562-.8.31-1.49.725-2.17 1.405-.68.68-1.095 1.37-1.405 2.17-.3.77-.504 1.657-.562 2.94-.058 1.284-.072 1.695-.072 4.96 0 3.265.014 3.676.072 4.96.058 1.283.262 2.17.562 2.94.31.8.725 1.49 1.405 2.17.68.68 1.37 1.095 2.17 1.405.77.3 1.657.504 2.94.562 1.284.058 1.695.072 4.96.072 3.265 0 3.676-.014 4.96-.072 1.283-.058 2.17-.262 2.94-.562.8-.31 1.49-.725 2.17-1.405.68-.68 1.095-1.37 1.405-2.17.3-.77.504-1.657.562-2.94.058-1.284.072-1.695.072-4.96 0-3.265-.014-3.676-.072-4.96-.058-1.283-.262-2.17-.562-2.94-.31-.8-.725-1.49-1.405-2.17-.68-.68-1.37-1.095-2.17-1.405-.77-.3-1.657-.504-2.94-.562-1.284-.058-1.695-.072-4.96-.072z"/></svg>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-cream/40">Navegación</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/catalogo" className="text-cream/50 transition-colors hover:text-cream">Catálogo</Link></li>
              <li><Link href="/#nosotros" className="text-cream/50 transition-colors hover:text-cream">Nosotros</Link></li>
              <li><Link href="/#contacto" className="text-cream/50 transition-colors hover:text-cream">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-cream/40">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-cream/50">
                <MessageCircle className="size-4 text-cream/30" />
                11 2345-6789
              </li>
              <li className="flex items-center gap-2.5 text-cream/50">
                <Mail className="size-4 text-cream/30" />
                contacto@sandosperfumes
              </li>
              <li className="flex items-center gap-2.5 text-cream/50">
                <MapPin className="size-4 text-cream/30" />
                CABA, Argentina
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold tracking-wider uppercase text-cream/40">Horarios</h4>
            <ul className="space-y-2 text-sm text-cream/50">
              <li className="flex justify-between"><span>Lun – Vie</span><span className="text-cream/70">10:00 – 19:00</span></li>
              <li className="flex justify-between"><span>Sábado</span><span className="text-cream/70">10:00 – 14:00</span></li>
            </ul>
            <p className="mt-4 text-xs text-cream/30">Consultas por WhatsApp</p>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/30">&copy; {new Date().getFullYear()} Sandós Perfumes. Todos los derechos reservados.</p>
          <div className="flex gap-6 text-xs text-cream/30">
            <span>Términos</span>
            <span>Privacidad</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
