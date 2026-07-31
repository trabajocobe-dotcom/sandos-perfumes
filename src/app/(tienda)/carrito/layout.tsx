import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito | Sandós Perfumes',
  description: 'Revisa tu carrito de compras y finaliza tu pedido.',
  openGraph: { title: 'Carrito | Sandós Perfumes' },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
