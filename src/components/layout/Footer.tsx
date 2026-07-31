import Link from 'next/link'
import { MapPin, MessageCircle } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { NewsletterForm } from '@/components/commerce/NewsletterForm'
import { SITE } from '@/lib/site'
import { whatsappGeneral } from '@/lib/whatsapp'

const SHOP_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Todas las fragancias' },
  { href: '/catalogo?genero=femenino', label: 'Femeninas' },
  { href: '/catalogo?genero=masculino', label: 'Masculinas' },
  { href: '/catalogo?genero=unisex', label: 'Unisex' },
  { href: '/muestras', label: 'Set de muestras' },
  { href: '/catalogo?oferta=1', label: 'Ofertas' },
]

const HELP_LINKS = [
  { href: '/quiz', label: 'Test de firma olfativa' },
  { href: '/blog', label: 'Blog' },
  { href: '/legal/envios', label: 'Envíos y entregas' },
  { href: '/legal/devoluciones', label: 'Cambios y devoluciones' },
  { href: '/legal/autenticidad', label: 'Garantía de autenticidad' },
  { href: '/legal/terminos', label: 'Términos y condiciones' },
  { href: '/legal/privacidad', label: 'Política de privacidad' },
]

export function Footer() {
  return (
    <footer className="on-dark mt-[var(--spacing-section)]">
      {/* Wordmark a ancho completo antes de las columnas, como cierre de marca */}
      {/* La firma del pie estaba a 9rem: ocupaba una pantalla entera de altura
          para decir algo que el visitante ya sabe. A este tamaño sigue siendo
          el cierre de la página sin competir con el contenido de arriba. */}
      <div className="shell border-b border-ink-line py-10 text-center">
        <Link
          href="/"
          aria-label="Sandós Perfumes, ir al inicio"
          className="inline-block transition-opacity hover:opacity-80"
        >
          <span className="block font-brand text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] tracking-[0.1em] text-bone">
            SANDÓS
          </span>
          <span className="mt-3 block font-brand text-[11px] tracking-[0.36em] text-gilt">
            PERFUMES &amp; FRAGANCIAS
          </span>
        </Link>
      </div>

      <div className="shell">
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1.3fr] lg:gap-10">
          <div>
            <Logo variant="mark" className="h-14" />

            <p className="mt-6 max-w-[22rem] text-[15px] leading-relaxed text-bone-2">
              Perfumería importada seleccionada nota por nota. Trabajamos con distribuidores
              autorizados y enviamos muestras para que nadie compre a ciegas.
            </p>
          </div>

          <FooterColumn title="Tienda" links={SHOP_LINKS} />
          <FooterColumn title="Ayuda" links={HELP_LINKS} />

          <div>
            <h2 className="overline">Dónde encontrarnos</h2>

            <ul className="mt-5 space-y-4 text-[14px] text-bone-3">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gilt" strokeWidth={1.5} />
                <span>
                  {SITE.contact.address}
                  <br />
                  <span className="text-bone-3">{SITE.contact.hours}</span>
                </span>
              </li>
              <li>
                <a
                  href={whatsappGeneral()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-gilt"
                >
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-gilt" strokeWidth={1.5} />
                  <span>
                    {SITE.contact.whatsappDisplay}
                    <br />
                    <span className="text-bone-3">{SITE.contact.email}</span>
                  </span>
                </a>
              </li>
            </ul>

            <div className="mt-7 flex items-center gap-4">
              <SocialLink href={SITE.social.instagram} label="Instagram">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.9 4.9 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.9 4.9 0 0 1-1.153 1.772 4.9 4.9 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.9 4.9 0 0 1-1.772-1.153 4.9 4.9 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428A4.9 4.9 0 0 1 3.678 3.68 4.9 4.9 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </SocialLink>
              <SocialLink href={SITE.social.facebook} label="Facebook">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </SocialLink>
              <SocialLink href={SITE.social.tiktok} label="TikTok">
                <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.7a5.68 5.68 0 0 0-.77-.05A5.66 5.66 0 1 0 15.54 15.3V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48z" />
              </SocialLink>
            </div>

            <h2 className="overline mt-9">Novedades</h2>
            <p className="mt-4 text-[14px] leading-relaxed text-bone-3">
              Una vez por mes: lanzamientos, notas de temporada y ofertas reales. Sin spam.
            </p>
            <NewsletterForm className="mt-4" />
          </div>
        </div>

      </div>

      {/* Franja de copyright: banda clara al pie, como en la referencia */}
      <div className="band-mist">
        <div className="shell">
          <div className="flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
            <p className="text-[13px]">
              © {new Date().getFullYear()} · <strong className="font-medium">{SITE.name}</strong>{' '}
              Todos los derechos reservados.
            </p>
            <p className="text-[13px]">Perfumería importada · Envíos a todo el país</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <h2 className="overline">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="link-arrow">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-9 place-items-center rounded-brand border border-ink-line text-bone-3 transition-colors hover:border-gilt/60 hover:text-gilt"
    >
      <svg className="size-[1rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {children}
      </svg>
    </a>
  )
}
