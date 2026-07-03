import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { CartProvider } from '@/hooks/useCart'
import { AuthProvider } from '@/hooks/useAuth'
import { ToastProvider } from '@/components/ui/Toast'
import { BackToTop } from '@/components/ui/BackToTop'
import { ChatButton } from '@/components/whatsapp/ChatButton'
import { Preloader } from '@/components/layout/Preloader'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
})

export const metadata: Metadata = {
  title: 'Sandós Perfumes | Fragancias que Dejan Huella',
  description:
    'Descubrí nuestra colección exclusiva de perfumes importados. Calidad premium, atención personalizada.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-charcoal text-cream">
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <Preloader />
              {children}
              <BackToTop />
              <ChatButton />
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
