/**
 * Test de firma olfativa.
 *
 * Es la herramienta que más mueve la aguja en una perfumería online: quien no
 * sabe qué comprar se va, y un cuestionario corto convierte esa duda en tres
 * recomendaciones concretas. Las preguntas apuntan a hábitos y contextos —no a
 * jerga de perfumería— porque quien necesita el test no conoce las familias.
 */

import { familyByKey, products } from './demo-data'
import { sortProducts } from './catalog'
import type { FragranceFamily, Gender, Occasion, Product, QuizQuestion, Season } from '@/types'

export const QUIZ: QuizQuestion[] = [
  {
    id: 'momento',
    overline: 'Pregunta 1 de 5',
    question: '¿Cuándo lo vas a usar más?',
    options: [
      { value: 'dia', label: 'De día, todos los días', hint: 'Trabajo, trámites, rutina', families: ['citrica', 'acuatica', 'aromatica'] },
      { value: 'oficina', label: 'En la oficina', hint: 'Cerca de otras personas', families: ['amaderada', 'chipre', 'floral'] },
      { value: 'noche', label: 'De noche', hint: 'Salidas, cenas, eventos', families: ['oriental', 'gourmand', 'amaderada'] },
      { value: 'especial', label: 'Solo en ocasiones especiales', hint: 'Quiero algo que se note', families: ['oriental', 'gourmand', 'chipre'] },
    ],
  },
  {
    id: 'clima',
    overline: 'Pregunta 2 de 5',
    question: '¿En qué clima vives la mayor parte del año?',
    options: [
      { value: 'calor', label: 'Hace calor casi siempre', hint: 'Los perfumes densos me marean', families: ['citrica', 'acuatica'] },
      { value: 'templado', label: 'Templado, con estaciones marcadas', hint: 'Cambio según la época', families: ['floral', 'aromatica', 'chipre'] },
      { value: 'frio', label: 'Predomina el frío', hint: 'Busco algo que abrigue', families: ['oriental', 'gourmand', 'amaderada'] },
    ],
  },
  {
    id: 'caracter',
    overline: 'Pregunta 3 de 5',
    question: 'Elige la frase que más se parece a ti',
    options: [
      { value: 'limpio', label: '“Que huela a limpio”', hint: 'Jabón, ropa recién lavada, frescura', families: ['citrica', 'acuatica', 'aromatica'] },
      { value: 'calido', label: '“Que huela a abrazo”', hint: 'Vainilla, madera, algo dulce', families: ['gourmand', 'amaderada'] },
      { value: 'elegante', label: '“Que huela a caro”', hint: 'Sobrio, seco, sin dulzor', families: ['chipre', 'amaderada'] },
      { value: 'magnetico', label: '“Que no pase desapercibido”', hint: 'Especias, ámbar, intensidad', families: ['oriental', 'gourmand'] },
    ],
  },
  {
    id: 'presencia',
    overline: 'Pregunta 4 de 5',
    question: '¿Cuánto quieres que se sienta?',
    options: [
      { value: 'discreto', label: 'Solo a un abrazo de distancia', hint: 'Íntimo, para mí y para quien se acerque', families: ['citrica', 'floral', 'acuatica'] },
      { value: 'medio', label: 'Que se note sin invadir', hint: 'El punto medio', families: ['amaderada', 'aromatica', 'chipre'] },
      { value: 'fuerte', label: 'Que entre antes que yo', hint: 'Estela larga y evidente', families: ['oriental', 'gourmand'] },
    ],
  },
  {
    id: 'presupuesto',
    overline: 'Pregunta 5 de 5',
    question: '¿Cuánto pensás invertir?',
    options: [
      { value: 'bajo', label: 'Hasta $75.000', hint: 'Busco relación precio-calidad', families: [] },
      { value: 'medio', label: 'Entre $75.000 y $110.000', hint: 'El rango habitual de un buen frasco', families: [] },
      { value: 'alto', label: 'Más de $110.000', hint: 'Quiero algo que no se cruce seguido', families: [] },
    ],
  },
]

export const GENDER_QUESTION: { value: Gender; label: string }[] = [
  { value: 'femenino', label: 'Femeninas' },
  { value: 'masculino', label: 'Masculinas' },
  { value: 'unisex', label: 'Me da igual' },
]

