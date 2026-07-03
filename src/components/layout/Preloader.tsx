'use client'

import { useEffect, useState } from 'react'

export function Preloader() {
  const [show, setShow] = useState(true)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true)
      setTimeout(() => setShow(false), 600)
    }, 2200)
    return () => clearTimeout(timer)
  }, [])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal transition-opacity duration-600 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-gold/20" style={{ animationDuration: '2s' }} />

        <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30">
          <svg className="size-10 text-gold" viewBox="0 0 48 48" fill="none">
            <path
              d="M24 4C20 4 16 8 16 12v6h-2a4 4 0 0 0-4 4v18a4 4 0 0 0 4 4h20a4 4 0 0 0 4-4V22a4 4 0 0 0-4-4h-2v-6c0-4-4-8-8-8zm-4 12v-4a4 4 0 1 1 8 0v4h-8z"
              fill="currentColor"
              opacity="0.8"
            />
            <path d="M20 28a4 4 0 1 1 8 0v4a4 4 0 1 1-8 0v-4z" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h1
          className="font-serif text-4xl tracking-[0.15em] text-cream opacity-0 animate-fade-in"
          style={{ animation: 'fadeIn 0.8s ease 0.4s forwards' }}
        >
          SANDÓS
        </h1>
        <div
          className="mx-auto mt-2 h-px w-0 bg-gold/60 opacity-0"
          style={{ animation: 'expandLine 0.8s ease 1s forwards' }}
        />
        <p
          className="mt-3 text-xs tracking-[0.3em] uppercase text-cream/50 opacity-0"
          style={{ animation: 'fadeIn 0.6s ease 1.4s forwards' }}
        >
          Perfumes
        </p>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            to { opacity: 1; }
          }
          @keyframes expandLine {
            to { width: 60px; opacity: 1; }
          }
        `
      }} />
    </div>
  )
}
