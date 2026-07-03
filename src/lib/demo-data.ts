/**
 * Datos de demostración para usar mientras no hay Supabase conectado.
 *
 * Cuando se configure Supabase:
 * 1. Poblar las tablas con estos mismos datos vía seed.sql
 * 2. Los componentes ya no importarán este archivo, llamarán a Supabase directo
 */

import type { Product, Category, Order } from '@/types'

export const categories: Category[] = [
  { id: '1', name: 'Amaderados', slug: 'amaderados', description: 'Fragancias cálidas y profundas' },
  { id: '2', name: 'Cítricos', slug: 'citricos', description: 'Aromas frescos y vibrantes' },
  { id: '3', name: 'Florales', slug: 'florales', description: 'Notas delicadas y femeninas' },
  { id: '4', name: 'Orientales', slug: 'orientales', description: 'Especias y misterio' },
  { id: '5', name: 'Dulces', slug: 'dulces', description: 'Fragancias golosas y envolventes' },
]

export const products: Product[] = [
  {
    id: 'p1', name: 'Bleu de Chanel', slug: 'bleu-de-chanel',
    description: 'Una fragancia icónica que combina notas amaderadas con un toque cítrico y fresco. Perfecta para el día a día.',
    price: 85000, image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80',
    stock: 12, category_id: '1', notes: 'Pomelo, Jengibre, Sándalo', volume: '100ml', gender: 'masculino',
    featured: true, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p2', name: 'Flower by Kenzo', slug: 'flower-by-kenzo',
    description: 'La esencia de una amapola en plena floración. Una fragancia floral poética y elegante.',
    price: 72000, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80',
    stock: 8, category_id: '3', notes: 'Amapola, Vainilla, Almizcle', volume: '50ml', gender: 'femenino',
    featured: true, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p3', name: 'Acqua di Gio', slug: 'acqua-di-gio',
    description: 'Un clásico marino que evoca la brisa del mediterráneo. Fresco, limpio y sofisticado.',
    price: 68000, image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80',
    stock: 15, category_id: '2', notes: 'Bergamota, Neroli, Romero', volume: '75ml', gender: 'masculino',
    featured: true, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p4', name: 'Black Opium', slug: 'black-opium',
    description: 'Una fragancia oriental y dulce con un toque de café negro. Adictiva y moderna.',
    price: 95000, image_url: 'https://images.unsplash.com/photo-1615639570680-7c3861bbefe7?w=400&q=80',
    stock: 6, category_id: '4', notes: 'Café, Vainilla, Almendra', volume: '50ml', gender: 'femenino',
    featured: true, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p5', name: 'Sauvage Elixir', slug: 'sauvage-elixir',
    description: 'La intensidad de la naturaleza en estado puro. Notas especiadas y amaderadas.',
    price: 112000, image_url: 'https://images.unsplash.com/photo-1557178114-e3e4f2c0455d?w=400&q=80',
    stock: 4, category_id: '1', notes: 'Canela, Nuez moscada, Sándalo', volume: '60ml', gender: 'masculino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p6', name: 'La Vie Est Belle', slug: 'la-vie-est-belle',
    description: 'La felicidad en una fragancia. Un bouquet floral con un corazón goloso de praliné.',
    price: 78000, image_url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80',
    stock: 10, category_id: '5', notes: 'Iris, Praliné, Vainilla', volume: '50ml', gender: 'femenino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p7', name: 'Terre d\'Hermès', slug: 'terre-d-hermes',
    description: 'Una conexión entre el cielo y la tierra. Mineral, amaderado y profundamente elegante.',
    price: 105000, image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80',
    stock: 7, category_id: '1', notes: 'Naranja, Pimienta, Vetiver', volume: '75ml', gender: 'masculino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p8', name: 'Light Blue Dolce&Gabbana', slug: 'light-blue',
    description: 'La luz del sol en una fragancia. Cítrica, fresca y mediterránea.',
    price: 62000, image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80',
    stock: 20, category_id: '2', notes: 'Limón, Manzana, Cedro', volume: '50ml', gender: 'femenino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p9', name: 'One Million', slug: 'one-million',
    description: 'Una fragancia audaz y magnética. Notas especiadas con un toque de cuero.',
    price: 88000, image_url: 'https://images.unsplash.com/photo-1591375275560-0afcfb6a0e3b?w=400&q=80',
    stock: 9, category_id: '4', notes: 'Canela, Cuero, Ámbar', volume: '100ml', gender: 'masculino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p10', name: 'Alien Mugler', slug: 'alien-mugler',
    description: 'Una fragancia misteriosa y envolvente. Ámbar blanco y notas solares.',
    price: 92000, image_url: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80',
    stock: 5, category_id: '4', notes: 'Ámbar blanco, Cachemira, Madera', volume: '60ml', gender: 'femenino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p11', name: 'Versace Eros', slug: 'versace-eros',
    description: 'La pasión de un amor mitológico. Menta verde, manzana y notas amaderadas.',
    price: 75000, image_url: 'https://images.unsplash.com/photo-1567171466295-4e0f1e0f5b5d?w=400&q=80',
    stock: 14, category_id: '1', notes: 'Menta, Manzana, Cedro', volume: '100ml', gender: 'masculino',
    featured: false, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
  {
    id: 'p12', name: 'Good Girl Carolina Herrera', slug: 'good-girl',
    description: 'El equilibrio perfecto entre la luz y la oscuridad. Almendra y café con flores blancas.',
    price: 99000, image_url: 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&q=80',
    stock: 11, category_id: '5', notes: 'Almendra, Café, Jazmín, Cacao', volume: '80ml', gender: 'femenino',
    featured: true, created_at: '2024-01-01', updated_at: '2024-06-01',
  },
]

export const demoOrders: Order[] = [
  {
    id: 'o1', user_id: 'demo-user',
    items: [
      { id: 'oi1', order_id: 'o1', product_id: 'p1', product_name: 'Bleu de Chanel', quantity: 1, price: 85000 },
      { id: 'oi2', order_id: 'o1', product_id: 'p3', product_name: 'Acqua di Gio', quantity: 2, price: 68000 },
    ],
    total: 221000, status: 'entregado', payment_method: 'mercadopago',
    created_at: '2024-05-15T10:30:00Z', updated_at: '2024-05-18T14:00:00Z',
  },
  {
    id: 'o2', user_id: 'demo-user',
    items: [
      { id: 'oi3', order_id: 'o2', product_id: 'p4', product_name: 'Black Opium', quantity: 1, price: 95000 },
    ],
    total: 95000, status: 'confirmado', payment_method: 'transferencia',
    created_at: '2024-06-01T16:45:00Z', updated_at: '2024-06-01T16:45:00Z',
  },
  {
    id: 'o3', user_id: 'demo-user',
    items: [
      { id: 'oi4', order_id: 'o3', product_id: 'p2', product_name: 'Flower by Kenzo', quantity: 1, price: 72000 },
      { id: 'oi5', order_id: 'o3', product_id: 'p12', product_name: 'Good Girl', quantity: 1, price: 99000 },
    ],
    total: 171000, status: 'pendiente', payment_method: 'efectivo',
    created_at: '2024-06-10T09:15:00Z', updated_at: '2024-06-10T09:15:00Z',
  },
]