const BUDGET_RANGE: Record<string, [number, number]> = {
  bajo: [0, 75000],
  medio: [75000, 110000],
  alto: [110000, Number.POSITIVE_INFINITY],
}

const OCCASION_BY_MOMENT: Record<string, Occasion> = {
  dia: 'diario',
  oficina: 'oficina',
  noche: 'noche',
  especial: 'evento',
}

const SEASONS_BY_CLIMATE: Record<string, Season[]> = {
  calor: ['primavera', 'verano'],
  templado: ['primavera', 'otono'],
  frio: ['otono', 'invierno'],
}

const SILLAGE_TARGET: Record<string, number> = { discreto: 2, medio: 3.5, fuerte: 5 }

/** Cómo se lee cada ocasión dentro de una frase corrida. */
const OCCASION_PHRASE: Record<Occasion, string> = {
  diario: 'el día a día',
  oficina: 'la oficina',
  noche: 'la noche',
  cita: 'una cita',
  evento: 'eventos',
  deporte: 'entrenar',
}

export interface QuizAnswers {
  momento?: string
  clima?: string
  caracter?: string
  presencia?: string
  presupuesto?: string
  genero?: Gender
}

export interface QuizResult {
  product: Product
  score: number
  /** Por qué le tocó esta fragancia. Sin esto el resultado no genera confianza. */
  reasons: string[]
}

/**
 * Puntúa cada fragancia contra el perfil. Es un scoring transparente y
 * explicable a propósito: cada punto sumado se traduce en una frase que el
 * comprador puede leer y verificar.
 */
export function scoreQuiz(answers: QuizAnswers): QuizResult[] {
  const wanted = new Set<FragranceFamily>()

  for (const question of QUIZ) {
    const answer = answers[question.id as keyof QuizAnswers]
    const option = question.options.find((o) => o.value === answer)
    option?.families.forEach((family) => wanted.add(family))
  }

  const [minPrice, maxPrice] = BUDGET_RANGE[answers.presupuesto ?? ''] ?? [
    0,
    Number.POSITIVE_INFINITY,
  ]
  const occasion = OCCASION_BY_MOMENT[answers.momento ?? '']
  const seasons = SEASONS_BY_CLIMATE[answers.clima ?? ''] ?? []
  const sillageTarget = SILLAGE_TARGET[answers.presencia ?? '']

  const scored = products
    .filter((product) => product.stock > 0)
    .map((product) => {
      let score = 0
      const reasons: string[] = []

      if (wanted.has(product.family)) {
        score += 4
        const adjective = familyByKey(product.family)?.adjective ?? product.family
        reasons.push(`Es una fragancia ${adjective}, la familia que más encaja con tus respuestas`)
      }

      if (occasion && product.occasions.includes(occasion)) {
        score += 3
        reasons.push(`Funciona bien para ${OCCASION_PHRASE[occasion]}`)
      }

      if (seasons.some((season) => product.seasons.includes(season))) {
        score += 2
        reasons.push('Rinde bien en tu clima')
      }

      if (sillageTarget != null) {
        const distance = Math.abs(product.sillage - sillageTarget)
        score += Math.max(0, 3 - distance)
        if (distance <= 1) reasons.push(`Su estela es ${product.sillage >= 4 ? 'notoria' : 'contenida'}, como pediste`)
      }

      if (product.price >= minPrice && product.price <= maxPrice) {
        score += 3
        reasons.push('Entra en tu presupuesto')
      } else {
        score -= 4
      }

      if (answers.genero && answers.genero !== 'unisex') {
        if (product.gender === answers.genero) score += 2
        else if (product.gender !== 'unisex') score -= 3
      }

      // Un pequeño empujón por reputación desempata entre candidatas parejas.
      score += (product.rating - 4) * 2

      return { product, score, reasons: reasons.slice(0, 3) }
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)

  // Si el filtro fue demasiado estricto, devolvemos lo mejor puntuado igual.
  if (scored.length === 0) {
    return sortProducts(products, 'rating')
      .slice(0, 3)
      .map((product) => ({
        product,
        score: 0,
        reasons: ['Una de nuestras fragancias mejor puntuadas'],
      }))
  }

  return scored.slice(0, 3)
}
