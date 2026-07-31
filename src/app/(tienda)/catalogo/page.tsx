import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogView } from '@/components/catalog/CatalogView'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Catálogo de fragancias',
  description:
    'Explora el catálogo completo de Sandós: filtra por familia olfativa, nota, ocasión y presupuesto. Todas las fichas incluyen pirámide olfativa, duración y estela.',
  alternates: { canonical: '/catalogo' },
  openGraph: {
    title: `Catálogo de fragancias · ${SITE.name}`,
    description:
      'Filtra por familia olfativa, nota, ocasión y presupuesto. Muestras de 2 ml disponibles.',
    url: `${SITE.url}/catalogo`,
  },
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="shell py-20">
          <ProductGridSkeleton />
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  )
}
