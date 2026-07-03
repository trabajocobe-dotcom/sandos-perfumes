import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Ruta de callback para OAuth de Supabase.
 *
 * Cuando el usuario se autentica con Google, Supabase redirige
 * a esta URL con un código de intercambio.
 *
 * TODO: Esta ruta se activa cuando se configura Supabase Auth.
 * Por ahora devuelve 501 (Not Implemented).
 */
export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    return NextResponse.redirect(`${origin}/auth/login?error=Auth failed`)
  } catch {
    return NextResponse.json(
      { error: 'Auth callback not ready — configure Supabase' },
      { status: 501 }
    )
  }
}
