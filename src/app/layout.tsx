import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Jost } from 'next/font/google'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'
import { WishlistProvider } from '@/hooks/useWishlist'
import { ToastProvider } from '@/components/ui/Toast'
import { SITE } from '@/lib/site'
import './globals.css'

/**
 * Jost es la única familia de la interfaz: geométrica, de trazo uniforme y
 * legible a 16px, que es el tamaño de cuerpo del sitio. Titulares, botones,
 * fichas y formularios usan Jost.
 *
 * Bodoni queda reservada al LOGOTIPO —la palabra "SANDÓS" y el monograma—.
 * Es la regla del playbook para tiendas: si la marca tiene un serif, el serif
 * se queda en el logo y no invade la interfaz.
 */
const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  variable: '--font-bodoni',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'perfumes importados',
    'fragancias',
    'perfumería nicho',
    'muestras de perfume',
    'eau de parfum',
    'notas olfativas',
    'Sandós Perfumes',
  ],
  authors: [{ name: SITE.name }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  formatDetection: { telephone: false },
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  colorScheme: 'light',
}

/** Datos estructurados de la tienda: habilita el panel de conocimiento de Google. */
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  image: `${SITE.url}/brand/logo-sandos.svg`,
  telephone: SITE.contact.whatsappDisplay,
  email: SITE.contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.contact.address,
    addressLocality: 'Bogotá',
    addressCountry: 'CO',
  },
  priceRange: '$$',
  sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.tiktok],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CO" className={`${jost.variable} ${bodoni.variable}`}>
      <head>
        {/*
          Los bloques con aparición al hacer scroll se sirven ocultos y los
          revela el JS. Esta marca dice que el JS está vivo; si no lo estuviera,
          la regla `html:not(.js)` de globals.css los muestra igual y nadie se
          queda mirando media página en blanco. Va inline y en el head para que
          corra antes del primer pintado.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }}
        />
      </head>
      <body className="min-h-screen bg-ink text-bone antialiased">
        <a
          href="#contenido"
          className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-brand bg-night px-4 py-2 text-[14px] font-medium text-white"
        >
          Saltar al contenido
        </a>

        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <ToastProvider>{children}</ToastProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  )
}
