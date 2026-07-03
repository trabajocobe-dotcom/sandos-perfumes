import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ingresar | Sandós Perfumes',
  description: 'Iniciá sesión en Sandós Perfumes para acceder al dashboard de administración.',
}

export default function AuthLoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
