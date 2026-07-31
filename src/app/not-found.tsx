import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div
        className="haze left-1/2 top-1/2 h-[28rem] w-[36rem] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div className="shell relative text-center">
        <p className="tnum font-display text-[clamp(5rem,18vw,11rem)] leading-none text-gilt">404</p>

        <h1 className="mt-6 text-h2">Esta página se evaporó</h1>
        <p className="mx-auto mt-4 max-w-[28rem] text-[16px] leading-relaxed text-bone-3">
          El enlace que seguiste no existe, o la fragancia salió del catálogo. Prueba desde el
          catálogo completo, o deja que el test elija por ti.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/catalogo" className="btn btn-primary">
            Ver el catálogo
          </Link>
          <Link href="/quiz" className="btn btn-quiet">
            Hacer el test olfativo
          </Link>
          <Link href="/" className="btn btn-quiet">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  )
}
