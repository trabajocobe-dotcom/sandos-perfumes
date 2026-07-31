'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  Banknote,
  Building2,
  CreditCard,
  Home,
  MessageCircle,
  Package,
  Store,
} from 'lucide-react'
import { Input, Textarea } from '@/components/ui/Input'
import { ProductImage } from '@/components/ui/ProductImage'
import { unitPrice, useCart } from '@/hooks/useCart'
import { createOrder } from '@/lib/local-orders'
import { SITE } from '@/lib/site'
import { cn, formatCurrency } from '@/lib/utils'
import { whatsappOrder } from '@/lib/whatsapp'
import type { PaymentMethod, ShippingMethod } from '@/types'

const SHIPPING_OPTIONS: {
  value: ShippingMethod
  label: string
  detail: string
  cost: number
  icon: typeof Home
}[] = [
  {
    value: 'domicilio',
    label: 'A domicilio · Bogotá',
    detail: '2 a 3 días hábiles',
    cost: SITE.commerce.shippingCostBogota,
    icon: Home,
  },
  {
    value: 'sucursal',
    label: 'A sucursal · Interior',
    detail: '3 a 5 días hábiles',
    cost: SITE.commerce.shippingCostNacional,
    icon: Package,
  },
  {
    value: 'retiro',
    label: 'Retiro en el local',
    detail: SITE.contact.address,
    cost: 0,
    icon: Store,
  },
]

const PAYMENT_OPTIONS: {
  value: PaymentMethod
  label: string
  detail: string
  icon: typeof CreditCard
}[] = [
  {
    value: 'mercadopago',
    label: 'Mercado Pago',
    detail: 'Tarjeta, débito o dinero en cuenta',
    icon: CreditCard,
  },
  { value: 'transferencia', label: 'Transferencia', detail: '10% de descuento', icon: Building2 },
  { value: 'efectivo', label: 'Efectivo', detail: 'Al retirar o contra entrega', icon: Banknote },
]

const TRANSFER_DISCOUNT = 0.1

interface FormState {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  notes: string
  shipping: ShippingMethod | ''
  payment: PaymentMethod | ''
}

