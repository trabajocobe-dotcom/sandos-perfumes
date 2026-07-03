'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-gold/20 border border-gold/30 text-gold backdrop-blur-md hover:bg-gold/30 transition-all animate-fade-in-up cursor-pointer"
      aria-label="Volver arriba"
    >
      <ChevronUp className="size-5" />
    </button>
  )
}
