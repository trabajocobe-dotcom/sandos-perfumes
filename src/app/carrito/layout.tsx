import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carrito | Sandós Perfumes',
  description: 'Revisá tu carrito de compras y finalizá tu pedido.',
  openGraph: { title: 'Carrito | Sandós Perfumes' },
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children
}
