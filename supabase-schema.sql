-- Crear tabla de proyectos
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  goal_amount DECIMAL(12, 2) NOT NULL,
  amount_raised DECIMAL(12, 2) NOT NULL DEFAULT 0,
  cover_image TEXT,
  additional_images JSONB, -- Array de URLs
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  location TEXT NOT NULL,
  organizer_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  donors_count INTEGER NOT NULL DEFAULT 0,
  payment_methods JSONB, -- Objeto con métodos de pago habilitados
  bank_info JSONB -- Información bancaria
);

-- Crear tabla de donaciones
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  amount DECIMAL(12, 2) NOT NULL,
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method TEXT NOT NULL,
  status TEXT NOT NULL,
  transaction_id TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Políticas de seguridad RLS (Row Level Security)
-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Crear políticas para proyectos
-- Cualquiera puede leer
CREATE POLICY "Cualquiera puede leer proyectos" ON projects
  FOR SELECT USING (true);

-- Solo usuarios autenticados pueden modificar
CREATE POLICY "Solo autenticados pueden insertar proyectos" ON projects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  
CREATE POLICY "Solo autenticados pueden actualizar proyectos" ON projects
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Solo autenticados pueden eliminar proyectos" ON projects
  FOR DELETE USING (auth.role() = 'authenticated');

-- Crear políticas para donaciones
-- Cualquiera puede leer
CREATE POLICY "Cualquiera puede leer donaciones" ON donations
  FOR SELECT USING (true);

-- Cualquiera puede insertar donaciones
CREATE POLICY "Cualquiera puede insertar donaciones" ON donations
  FOR INSERT WITH CHECK (true);
  
-- Solo admins pueden actualizar o eliminar donaciones
CREATE POLICY "Solo autenticados pueden actualizar donaciones" ON donations
  FOR UPDATE USING (auth.role() = 'authenticated');
  
CREATE POLICY "Solo autenticados pueden eliminar donaciones" ON donations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS donations_project_id_idx ON donations (project_id);

-- Función para actualizar la fecha de actualización automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en proyectos
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 