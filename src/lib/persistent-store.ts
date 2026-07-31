/**
 * Store mínimo persistido en localStorage, compatible con `useSyncExternalStore`.
 *
 * Resuelve el problema clásico de estos carritos en Next.js: si el primer render
 * del cliente lee localStorage, el HTML del servidor (carrito vacío) y el del
 * cliente (carrito con ítems) no coinciden y React tira un error de hidratación.
 *
 * La solución: `getServer` devuelve SIEMPRE el valor inicial —React lo usa
 * durante la hidratación, así que el marcado coincide— y la lectura real ocurre
 * de forma perezosa la primera vez que se pide `get` ya en el navegador. React
 * compara ambos snapshots al terminar de hidratar y vuelve a renderizar solo si
 * cambiaron, sin que nadie tenga que emitir un evento a destiempo.
 */

export interface PersistentStore<T> {
  get: () => T
  getServer: () => T
  set: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

export function createPersistentStore<T>(
  key: string,
  initialValue: T,
  options: { revive?: (raw: unknown) => T } = {}
): PersistentStore<T> {
  const listeners = new Set<() => void>()
  let value: T = initialValue
  let hydrated = false

  const emit = () => listeners.forEach((listener) => listener())

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return initialValue
      const parsed = JSON.parse(raw)
      return options.revive ? options.revive(parsed) : (parsed as T)
    } catch {
      // Dato corrupto o storage bloqueado: se descarta y se sigue con el inicial.
      return initialValue
    }
  }

  const write = (next: T) => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(key, JSON.stringify(next))
    } catch (error) {
      // Cuota llena o modo privado: el estado sigue vivo en memoria.
      console.warn(`[${key}] no se pudo persistir en localStorage`, error)
    }
  }

  /** Idempotente y sin efectos observables fuera del store. */
  const hydrateOnce = () => {
    if (hydrated || typeof window === 'undefined') return
    hydrated = true
    value = read()

    // Sincroniza entre pestañas abiertas del mismo sitio.
    window.addEventListener('storage', (event) => {
      if (event.key !== key) return
      value = read()
      emit()
    })
  }

  return {
    get: () => {
      hydrateOnce()
      return value
    },
    getServer: () => initialValue,
    set: (next) => {
      hydrateOnce()
      value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
      write(value)
      emit()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}
