import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catálogo | Sandós Perfumes',
  description: 'Explora nuestra colección exclusiva de perfumes importados. Filtra por categoría y encuentra tu fragancia ideal.',
  openGraph: { title: 'Catálogo | Sandós Perfumes', description: 'Explora nuestra colección exclusiva de perfumes importados.' },
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}
