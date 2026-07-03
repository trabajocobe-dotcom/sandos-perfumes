'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { WhatsAppMessage } from '@/types'

const AUTO_REPLIES: Record<string, string> = {
  hola: '¡Hola! 👋 Bienvenido a Sandós Perfumes. ¿En qué puedo ayudarte? Podés consultarme sobre precios, disponibilidad, o pedir recomendaciones.',
  precio: 'Nuestros precios van desde $62.000 a $112.000 dependiendo la fragancia. ¿Tenés alguna en mente?',
  catalogo: 'Podés ver nuestro catálogo completo en https://sandosperfumes.netlify.app/catalogo o decime qué tipo de fragancia buscás y te recomiendo.',
  envio: 'Hacemos envíos a todo CABA y GBA. El costo depende de la zona. Consultanos tu código postal y te confirmamos.',
  pago: 'Aceptamos efectivo, transferencia bancaria y Mercado Pago. 🏦💳',
  horario: 'Atendemos de lunes a viernes de 10 a 19hs y sábados de 10 a 14hs.',
  gracias: '¡Gracias a vos! Cualquier otra consulta, acá estamos. Que tengas un lindo día 🌸',
}

function getAutoReply(message: string): string | null {
  const lower = message.toLowerCase()
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (lower.includes(key)) return reply
  }
  return null
}

export function ChatButton() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de Sandós Perfumes. Consultame precios, catálogo, envíos o formas de pago.',
      timestamp: new Date().toISOString(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg: WhatsAppMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Intenta responder automáticamente
    const autoReply = getAutoReply(userMsg.content)

    await new Promise((r) => setTimeout(r, 600))

    if (autoReply) {
      const botMsg: WhatsAppMessage = {
        role: 'assistant',
        content: autoReply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMsg])
    } else {
      const botMsg: WhatsAppMessage = {
        role: 'assistant',
        content:
          'No tengo una respuesta automática para eso. ¿Querés que te conecte con un asesor por WhatsApp? Hacé clic en el botón "Hablar con asesor".',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMsg])
    }
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-gold text-charcoal shadow-lg transition-all duration-300 hover:bg-gold-dark hover:scale-105 cursor-pointer"
          aria-label="Abrir chat"
        >
          <MessageCircle className="size-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-80 sm:w-96">
          <div className="flex flex-col rounded-xl bg-white shadow-xl border border-charcoal/10 overflow-hidden">
            <div className="flex items-center justify-between bg-charcoal px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-gold" />
                <div>
                  <p className="text-sm font-medium text-cream">Asistente Sandós</p>
                  <p className="text-[10px] text-cream/60">Respondemos al instante</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-cream/60 hover:text-cream transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex h-80 flex-col gap-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-charcoal text-cream rounded-br-sm'
                        : 'bg-ivory text-charcoal rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl rounded-bl-sm bg-ivory px-3 py-2 text-sm text-warm-gray">
                    Escribiendo…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-charcoal/10 p-3">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribí tu consulta…"
                  className="text-sm"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="shrink-0"
                >
                  <Send className="size-4" />
                </Button>
              </div>
              <a
                href="https://wa.me/541123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-center text-[10px] text-warm-gray-light hover:text-warm-gray transition-colors"
              >
                ¿Consulta más compleja? Hablar con un asesor →
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
