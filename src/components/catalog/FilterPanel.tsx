'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  allNotes,
  countByFamily,
  FAMILIES,
  GENDER_LABEL,
  OCCASION_LABEL,
  SEASON_LABEL,
} from '@/lib/catalog'
import { formatCurrency } from '@/lib/utils'
import type { Gender, Occasion, Season } from '@/types'

export interface FilterState {
  familias: string[]
  generos: string[]
  ocasiones: string[]
  estaciones: string[]
  notas: string[]
  maxPrice?: number
  soloStock: boolean
  soloOferta: boolean
}

interface FilterPanelProps {
  state: FilterState
  onToggle: (key: keyof FilterState, value: string) => void
  onSet: (key: keyof FilterState, value: boolean | number | undefined) => void
  bounds: { min: number; max: number }
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  /*
   * El contenido queda SIEMPRE montado: la altura se anima con
   * `grid-template-rows`, y para eso el navegador necesita poder medir lo que
   * hay adentro. Cerrado, el CSS le pone `visibility: hidden`, que además lo
   * saca del recorrido con tabulador.
   */
  return (
    <div className="filtro-seccion" data-abierto={open}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="filtro-titulo"
      >
        <span className="overline">{title}</span>
        <ChevronDown
          className={`size-4 text-bone-3 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div className="filtro-cuerpo">
        <div>
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Filtros del catálogo. El de NOTAS es el que distingue una perfumería de una
 * tienda genérica: mucha gente busca "quiero algo con vainilla", no una marca.
 */
export function FilterPanel({ state, onToggle, onSet, bounds }: FilterPanelProps) {
  const [showAllNotes, setShowAllNotes] = useState(false)
  const familyCounts = countByFamily()
  const notes = allNotes()
  const visibleNotes = showAllNotes ? notes : notes.slice(0, 14)

  const chip = (
    key: keyof FilterState,
    value: string,
    label: string,
    suffix?: React.ReactNode
  ) => {
    const active = (state[key] as string[]).includes(value)
    return (
      <button
        key={value}
        type="button"
        onClick={() => onToggle(key, value)}
        aria-pressed={active}
        className="chip"
      >
        {label}
        {suffix}
      </button>
    )
  }

  const recorrido =
    bounds.max > bounds.min
      ? (((state.maxPrice ?? bounds.max) - bounds.min) / (bounds.max - bounds.min)) * 100
      : 100

  return (
    <div className="filtro-panel">
      <Section title="Familia olfativa">
        <div className="flex flex-wrap gap-2">
          {FAMILIES.map((family) =>
            chip(
              'familias',
              family.key,
              family.name,
              <span className="tnum opacity-60">{familyCounts[family.key] ?? 0}</span>
            )
          )}
        </div>
      </Section>

      <Section title="Para">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GENDER_LABEL) as Gender[]).map((gender) =>
            chip('generos', gender, GENDER_LABEL[gender])
          )}
        </div>
      </Section>

      <Section title="Nota olfativa">
        <div className="flex flex-wrap gap-2">
          {visibleNotes.map(({ note }) => chip('notas', note, note))}
        </div>
        {notes.length > 14 && (
          <button
            type="button"
            onClick={() => setShowAllNotes((v) => !v)}
            className="link-editorial mt-4 text-[13px] text-bone-2"
          >
            {showAllNotes ? 'Ver menos notas' : `Ver las ${notes.length} notas`}
          </button>
        )}
      </Section>

      <Section title="Ocasión" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(OCCASION_LABEL) as Occasion[]).map((occasion) =>
            chip('ocasiones', occasion, OCCASION_LABEL[occasion])
          )}
        </div>
      </Section>

      <Section title="Estación" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(SEASON_LABEL) as Season[]).map((season) =>
            chip('estaciones', season, SEASON_LABEL[season])
          )}
        </div>
      </Section>

      <Section title="Precio">
        <label htmlFor="precio-max" className="flex items-baseline justify-between gap-3">
          <span className="text-[14px] text-bone-3">Hasta</span>
          <span className="tnum text-[15px] text-bone">
            {formatCurrency(state.maxPrice ?? bounds.max)}
          </span>
        </label>
        <input
          id="precio-max"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={1000}
          value={state.maxPrice ?? bounds.max}
          onChange={(e) => onSet('maxPrice', Number(e.target.value))}
          className="rango-precio mt-3"
          style={{ '--recorrido': `${recorrido}%` } as React.CSSProperties}
        />
        <div className="mt-2 flex justify-between text-[13px] text-bone-3">
          <span className="tnum">{formatCurrency(bounds.min)}</span>
          <span className="tnum">{formatCurrency(bounds.max)}</span>
        </div>
      </Section>

      <Section title="Disponibilidad">
        <div className="space-y-1">
          <label className="casilla text-[14px]">
            <input
              type="checkbox"
              checked={state.soloStock}
              onChange={(e) => onSet('soloStock', e.target.checked)}
            />
            Solo con stock
          </label>
          <label className="casilla text-[14px]">
            <input
              type="checkbox"
              checked={state.soloOferta}
              onChange={(e) => onSet('soloOferta', e.target.checked)}
            />
            Solo con descuento
          </label>
        </div>
      </Section>
    </div>
  )
}
