# Sandós Perfumes

Tienda de perfumería importada. Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript.

## Puesta en marcha

```bash
npm install
npm run dev
```

El sitio queda en `http://localhost:3000`. El panel de administración está en
`/dashboard` (cuenta de demostración: `admin@sandos.com` / `admin123`).

## Estructura

```
src/
├── app/
│   ├── (tienda)/          Grupo de rutas de la tienda pública. Su layout aporta
│   │                      barra de anuncios, header, footer, carrito y ayuda.
│   │   ├── page.tsx           Home
│   │   ├── catalogo/          Catálogo con filtros en la URL
│   │   ├── producto/[slug]/   Ficha (SSG + JSON-LD de Product)
│   │   ├── quiz/              Test de firma olfativa
│   │   ├── muestras/          Armado del set de descubrimiento
│   │   └── carrito/ checkout/ favoritos/ legal/[slug]/
│   ├── dashboard/         Panel de administración (superficie clara, clase .panel)
│   ├── auth/              Login de clientes
│   ├── globals.css        Sistema de diseño completo (tokens + componentes)
│   └── sitemap.ts robots.ts
├── components/
│   ├── commerce/          Card de producto, carrito lateral, buscador, newsletter
│   ├── catalog/           Vista y panel de filtros del catálogo
│   ├── fragrance/         Pirámide olfativa y medidores de duración/estela
│   └── product/ quiz/ home/ layout/ ui/
├── hooks/                 Carrito, favoritos, vistos, sesión, datos de cliente
├── lib/
│   ├── demo-data.ts       Catálogo, familias y reseñas (fuente única)
│   ├── catalog.ts         Búsqueda, filtros, orden y recomendaciones
│   ├── quiz.ts            Preguntas y puntuación del test olfativo
│   ├── site.ts            Datos del negocio (contacto, envíos, umbrales)
│   ├── whatsapp.ts        Armado de mensajes de pedido
│   ├── legal.ts           Contenido de las páginas legales y de ayuda
│   └── persistent-store.ts  Store en localStorage seguro para hidratación
└── types/index.ts         Modelo de dominio
```

## Sistema de diseño

Dirección: **Editorial Noir** — lujo editorial sobre negro cálido. Las reglas
están escritas al principio de `src/app/globals.css` y son vinculantes:

| Token | Valor | Uso |
|---|---|---|
| `--color-ink` | `#0a0908` | Fondo base (negro cálido, nunca `#000`) |
| `--color-bone` | `#f2ede6` | Texto principal (nunca `#fff`) |
| `--color-gilt` | `#c8a24a` | **Único** color de acción: CTAs e interacción |
| `--radius-brand` | `2px` | Radio identitario, repetido en todo |
| `--font-display` | Bodoni Moda | Solo en tamaños grandes |
| `--font-sans` | Inter | Todo el texto funcional |

Un solo sistema decorativo: `haze` (luz cálida difusa) más grano de película.
No se mezclan glassmorphism, sombras de color ni gradientes decorativos.

El panel de administración usa la clase `.panel`, que redefine únicamente los
tokens de superficie y texto para dar una versión clara del mismo sistema.

## Datos

El catálogo vive en `src/lib/demo-data.ts`. El esquema de Supabase equivalente
está en `supabase/migrations/00001_schema.sql`. Carrito, favoritos, sesión y
pedidos se guardan en `localStorage` mientras Supabase no esté conectado.

Para conectar Supabase: copiar `.env.example` a `.env.local`, completar las
claves y reemplazar los imports de `demo-data` por consultas.

## Comandos

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run start   # servir el build
npm run lint    # ESLint (debe salir sin errores ni advertencias)
```
