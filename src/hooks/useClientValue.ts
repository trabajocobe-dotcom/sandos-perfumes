'use client'

import { useMemo, useState, useSyncExternalStore } from 'react'

const subscribeNoop = () => () => {}

/**
 * "¿Ya estamos en el navegador?", sin efectos ni estado.
 * `getServerSnapshot` devuelve false (con eso se genera el HTML del servidor) y
 * `getSnapshot` devuelve true; React resuelve la diferencia al hidratar.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
}

/**
 * Lee un valor que solo existe en el navegador (localStorage, `window`) y
 * devuelve además una función para releerlo.
 *
 * Por qué no se lee en el primer render: el servidor no tiene localStorage, así
 * que si el cliente devolviera los datos guardados de entrada, el HTML no
 * coincidiría con el del servidor y React fallaría al hidratar. Se arranca en
 * `initial` y se lee recién cuando la hidratación terminó.
 *
 * `read` se captura una sola vez: quienes usan este hook pasan funciones de
 * módulo estables (`getOrders`, `getSession`), no closures que cambien.
 */
export function useClientValue<T>(read: () => T, initial: T): [T, () => void] {
  const hydrated = useIsHydrated()
  const [reader] = useState(() => read)
  const [nonce, setNonce] = useState(0)

  const value = useMemo(() => {
    // `nonce` no interviene en el cálculo: es la señal que dispara la relectura
    // del almacenamiento cuando alguien llama a refresh().
    void nonce
    return hydrated ? reader() : initial
  }, [hydrated, reader, initial, nonce])

  const refresh = () => setNonce((n) => n + 1)

  return [value, refresh]
}
