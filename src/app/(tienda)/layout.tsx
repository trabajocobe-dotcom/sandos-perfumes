import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FloatingHelp } from '@/components/layout/FloatingHelp'
import { Preloader } from '@/components/layout/Preloader'
import { CartDrawer } from '@/components/commerce/CartDrawer'

/**
 * Chrome de la tienda. Vive en un grupo de rutas para que el panel y el login
 * no lo hereden, y para que ninguna página tenga que repetir Header/Footer.
 *
 * Sin barra de anuncios: los tres datos que llevaba (envío gratis, muestras,
 * cambios) ya viven en la franja de garantías de la portada y en el pie, y el
 * teléfono está en el botón flotante de ayuda. Repetirlos arriba solo empujaba
 * el contenido hacia abajo.
 */
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Solo en la tienda: el panel es una herramienta de trabajo y ahí un velo
          de marca en cada carga sería un peaje, no una presentación. */}
      <Preloader />
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <CartDrawer />
      <FloatingHelp />
    </>
  )
}
