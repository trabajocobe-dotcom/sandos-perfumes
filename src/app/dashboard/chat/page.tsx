'use client'

import { useState } from 'react'
import { MessageCircle, Send, Bot, Edit3, Save, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { WhatsAppMessage } from '@/types'

const defaultReplies: Record<string, string> = {
  hola: '¡Hola! 👋 Bienvenido a Sandós Perfumes. ¿En qué puedo ayudarte? Puedes consultarme sobre precios, disponibilidad, o pedir recomendaciones.',
  precio: 'Nuestros precios van desde $62.000 a $112.000 dependiendo la fragancia. ¿Tienes alguna en mente?',
  catalogo: '¡Claro! Te comparto nuestro catálogo actualizado con precios y disponibilidad. Hace clic en "Ver catálogo" para descargarlo.',
  envio: 'Hacemos envíos a todo el país. El costo depende de la ciudad. Consúltanos tu código postal y te confirmamos.',
  pago: 'Aceptamos efectivo, transferencia bancaria y Mercado Pago. 🏦💳',
  horario: 'Atendemos de lunes a viernes de 10 a 19hs y sábados de 10 a 14hs.',
  gracias: '¡Gracias a ti! Cualquier otra consulta, aquí estamos. Que tengas un lindo día 🌸',
}

const sampleChats: { name: string; lastMessage: string; unread: number }[] = [
  { name: 'Cliente示例', lastMessage: 'Hola, quería consultar precios', unread: 2 },
  { name: 'María García', lastMessage: 'Gracias!', unread: 0 },
  { name: 'Carlos López', lastMessage: 'Hacen envíos a zona norte?', unread: 1 },
]

export default function ChatPage() {
  const [replies, setReplies] = useState(defaultReplies)
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [selectedChat, setSelectedChat] = useState(0)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Sandós Perfumes.', timestamp: new Date().toISOString() },
    { role: 'user', content: 'Hola, quería consultar precios', timestamp: new Date().toISOString() },
    { role: 'assistant', content: defaultReplies.precio, timestamp: new Date().toISOString() },
  ])
  const [input, setInput] = useState('')

  const handleEdit = (key: string) => {
    setEditingKey(key)
    setEditValue(replies[key])
  }

  const handleSave = (key: string) => {
    setReplies((prev) => ({ ...prev, [key]: editValue }))
    setEditingKey(null)
  }

  const handleSend = () => {
    if (!input.trim()) return
    setMessages((prev) => [...prev, {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }])
    setInput('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-bone">Chat y Atención al Cliente</h2>
        <p className="text-sm text-bone-2">Configuración del chatbot automático y respuestas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-bone mb-3 flex items-center gap-2">
              <MessageCircle className="size-4" /> Conversaciones recientes
            </h3>
            <div className="space-y-2">
              {sampleChats.map((chat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedChat(i)}
                  /* La selección se marca con un tinte, no con el dorado macizo:
                     sobre ese relleno el texto oscuro de dentro quedaba en
                     2,9:1 y obligaba a reescribir el color de cada hijo. */
                  aria-current={selectedChat === i ? 'true' : undefined}
                  className={`w-full rounded-brand p-2.5 text-left transition-colors cursor-pointer ${
                    selectedChat === i ? 'bg-gilt/12' : 'hover:bg-ink-sunken'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-bone">{chat.name}</p>
                    {chat.unread > 0 && <Badge variant="gilt">{chat.unread}</Badge>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-bone-2">{chat.lastMessage}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-bone-3 mb-2">Estadísticas del chat</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-bone-2">Consultas hoy</span>
                <span className="font-medium text-bone">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-2">Catálogos enviados</span>
                <span className="font-medium text-bone">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-2">Derivados a WhatsApp</span>
                <span className="font-medium text-bone">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-bone-2">Tasa de auto-respuesta</span>
                <span className="font-medium text-emerald-600">78%</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-bone mb-3 flex items-center gap-2">
              <Bot className="size-4" /> Respuestas automáticas
            </h3>
            <p className="text-xs text-bone-2 mb-4">
              Configura las respuestas que el bot envía automáticamente según la palabra clave que detecte.
            </p>
            <div className="space-y-2">
              {Object.entries(replies).map(([key, value]) => (
                <div key={key} className="rounded-lg border border-ink-line p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="gilt">{key}</Badge>
                    {editingKey === key ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleSave(key)}
                          className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          <Save className="size-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingKey(null)}
                          className="p-1 text-bone-3 hover:text-bone-2 cursor-pointer"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(key)}
                        className="p-1 text-bone-3 hover:text-bone cursor-pointer"
                      >
                        <Edit3 className="size-3.5" />
                      </button>
                    )}
                  </div>
                  {editingKey === key ? (
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-xs text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-xs text-bone-2 leading-relaxed">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-semibold text-bone mb-3 flex items-center gap-2">
              <MessageCircle className="size-4" /> Vista previa del chat
            </h3>
            <div className="rounded-xl border border-ink-line bg-ink-raised overflow-hidden">
              <div className="bg-charcoal px-4 py-2.5">
                <p className="text-sm font-medium text-bone">Asistente Sandós</p>
              </div>
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gilt text-gilt-ink rounded-br-sm'
                        : 'bg-ink-sunken text-bone rounded-bl-sm'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-ink-line p-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe un mensaje de prueba…"
                  className="flex-1 rounded-lg border border-ink-line bg-ink-raised px-3 py-2 text-sm text-bone focus:border-gilt focus:ring-1 focus:ring-gilt/20 focus:outline-none"
                />
                <Button variant="primary" size="sm" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
