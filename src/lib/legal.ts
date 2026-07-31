/**
 * Contenido de las páginas legales y de ayuda.
 *
 * Antes “Términos” y “Privacidad” eran `<span>` sin enlace: la información que
 * más consulta alguien antes de dejar sus datos no existía en el sitio.
 */

import { SITE } from './site'
import { formatCurrency } from './utils'

export interface LegalBlock {
  heading: string
  paragraphs: string[]
  list?: string[]
}

export interface LegalPage {
  slug: string
  title: string
  overline: string
  intro: string
  updated: string
  blocks: LegalBlock[]
}

const UPDATED = '1 de julio de 2026'

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: 'envios',
    title: 'Envíos y entregas',
    overline: 'Ayuda',
    intro:
      'Despachamos de lunes a viernes. Los pedidos confirmados antes de las 14 h salen el mismo día.',
    updated: UPDATED,
    blocks: [
      {
        heading: 'Costos y plazos',
        paragraphs: [
          `El envío es gratis a partir de ${formatCurrency(SITE.commerce.freeShippingThreshold)} de compra, en cualquier modalidad.`,
        ],
        list: [
          `Bogotá, a domicilio: ${formatCurrency(SITE.commerce.shippingCostBogota)} · 2 a 3 días hábiles.`,
          `Interior del país, a sucursal: ${formatCurrency(SITE.commerce.shippingCostNacional)} · 3 a 5 días hábiles.`,
          `Retiro en ${SITE.contact.address}: sin cargo, con turno coordinado por WhatsApp.`,
        ],
      },
      {
        heading: 'Seguimiento',
        paragraphs: [
          'Cuando el paquete sale te enviamos el código de seguimiento por WhatsApp y por email. Si a las 48 h de recibirlo el estado no cambió, escríbenos y lo reclamamos nosotros.',
        ],
      },
      {
        heading: 'Embalaje',
        paragraphs: [
          'Cada frasco viaja en su estuche original, envuelto en material amortiguante y dentro de una caja rígida. Si el paquete llega dañado, sacale una foto antes de abrirlo: con eso resolvemos el reclamo sin discusión.',
        ],
      },
    ],
  },
  {
    slug: 'devoluciones',
    title: 'Cambios y devoluciones',
    overline: 'Ayuda',
    intro: `Tienes ${SITE.commerce.returnDays} días corridos desde que recibes el pedido para pedir un cambio o la devolución.`,
    updated: UPDATED,
    blocks: [
      {
        heading: 'Qué se puede devolver',
        paragraphs: [
          'Frascos cerrados, con el celofán original intacto y su estuche sin daños. Por tratarse de un producto de higiene y cosmética, un frasco abierto no puede reingresar al stock.',
        ],
        list: [
          'Frasco sin abrir: cambio por otro producto o reintegro del importe.',
          'Frasco abierto: no se acepta devolución, salvo defecto de fábrica.',
          'Muestras de 2 ml: no tienen devolución, justamente porque están hechas para abrirse.',
          'Producto equivocado o dañado por nosotros: lo retiramos y reponemos sin costo.',
        ],
      },
      {
        heading: 'Cómo iniciarlo',
        paragraphs: [
          `Escríbenos a ${SITE.contact.email} o al WhatsApp ${SITE.contact.whatsappDisplay} con el número de pedido. Coordinamos el retiro y, una vez que verificamos el estado del producto, el reintegro se acredita en un plazo de 5 a 10 días hábiles por el mismo medio de pago.`,
        ],
      },
      {
        heading: 'Derecho de arrepentimiento',
        paragraphs: [
          'Conforme al artículo 34 de la Ley 24.240 de Defensa del Consumidor, puedes arrepentirte de la compra dentro de los 10 días corridos de recibido el producto, devolviéndolo en las condiciones indicadas. El costo de la devolución en ese caso corre por nuestra cuenta.',
        ],
      },
    ],
  },
  {
    slug: 'autenticidad',
    title: 'Garantía de autenticidad',
    overline: 'Ayuda',
    intro:
      'Todo lo que vendemos es original. No trabajamos con réplicas, inspirados, decants de terceros ni productos sin trazabilidad.',
    updated: UPDATED,
    blocks: [
      {
        heading: 'De dónde viene el stock',
        paragraphs: [
          'Compramos a distribuidores oficiales y a importadores registrados en Colombia. Cada lote ingresa con su factura y su número de serie, y podemos mostrártelos si los pides.',
        ],
      },
      {
        heading: 'Cómo verificarlo ti',
        paragraphs: ['Al recibir el frasco puedes controlar estos puntos:'],
        list: [
          'El código de lote impreso en la caja coincide con el del frasco.',
          'El celofán es ajustado y prolijo, con dobleces limpios en los extremos.',
          'La tipografía y el troquelado de la caja no presentan bordes borrosos.',
          'El atomizador rocía parejo, sin gotear.',
        ],
      },
      {
        heading: 'Si algo no cierra',
        paragraphs: [
          'Si tienes cualquier duda sobre la autenticidad de un producto que te vendimos, lo retiramos y te devolvemos el 100% del importe, sin que tengas que demostrar nada.',
        ],
      },
    ],
  },
  {
    slug: 'terminos',
    title: 'Términos y condiciones',
    overline: 'Legal',
    intro: `Estos términos regulan el uso de ${SITE.url} y las compras realizadas a través del sitio.`,
    updated: UPDATED,
    blocks: [
      {
        heading: 'Precios y disponibilidad',
        paragraphs: [
          'Los precios se expresan en pesos colombianos e incluyen IVA. Pueden modificarse sin aviso previo, pero el precio que rige para tu compra es el vigente al momento en que confirmas el pedido.',
          'El stock mostrado en cada ficha se actualiza con cada venta. Si aun así un producto no estuviera disponible, te lo informamos dentro de las 24 h y puedes elegir entre esperar la reposición, cambiarlo o recibir el reintegro completo.',
        ],
      },
      {
        heading: 'Proceso de compra',
        paragraphs: [
          'El pedido se registra al confirmarlo en el checkout y se completa cuando acreditamos el pago. Hasta ese momento no hay reserva de stock. La comunicación de coordinación se realiza por WhatsApp al número que nos dejes.',
        ],
      },
      {
        heading: 'Uso del sitio',
        paragraphs: [
          'El contenido, las fotografías y los textos descriptivos son de Sandós Perfumes o de sus respectivos titulares. Las marcas de fragancias mencionadas pertenecen a sus casas y se usan únicamente para identificar los productos que comercializamos.',
        ],
      },
      {
        heading: 'Contacto y jurisdicción',
        paragraphs: [
          `Ante cualquier reclamo puedes escribirnos a ${SITE.contact.email}. Para toda controversia se aplican las leyes de la República de Colombia y son competentes los jueces de la ciudad de Bogotá.`,
        ],
      },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    overline: 'Legal',
    intro:
      'Pedimos los datos mínimos necesarios para entregarte un pedido. No vendemos ni cedemos información a terceros con fines comerciales.',
    updated: UPDATED,
    blocks: [
      {
        heading: 'Qué datos guardamos',
        paragraphs: ['Solo los que nos das para completar la compra:'],
        list: [
          'Nombre, email y teléfono, para coordinar la entrega.',
          'Dirección y código postal, para el envío.',
          'Historial de pedidos, para poder atender un reclamo posterior.',
        ],
      },
      {
        heading: 'Qué guarda tu navegador',
        paragraphs: [
          'El carrito, los favoritos y las fragancias vistas recientemente se guardan en el almacenamiento local de tu dispositivo, no en nuestros servidores. Si borrás los datos del navegador, esa información desaparece.',
        ],
      },
      {
        heading: 'Tus derechos',
        paragraphs: [
          `Puedes pedirnos acceso, rectificación o supresión de tus datos escribiendo a ${SITE.contact.email}. Conforme a la Ley 25.326 de Protección de Datos Personales, la Agencia de Acceso a la Información Pública es el órgano de control y atiende las denuncias por incumplimiento.`,
        ],
      },
    ],
  },
]

export const getLegalPage = (slug: string) => LEGAL_PAGES.find((page) => page.slug === slug)
