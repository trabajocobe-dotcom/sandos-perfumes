/**
 * Materias primas de la perfumería, con el dato que las vuelve interesantes.
 *
 * Cada entrada dice CÓMO se extrae, porque es lo que explica el precio y la
 * diferencia entre una fragancia y otra. Los datos están contrastados contra
 * bibliografía de perfumería, no inventados para rellenar: el sándalo tarda de
 * verdad quince años, el jazmín se recoge de verdad de noche.
 */

export type ClaveIngrediente =
  | 'bergamota'
  | 'jazmin'
  | 'sandalo'
  | 'vainilla'
  | 'ambar'
  | 'pachuli'
  | 'cedro'
  | 'haba-tonka'
  | 'mandarina'
  | 'pomelo'
  | 'rosa'
  | 'lavanda'

export interface Ingrediente {
  clave: ClaveIngrediente
  nombre: string
  familia: string
  /** Cómo se saca el aroma de la materia prima. */
  extraccion: string
  /** Una línea que el visitante no sabía. */
  dato: string
  /** Dónde cae en la pirámide: salida, corazón o fondo. */
  nivel: 'salida' | 'corazon' | 'fondo'
}

export const INGREDIENTES: Ingrediente[] = [
  {
    clave: 'bergamota',
    nombre: 'Bergamota',
    familia: 'Cítrica',
    extraccion: 'Expresión en frío',
    dato: 'La cáscara se prensa sin una gota de calor. Por eso el cítrico huele vivo y por eso se evapora primero.',
    nivel: 'salida',
  },
  {
    clave: 'jazmin',
    nombre: 'Jazmín',
    familia: 'Floral',
    extraccion: 'Enfleurage y disolventes',
    dato: 'Se recoge de noche, que es cuando la flor más huele. Un ciclo de enfleurage consume entre 25 y 36 tandas de flores frescas.',
    nivel: 'corazon',
  },
  {
    clave: 'sandalo',
    nombre: 'Sándalo',
    familia: 'Amaderada',
    extraccion: 'Destilación por vapor',
    dato: 'El árbol necesita unos quince años antes de que su madera tenga aroma. No hay manera de apurarlo.',
    nivel: 'fondo',
  },
  {
    clave: 'vainilla',
    nombre: 'Vainilla',
    familia: 'Gourmand',
    extraccion: 'Maceración',
    dato: 'Recién cortada no huele a nada. La vaina se cura durante meses hasta que aparece la vainillina.',
    nivel: 'fondo',
  },
  {
    clave: 'ambar',
    nombre: 'Ámbar',
    familia: 'Oriental',
    extraccion: 'Acorde construido',
    dato: 'No existe una planta de ámbar. Es un acorde que el perfumista arma con lábdano, benjuí y vainilla.',
    nivel: 'fondo',
  },
  {
    clave: 'pachuli',
    nombre: 'Pachulí',
    familia: 'Amaderada',
    extraccion: 'Destilación de la hoja seca',
    dato: 'Es de las pocas materias que mejoran con los años. El aceite viejo vale más que el recién hecho.',
    nivel: 'fondo',
  },
  {
    clave: 'cedro',
    nombre: 'Cedro',
    familia: 'Amaderada',
    extraccion: 'Destilación de la madera',
    dato: 'Aporta el fondo seco y lapicero que sostiene a las flores para que no se vuelvan dulces.',
    nivel: 'fondo',
  },
  {
    clave: 'haba-tonka',
    nombre: 'Haba tonka',
    familia: 'Gourmand',
    extraccion: 'Maceración en alcohol',
    dato: 'Su cumarina huele a almendra, heno cortado y tabaco a la vez. Una sola nota hace tres trabajos.',
    nivel: 'fondo',
  },
  {
    clave: 'mandarina',
    nombre: 'Mandarina',
    familia: 'Cítrica',
    extraccion: 'Expresión en frío',
    dato: 'Más dulce y menos ácida que el limón. Es el cítrico que no muerde.',
    nivel: 'salida',
  },
  {
    clave: 'pomelo',
    nombre: 'Pomelo',
    familia: 'Cítrica',
    extraccion: 'Expresión en frío',
    dato: 'Aporta el amargo que impide que una salida cítrica se vuelva refresco.',
    nivel: 'salida',
  },
  {
    clave: 'rosa',
    nombre: 'Rosa',
    familia: 'Floral',
    extraccion: 'Destilación y disolventes',
    dato: 'Hacen falta unos cuatro mil kilos de pétalos para un solo kilo de esencia.',
    nivel: 'corazon',
  },
  {
    clave: 'lavanda',
    nombre: 'Lavanda',
    familia: 'Aromática',
    extraccion: 'Destilación por vapor',
    dato: 'Es la bisagra del perfume: une los cítricos de arriba con las maderas de abajo.',
    nivel: 'corazon',
  },
]

/** Los pasos reales de fabricación, con las cifras del oficio. */
export interface PasoDelProceso {
  numero: string
  titulo: string
  entradilla: string
  cuerpo: string
  /** Cifra que ancla el paso. */
  cifra: string
  cifraPie: string
}

export const PROCESO: PasoDelProceso[] = [
  {
    numero: '01',
    titulo: 'La cosecha',
    entradilla: 'El aroma tiene horario',
    cuerpo:
      'Una misma flor no huele igual a las seis de la mañana que a mediodía. El jazmín se recoge de noche y los cítricos cuando la cáscara todavía está tensa. Equivocarse de hora cuesta la cosecha entera.',
    cifra: 'De noche',
    cifraPie: 'cuando el jazmín da su punto más alto',
  },
  {
    numero: '02',
    titulo: 'La extracción',
    entradilla: 'Cuatro formas de sacarle el olor a algo',
    cuerpo:
      'La destilación por vapor arrastra el aceite con agua hirviendo. Los cítricos van en frío, prensados, porque el calor los quema. Las flores frágiles se trabajan con disolventes o con CO₂, que extrae en horas lo que al enfleurage le llevaba meses.',
    cifra: '60–100 °C',
    cifraPie: 'la destilación por vapor · el CO₂ trabaja a 32 °C y 73 bar',
  },
  {
    numero: '03',
    titulo: 'La fórmula',
    entradilla: 'Aquí deja de ser agricultura',
    cuerpo:
      'El perfumista compone por capas: lo que se siente al rociar, lo que aparece a la media hora y lo que queda en la ropa al día siguiente. Una fórmula puede llevar decenas de materias y cambiar por un 0,1 %.',
    cifra: '3 capas',
    cifraPie: 'salida, corazón y fondo',
  },
  {
    numero: '04',
    titulo: 'La maceración',
    entradilla: 'El paso que no se puede apurar',
    cuerpo:
      'El concentrado se diluye en alcohol y se deja reposar a oscuras. Las materias se acomodan entre ellas y los filos se redondean. Es lo mismo que le pasa a un guiso del día siguiente.',
    cifra: 'Semanas o meses',
    cifraPie: 'un Eau de Parfum lleva 15–20 % de esencia; un Eau de Toilette, 5–15 %',
  },
  {
    numero: '05',
    titulo: 'El frío y el frasco',
    entradilla: 'Lo último es quitar, no poner',
    cuerpo:
      'Se enfría el líquido para que precipite todo lo que podría enturbiarlo y se filtra. Recién entonces se embotella. Lo que llega a tus manos es lo que sobrevivió a cada uno de estos pasos.',
    cifra: 'Filtrado en frío',
    cifraPie: 'y recién ahí, el frasco',
  },
]
