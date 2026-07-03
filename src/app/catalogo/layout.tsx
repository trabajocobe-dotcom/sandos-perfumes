import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo | Sandós Perfumes',
  description: 'Explorá nuestra colección exclusiva de perfumes importados. Filtá por categoría y encontrá tu fragancia ideal.',
  openGraph: { title: 'Catálogo | Sandós Perfumes', description: 'Explorá nuestra colección exclusiva de perfumes importados.' },
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}