type FormErrors = Partial<Record<keyof FormState, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^[\d\s+()-]{8,}$/

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    notes: '',
    shipping: '',
    payment: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const needsAddress = form.shipping !== '' && form.shipping !== 'retiro'

  const shippingCost = useMemo(() => {
    if (!form.shipping) return 0
    if (subtotal >= SITE.commerce.freeShippingThreshold) return 0
    return SHIPPING_OPTIONS.find((option) => option.value === form.shipping)?.cost ?? 0
  }, [form.shipping, subtotal])

  const discount = form.payment === 'transferencia' ? Math.round(subtotal * TRANSFER_DISCOUNT) : 0
  const total = subtotal + shippingCost - discount

  const update = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))
  }

  const validate = (): boolean => {
    const next: FormErrors = {}

    if (!form.name.trim()) next.name = 'Necesitamos tu nombre para el envío'
    if (!form.email.trim()) next.email = 'Te enviamos el comprobante aquí'
    else if (!EMAIL_RE.test(form.email)) next.email = 'Revisa el email, parece incompleto'
    if (!form.phone.trim()) next.phone = 'Lo usamos para coordinar la entrega'
    else if (!PHONE_RE.test(form.phone)) next.phone = 'Ingresa un teléfono válido'
    if (!form.shipping) next.shipping = 'Elige cómo quieres recibirlo'
    if (needsAddress) {
      if (!form.address.trim()) next.address = 'Calle, número y piso/depto'
      if (!form.city.trim()) next.city = 'Indica la localidad'
      if (!form.zip.trim()) next.zip = 'Necesitamos el código postal'
    }
    if (!form.payment) next.payment = 'Elige cómo vas a pagar'

    setErrors(next)

    if (Object.keys(next).length > 0) {
      // Llevar al primer campo con error evita el clásico "no pasa nada al enviar".
      document
        .querySelector('[aria-invalid="true"], [data-error="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting || !validate()) return

    setSubmitting(true)

    try {
      const order = createOrder({
        items: items.map((item) => ({
          id: item.id,
          order_id: '',
          product_id: item.product.id,
          product_name: `${item.product.house} ${item.product.name}`,
          quantity: item.quantity,
          price: unitPrice(item),
          is_sample: item.is_sample,
        })),
        subtotal,
        shipping_cost: shippingCost,
        discount,
        payment_method: form.payment as PaymentMethod,
        shipping_method: form.shipping as ShippingMethod,
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        shipping_address: form.address.trim(),
        shipping_city: form.city.trim(),
        shipping_zip: form.zip.trim(),
        notes: form.notes.trim(),
      })

      // El pedido va armado para WhatsApp: el vendedor no transcribe nada a mano.
      const waLink = whatsappOrder({
        items,
        subtotal,
        shipping: shippingCost,
        total,
        orderId: order.id,
        customer: {
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          zip: form.zip.trim(),
          payment: PAYMENT_OPTIONS.find((option) => option.value === form.payment)?.label,
          notes: form.notes.trim(),
        },
      })

      clearCart()
      router.push(`/checkout/confirmacion?pedido=${order.id}&wa=${encodeURIComponent(waLink)}`)
    } catch (error) {
      console.error('No se pudo crear el pedido', error)
      setSubmitting(false)
      setErrors({ payment: 'No pudimos registrar el pedido. Prueba de nuevo en un momento.' })
    }
  }

  if (items.length === 0) {
    return (
      <section className="shell py-24 text-center lg:py-32">
        <h1 className="text-h2">No hay nada para pagar</h1>
        <p className="mt-4 text-[16px] text-bone-3">
          Tu carrito está vacío. Elige una fragancia y vuelve.
        </p>
        <Link href="/catalogo" className="btn btn-primary mt-8">
          Ir al catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className="shell py-16 lg:py-24">
      <Link
        href="/carrito"
        className="link-editorial inline-flex items-center gap-2 text-[14px] text-bone-3"
      >
        <ArrowLeft className="size-3.5" />
        Volver al carrito
      </Link>

      <h1 className="mt-8 text-h1">
        Finalizar <span className="accent-word">compra</span>
      </h1>
      <p className="mt-3 max-w-[34rem] text-[16px] leading-relaxed text-bone-3">
        Un solo paso. Al confirmar te abrimos WhatsApp con el pedido ya escrito para coordinar el
        pago y la entrega.
      </p>

      <form
        onSubmit={submit}
        noValidate
        className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16"
      >
        <div className="space-y-12">
          <fieldset>
            <legend className="font-display text-h3">1. Tus datos</legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input
                label="Nombre y apellido"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Juana Pérez"
                error={errors.name}
                autoComplete="name"
                required
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="juana@correo.com"
                error={errors.email}
                autoComplete="email"
                required
              />
              <Input
                label="Teléfono"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+57 310 234 5678"
                error={errors.phone}
                autoComplete="tel"
                hint="Te escribimos por aquí para coordinar"
                required
              />
            </div>
          </fieldset>

          <fieldset data-error={errors.shipping ? 'true' : undefined}>
            <legend className="font-display text-h3">2. Cómo lo recibes</legend>

            <div className="mt-6 grid gap-3">
              {SHIPPING_OPTIONS.map((option) => {
                const free = subtotal >= SITE.commerce.freeShippingThreshold && option.cost > 0
                return (
                  <ChoiceCard
                    key={option.value}
                    selected={form.shipping === option.value}
                    onSelect={() => update('shipping', option.value)}
                    icon={option.icon}
                    title={option.label}
                    detail={option.detail}
                    price={option.cost === 0 || free ? 'Gratis' : formatCurrency(option.cost)}
                    strikethrough={free ? formatCurrency(option.cost) : undefined}
                  />
                )
              })}
            </div>

            {errors.shipping && (
              <p role="alert" className="mt-3 text-[13px] text-rust">
                {errors.shipping}
              </p>
            )}

            {needsAddress && (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Input
                    label="Dirección"
                    value={form.address}
                    onChange={(e) => update('address', e.target.value)}
                    placeholder="Av. Corrientes 1234, 5º B"
                    error={errors.address}
                    autoComplete="street-address"
                  />
                </div>
                <Input
                  label="Localidad"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Villa Crespo"
                  error={errors.city}
                  autoComplete="address-level2"
                />
                <Input
                  label="Código postal"
                  value={form.zip}
                  onChange={(e) => update('zip', e.target.value)}
                  placeholder="C1414"
                  error={errors.zip}
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
              </div>
            )}
          </fieldset>

          <fieldset data-error={errors.payment ? 'true' : undefined}>
            <legend className="font-display text-h3">3. Cómo pagas</legend>

            <div className="mt-6 grid gap-3">
              {PAYMENT_OPTIONS.map((option) => (
                <ChoiceCard
                  key={option.value}
                  selected={form.payment === option.value}
                  onSelect={() => update('payment', option.value)}
                  icon={option.icon}
                  title={option.label}
                  detail={option.detail}
                />
              ))}
            </div>

            {errors.payment && (
              <p role="alert" className="mt-3 text-[13px] text-rust">
                {errors.payment}
              </p>
            )}

            <div className="mt-6">
              <Textarea
                label="Notas del pedido (opcional)"
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                placeholder="Ej.: es un regalo, ¿pueden incluir tarjeta?"
              />
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="border border-ink-line p-6">
            <h2 className="overline">Tu pedido</h2>

            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <span className="relative size-12 shrink-0 overflow-hidden bg-ink-raised">
                    <ProductImage src={item.product.image_url} alt="" sizes="48px" static />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] text-bone">
                      {item.product.name}
                    </span>
                    <span className="tnum block text-[13px] text-bone-3">
                      {item.is_sample ? 'Muestra 2 ml' : item.product.volume} × {item.quantity}
                    </span>
                  </span>
                  <span className="tnum shrink-0 text-[14px]">
                    {formatCurrency(unitPrice(item) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-2.5 border-t border-ink-line pt-5 text-[15px]">
              <Row label="Subtotal" value={formatCurrency(subtotal)} />
              <Row
                label="Envío"
                value={
                  !form.shipping
                    ? 'A definir'
                    : shippingCost === 0
                      ? 'Gratis'
                      : formatCurrency(shippingCost)
                }
              />
              {discount > 0 && (
                <Row
                  label="Descuento por transferencia"
                  value={`− ${formatCurrency(discount)}`}
                  accent
                />
              )}
            </dl>

            <div className="mt-5 flex items-baseline justify-between border-t border-ink-line pt-5">
              <span className="text-[16px] text-bone-2">Total</span>
              <span className="tnum font-display text-[1.625rem] text-gilt">
                {formatCurrency(total)}
              </span>
            </div>

            <button type="submit" disabled={submitting} className="btn btn-primary mt-6 w-full">
              <MessageCircle className="size-4" strokeWidth={2} />
              {submitting ? 'Registrando…' : 'Confirmar pedido'}
            </button>

            <p className="mt-4 text-[13px] leading-relaxed text-bone-3">
              Al confirmar aceptas los{' '}
              <Link href="/legal/terminos" className="text-bone-2 underline underline-offset-2">
                términos y condiciones
              </Link>
              . No se cobra nada en este paso.
            </p>
          </div>
        </aside>
      </form>
    </section>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-bone-3">{label}</dt>
      <dd className={cn('tnum', accent ? 'text-gilt' : 'text-bone')}>{value}</dd>
    </div>
  )
}

function ChoiceCard({
  selected,
  onSelect,
  icon: Icon,
  title,
  detail,
  price,
  strikethrough,
}: {
  selected: boolean
  onSelect: () => void
  icon: typeof Home
  title: string
  detail: string
  price?: string
  strikethrough?: string
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex items-center gap-4 rounded-brand border px-5 py-4 text-left transition-colors',
        selected ? 'border-gilt bg-gilt/[0.06]' : 'border-ink-line hover:border-bone-3'
      )}
    >
      <Icon
        className={cn('size-5 shrink-0', selected ? 'text-gilt' : 'text-bone-3')}
        strokeWidth={1.5}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-[16px] text-bone">{title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-bone-3">{detail}</span>
      </span>
      {price && (
        <span className="shrink-0 text-right">
          {strikethrough && (
            <span className="tnum block text-[13px] text-bone-3 line-through">
              {strikethrough}
            </span>
          )}
          <span className={cn('tnum text-[14px]', selected ? 'text-gilt' : 'text-bone-2')}>
            {price}
          </span>
        </span>
      )}
    </button>
  )
}
