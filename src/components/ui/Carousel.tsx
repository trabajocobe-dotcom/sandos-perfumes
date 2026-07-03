'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  autoPlayInterval?: number
  className?: string
}

export function Carousel<T>({
  items,
  renderItem,
  autoPlayInterval = 4000,
  className = '',
}: CarouselProps<T>) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = items.length

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }, [total])

  useEffect(() => {
    if (isPaused || total <= 1) return
    const timer = setInterval(next, autoPlayInterval)
    return () => clearInterval(timer)
  }, [next, autoPlayInterval, isPaused, total])

  if (total === 0) return null

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item, i) => (
          <div key={i} className="w-full shrink-0">
            {renderItem(item, i)}
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Anterior"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-white/80 text-charcoal shadow-sm backdrop-blur-sm hover:bg-white transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Siguiente"
          >
            <ChevronRight className="size-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`size-2 rounded-full transition-all cursor-pointer ${
                  i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Ir a slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
