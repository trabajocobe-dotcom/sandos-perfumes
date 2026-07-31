/**
 * Contenido editorial.
 *
 * El blog no está para rellenar: en perfumería resuelve las dudas que frenan la
 * compra (cuánto dura, cómo se aplica, cómo se distingue un original) y captura
 * las búsquedas informativas que después vuelven al catálogo.
 */

export interface BlogSection {
  heading?: string
  paragraphs: string[]
  list?: string[]
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  author: string
  /** ISO. Se formatea con `formatDate`. */
  date: string
  readingMinutes: number
  category: string
  image: string
  sections: BlogSection[]
  /** Slugs de fragancias que ilustran el artículo. */
  relatedProducts: string[]
}

export const POSTS: BlogPost[] = [
  {
    slug: 'como-hacer-que-el-perfume-dure-mas',
    title: 'Cómo hacer que tu perfume dure el doble',
    excerpt:
      'No es cuestión de rociar más: la duración depende de dónde lo aplicas, de cómo está tu piel y de la concentración que elegiste.',
    author: 'Equipo Sandós',
    date: '2026-07-12T00:00:00Z',
    readingMinutes: 4,
    category: 'Guías',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1400&q=80',
    relatedProducts: ['sauvage-elixir', 'alien-mugler', 'santal-33'],
    sections: [
      {
        paragraphs: [
          'La queja más repetida que recibimos es “me dura dos horas”. Casi siempre el problema no es el perfume: es la piel seca, el punto de aplicación o la concentración elegida. Estas seis cosas cambian el resultado sin gastar un peso más.',
        ],
      },
      {
        heading: 'Aplica sobre piel hidratada',
        paragraphs: [
          'La fragancia se ancla en la grasa natural de la piel. En piel seca se evapora mucho antes. Pon crema neutra sin perfume en las zonas donde vas a rociar y espera un minuto: es el truco que más diferencia hace, y el más barato.',
        ],
      },
      {
        heading: 'Elige bien los puntos de pulso',
        paragraphs: [
          'El calor corporal difunde el aroma. Los puntos donde la sangre corre más cerca de la superficie son los que mejor lo proyectan:',
        ],
        list: [
          'Detrás de las orejas y a los lados del cuello.',
          'La cara interna de las muñecas.',
          'El pliegue interno de los codos.',
          'Detrás de las rodillas, si vas a estar mucho de pie: el aroma sube.',
        ],
      },
      {
        heading: 'No frotes las muñecas',
        paragraphs: [
          'Frotar rompe las moléculas más volátiles y acelera la evaporación de las notas de salida. Rocía y deja secar. Ese gesto automático de frotar una muñeca contra la otra te está costando la primera media hora.',
        ],
      },
      {
        heading: 'Perfuma también la ropa y el pelo, con cuidado',
        paragraphs: [
          'Las fibras retienen el aroma mucho más que la piel: en un abrigo de lana puede durar días. Rocía a veinte centímetros y evita la seda y las telas claras, porque los aceites manchan. En el pelo, mejor sobre el cepillo que directo, para no resecarlo con el alcohol.',
        ],
      },
      {
        heading: 'Sube de concentración antes que de cantidad',
        paragraphs: [
          'Un EDT tiene entre 5% y 15% de esencia; un EDP, entre 15% y 20%; un parfum, más de 20%. Si necesitas ocho horas, tres aplicaciones de EDT no equivalen a un EDP: solo hacen la salida más agresiva. Está todo indicado en cada ficha del catálogo.',
        ],
      },
      {
        heading: 'Guárdalo lejos de la luz y del baño',
        paragraphs: [
          'El calor y la luz degradan la fórmula. El baño es el peor lugar posible por los cambios de temperatura. Un cajón, en su estuche, a temperatura estable: así un frasco aguanta años sin virar.',
        ],
      },
    ],
  },
  {
    slug: 'como-reconocer-un-perfume-original',
    title: 'Cómo reconocer un perfume original',
    excerpt:
      'Siete controles que puedes hacer con el frasco en la mano, antes de abrirlo, para saber si lo que compraste es auténtico.',
    author: 'Equipo Sandós',
    date: '2026-06-28T00:00:00Z',
    readingMinutes: 5,
    category: 'Autenticidad',
    image: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=1400&q=80',
    relatedProducts: ['bleu-de-chanel', 'coco-mademoiselle', 'terre-d-hermes'],
    sections: [
      {
        paragraphs: [
          'El mercado de réplicas es enorme y cada vez más prolijo. La buena noticia es que casi ninguna falsificación resiste los siete controles juntos. Revisa todos antes de abrir el frasco: una vez abierto, ninguna tienda seria puede aceptar la devolución.',
        ],
      },
      {
        heading: '1. El celofán',
        paragraphs: [
          'El original viene ajustado al milímetro, con dobleces limpios y simétricos en los extremos. La réplica suele traer plástico más grueso, arrugado, con burbujas o pegado a mano.',
        ],
      },
      {
        heading: '2. El código de lote',
        paragraphs: [
          'Tiene que estar impreso —no pegado con etiqueta— en la caja y en el frasco, y ser el mismo en ambos. Si falta en alguno de los dos, o no coinciden, no lo compres.',
        ],
      },
      {
        heading: '3. La caja',
        paragraphs: [
          'Cartón rígido, troquelado nítido, tipografía sin bordes borrosos ni puntos de tinta. Los originales usan un cartón que no se hunde al apretarlo con el pulgar.',
        ],
      },
      {
        heading: '4. El vidrio',
        paragraphs: [
          'Sin burbujas, sin rebabas en las uniones, con base pareja. El vidrio de una réplica casi siempre tiene un borde áspero en la zona donde entra el atomizador.',
        ],
      },
      {
        heading: '5. El atomizador',
        paragraphs: [
          'Rocía parejo, en niebla fina, sin gotear ni chorrear. El tubo interior llega al fondo y está bien centrado. Un atomizador que escupe líquido es señal casi definitiva.',
        ],
      },
      {
        heading: '6. El color del líquido',
        paragraphs: [
          'Comparalo con la foto oficial de la casa. Las réplicas suelen tirar a un tono más intenso, casi artificial, porque agregan colorante para compensar la falta de materia prima.',
        ],
      },
      {
        heading: '7. El precio',
        paragraphs: [
          'Es el control más simple y el que más gente ignora. Un descuento del 70% sobre el precio de lista de una casa que nunca liquida no es una oportunidad: es la respuesta.',
        ],
      },
      {
        heading: 'Nuestra política',
        paragraphs: [
          'Trabajamos solo con distribuidores autorizados e importadores registrados. Si tienes cualquier duda sobre algo que te vendimos, lo retiramos y devolvemos el 100% del importe, sin que tengas que demostrar nada.',
        ],
      },
    ],
  },
  {
    slug: 'guia-de-familias-olfativas',
    title: 'Las ocho familias olfativas, explicadas sin tecnicismos',
    excerpt:
      'Amaderada, cítrica, chipre, gourmand. Qué significa cada una en la práctica y cuál encaja con ti según cómo vives.',
    author: 'Equipo Sandós',
    date: '2026-06-05T00:00:00Z',
    readingMinutes: 6,
    category: 'Guías',
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1400&q=80',
    relatedProducts: ['acqua-di-gio', 'good-girl', 'libre'],
    sections: [
      {
        paragraphs: [
          'Casi nadie entra a una perfumería pidiendo “un chipre”. Se pide “algo fresco”, “algo que abrace”, “algo elegante”. Las familias olfativas son justamente eso: una forma de ordenar sensaciones. Esta es la traducción de cada una al idioma en que la gente realmente compra.',
        ],
      },
      {
        heading: 'Cítricas — “que huela a limpio”',
        paragraphs: [
          'Limón, bergamota, pomelo. Luminosas y de arranque inmediato, pero las que menos duran: los cítricos son las moléculas más volátiles que existen en perfumería. Ideales para calor y para oficinas compartidas.',
        ],
      },
      {
        heading: 'Acuáticas — “que huela a aire”',
        paragraphs: [
          'La nota marina no existe en la naturaleza: se sintetizó en los ochenta y definió una época entera. Transparentes y salinas, funcionan cuando cualquier cosa densa resulta agobiante.',
        ],
      },
      {
        heading: 'Aromáticas — “que huela a recién bañado”',
        paragraphs: [
          'Lavanda, menta, romero, salvia. Es la familia de la barbería clásica. Limpia sin ser infantil, y de las más fáciles de llevar a diario.',
        ],
      },
      {
        heading: 'Florales — “que huela bonito”',
        paragraphs: [
          'La familia más grande y más variada: un jazmín puede ser inocente o abiertamente sensual según qué lo acompañe. Rosa, iris, azahar, nardo. No confundas floral con dulce; muchas florales son secas.',
        ],
      },
      {
        heading: 'Amaderadas — “que huela a caro”',
        paragraphs: [
          'Sándalo, cedro, vetiver, pachulí. Cálidas, secas y con mucha permanencia. Son las que la gente asocia a la elegancia sin poder explicar por qué: la madera es lo que queda cuando todo lo demás se evaporó.',
        ],
      },
      {
        heading: 'Chipres — “que huela a adulto”',
        paragraphs: [
          'Bergamota arriba, musgo de roble y pachulí abajo. Llevan una amargura noble que los separa de todo lo dulce. Es la familia más difícil de entender al principio y la que más fidelidad genera después.',
        ],
      },
      {
        heading: 'Orientales — “que no pase desapercibido”',
        paragraphs: [
          'Ámbar, incienso, especias, resinas. Densas y de estela larga. Rinden en frío y de noche; en verano y en un ascensor pueden ser demasiado.',
        ],
      },
      {
        heading: 'Gourmand — “que huela a abrazo”',
        paragraphs: [
          'Vainilla, café, praliné, cacao. Nacieron en los noventa y son las que más crecen. Adictivas por diseño, y las que más rápido cansan si se aplican de más.',
        ],
      },
      {
        paragraphs: [
          'Si leyendo esto reconociste dos o tres familias en vez de una, es la respuesta correcta: casi nadie usa una sola. El test de firma olfativa cruza tus respuestas con las ocho y te devuelve tres fragancias concretas.',
        ],
      },
    ],
  },
  {
    slug: 'que-perfume-regalar',
    title: 'Cómo elegir un perfume de regalo sin fallar',
    excerpt:
      'Regalar fragancia es difícil porque el gusto es personal. Estas cuatro reglas suben muchísimo las probabilidades de acertar.',
    author: 'Equipo Sandós',
    date: '2026-05-20T00:00:00Z',
    readingMinutes: 3,
    category: 'Regalos',
    image: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=1400&q=80',
    relatedProducts: ['la-vie-est-belle', 'versace-eros', 'bright-crystal'],
    sections: [
      {
        paragraphs: [
          'Un perfume es de los regalos que más se agradecen y de los que más terminan en un cajón. La diferencia entre una cosa y la otra casi nunca es el presupuesto.',
        ],
      },
      {
        heading: 'Regala el set de muestras, no el frasco',
        paragraphs: [
          'Si no estás seguro, esto resuelve el problema entero: la otra persona prueba cinco fragancias en su piel y elige. Sale una fracción del frasco y elimina el riesgo de regalar algo que no se va a usar.',
        ],
      },
      {
        heading: 'Mira qué usa hoy, no qué te gusta a ti',
        paragraphs: [
          'Sacale una foto al frasco que tiene en la cómoda. Con la casa y el nombre podemos decirte qué familia es y proponerte tres alternativas de la misma línea que no repitan lo que ya tiene.',
        ],
      },
      {
        heading: 'Ante la duda, baja la intensidad',
        paragraphs: [
          'Un perfume discreto que resulta “un poco poco” se usa igual. Uno invasivo que no le gusta no se usa nunca. Si dudas entre dos, elige el de estela más contenida.',
        ],
      },
      {
        heading: 'Guarda el ticket y avisa que se puede cambiar',
        paragraphs: [
          'Decirlo no le quita valor al regalo: le quita presión. Con el frasco cerrado lo cambiamos sin cargo durante 30 días, y quien lo recibe se lleva algo que va a usar de verdad.',
        ],
      },
    ],
  },
]

export const getPost = (slug: string) => POSTS.find((post) => post.slug === slug)

export const recentPosts = (limit = 3) =>
  [...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit)

export const otherPosts = (slug: string, limit = 3) =>
  POSTS.filter((post) => post.slug !== slug).slice(0, limit)
