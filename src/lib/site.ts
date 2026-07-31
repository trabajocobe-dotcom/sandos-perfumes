/**
 * Configuración del negocio en un solo lugar.
 * Nada de teléfonos, umbrales ni URLs sueltos por los componentes.
 */

export const SITE = {
  name: 'Sandós Perfumes',
  shortName: 'Sandós',
  tagline: 'Fragancias que dejan huella',
  description:
    'Perfumería importada seleccionada nota por nota. Muestras de 2 ml para probar antes de comprar, envío gratis desde $350.000 y garantía de autenticidad.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://sandos-perfumes.vercel.app',
  locale: 'es_CO',
  currency: 'COP',

  contact: {
    /** Formato internacional sin signos, para wa.me */
    whatsapp: '573102345678',
    whatsappDisplay: '+57 310 234 5678',
    email: 'hola@sandosperfumes.com',
    address: 'Cra. 11 #93-45, Bogotá, Colombia',
    hours: 'Lunes a viernes 10-19 h · Sábados 10-14 h',
  },

  social: {
    instagram: 'https://instagram.com/sandosperfumes',
    facebook: 'https://facebook.com/sandosperfumes',
    tiktok: 'https://tiktok.com/@sandosperfumes',
  },

  commerce: {
    /** Envío gratis a partir de este subtotal. Alimenta la barra de progreso. */
    freeShippingThreshold: 350000,
    shippingCostBogota: 12000,
    shippingCostNacional: 18000,
    /** Días hábiles estimados de entrega. */
    deliveryDays: '2 a 5 días hábiles',
    returnDays: 30,
    /** Cuántas unidades hacen que la ficha muestre urgencia honesta. */
    lowStockThreshold: 5,
  },
} as const

export type SiteConfig = typeof SITE
