-- Sandós Perfumes — Esquema Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor

-- 1. TABLA DE PERFILES (extiende auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL DEFAULT '',
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super-admin', 'admin', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. TABLA DE CATEGORÍAS
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. TABLA DE PRODUCTOS
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price >= 0),
  image_url TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES categories(id),
  notes TEXT,
  volume TEXT,
  gender TEXT CHECK (gender IN ('unisex', 'masculino', 'femenino')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. TABLA DE ÓRDENES
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  status TEXT NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado')),
  total INTEGER NOT NULL CHECK (total >= 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('efectivo', 'transferencia', 'mercadopago')),
  shipping_address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 5. TABLA DE ITEMS DE ÓRDENES
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. TABLA DE CARRITO (para usuarios autenticados)
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- ===== ROW LEVEL SECURITY POLICIES =====

-- Perfiles: cada usuario ve su propio perfil, super-admin ve todo
CREATE POLICY "Users view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'super-admin');

CREATE POLICY "Super admin can insert profiles" ON profiles
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'super-admin');

CREATE POLICY "Super admin can update profiles" ON profiles
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'super-admin');

-- Productos: lectura pública, escritura solo admin
CREATE POLICY "Products public read" ON products
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin write products" ON products
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

CREATE POLICY "Admin update products" ON products
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

CREATE POLICY "Admin delete products" ON products
  FOR DELETE USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- Categorías: lectura pública
CREATE POLICY "Categories public read" ON categories
  FOR SELECT USING (TRUE);

CREATE POLICY "Admin write categories" ON categories
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- Órdenes: el usuario ve sus órdenes, admin ve todas
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

CREATE POLICY "Users insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin update orders" ON orders
  FOR UPDATE USING (auth.jwt() ->> 'role' IN ('admin', 'super-admin'));

-- Order items: mismo criterio que orders
CREATE POLICY "Users view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR auth.jwt() ->> 'role' IN ('admin', 'super-admin')))
  );

CREATE POLICY "Users insert own order items" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Cart: el usuario ve/edita su propio carrito
CREATE POLICY "Users manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- ===== FUNCTIONS =====

-- Crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email,
    'viewer'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger: al crear usuario en auth.users, crear perfil
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ===== SEED DATA =====
INSERT INTO categories (id, name, slug, description) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'Amaderados', 'amaderados', 'Fragancias cálidas y profundas'),
  ('c0000001-0000-0000-0000-000000000002', 'Cítricos', 'citricos', 'Aromas frescos y vibrantes'),
  ('c0000001-0000-0000-0000-000000000003', 'Florales', 'florales', 'Notas delicadas y femeninas'),
  ('c0000001-0000-0000-0000-000000000004', 'Orientales', 'orientales', 'Especias y misterio'),
  ('c0000001-0000-0000-0000-000000000005', 'Dulces', 'dulces', 'Fragancias golosas y envolventes');

INSERT INTO products (id, name, slug, description, price, image_url, stock, category_id, notes, volume, gender, featured) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Bleu de Chanel', 'bleu-de-chanel', 'Una fragancia icónica que combina notas amaderadas con un toque cítrico y fresco.', 85000, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&q=80', 12, 'c0000001-0000-0000-0000-000000000001', 'Pomelo, Jengibre, Sándalo', '100ml', 'masculino', TRUE),
  ('a0000001-0000-0000-0000-000000000002', 'Flower by Kenzo', 'flower-by-kenzo', 'La esencia de una amapola en plena floración. Una fragancia floral poética y elegante.', 72000, 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80', 8, 'c0000001-0000-0000-0000-000000000003', 'Amapola, Vainilla, Almizcle', '50ml', 'femenino', TRUE),
  ('a0000001-0000-0000-0000-000000000003', 'Acqua di Gio', 'acqua-di-gio', 'Un clásico marino que evoca la brisa del mediterráneo. Fresco, limpio y sofisticado.', 68000, 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=400&q=80', 15, 'c0000001-0000-0000-0000-000000000002', 'Bergamota, Neroli, Romero', '75ml', 'masculino', TRUE),
  ('a0000001-0000-0000-0000-000000000004', 'Black Opium', 'black-opium', 'Una fragancia oriental y dulce con un toque de café negro.', 95000, 'https://images.unsplash.com/photo-1615639570680-7c3861bbefe7?w=400&q=80', 6, 'c0000001-0000-0000-0000-000000000004', 'Café, Vainilla, Almendra', '50ml', 'femenino', TRUE),
  ('a0000001-0000-0000-0000-000000000005', 'Sauvage Elixir', 'sauvage-elixir', 'La intensidad de la naturaleza en estado puro.', 112000, 'https://images.unsplash.com/photo-1557178114-e3e4f2c0455d?w=400&q=80', 4, 'c0000001-0000-0000-0000-000000000001', 'Canela, Nuez moscada, Sándalo', '60ml', 'masculino', FALSE),
  ('a0000001-0000-0000-0000-000000000006', 'La Vie Est Belle', 'la-vie-est-belle', 'La felicidad en una fragancia. Un bouquet floral con corazón goloso.', 78000, 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400&q=80', 10, 'c0000001-0000-0000-0000-000000000005', 'Iris, Praliné, Vainilla', '50ml', 'femenino', FALSE),
  ('a0000001-0000-0000-0000-000000000007', 'Terre d''Hermès', 'terre-d-hermes', 'Una conexión entre el cielo y la tierra. Mineral y amaderado.', 105000, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80', 7, 'c0000001-0000-0000-0000-000000000001', 'Naranja, Pimienta, Vetiver', '75ml', 'masculino', FALSE),
  ('a0000001-0000-0000-0000-000000000008', 'Light Blue Dolce&Gabbana', 'light-blue', 'La luz del sol en una fragancia. Cítrica y mediterránea.', 62000, 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&q=80', 20, 'c0000001-0000-0000-0000-000000000002', 'Limón, Manzana, Cedro', '50ml', 'femenino', FALSE),
  ('a0000001-0000-0000-0000-000000000009', 'One Million', 'one-million', 'Una fragancia audaz y magnética.', 88000, 'https://images.unsplash.com/photo-1591375275560-0afcfb6a0e3b?w=400&q=80', 9, 'c0000001-0000-0000-0000-000000000004', 'Canela, Cuero, Ámbar', '100ml', 'masculino', FALSE),
  ('a0000001-0000-0000-0000-00000000000a', 'Alien Mugler', 'alien-mugler', 'Una fragancia misteriosa y envolvente.', 92000, 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&q=80', 5, 'c0000001-0000-0000-0000-000000000004', 'Ámbar blanco, Cachemira, Madera', '60ml', 'femenino', FALSE),
  ('a0000001-0000-0000-0000-00000000000b', 'Versace Eros', 'versace-eros', 'La pasión de un amor mitológico.', 75000, 'https://images.unsplash.com/photo-1567171466295-4e0f1e0f5b5d?w=400&q=80', 14, 'c0000001-0000-0000-0000-000000000001', 'Menta, Manzana, Cedro', '100ml', 'masculino', FALSE),
  ('a0000001-0000-0000-0000-00000000000c', 'Good Girl Carolina Herrera', 'good-girl', 'El equilibrio entre la luz y la oscuridad.', 99000, 'https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=400&q=80', 11, 'c0000001-0000-0000-0000-000000000005', 'Almendra, Café, Jazmín, Cacao', '80ml', 'femenino', TRUE);
