-- TAIROS OS v1 - Esquema de Base de Datos para Supabase
-- Habilita la extensión de búsqueda vectorial (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Perfiles de Usuario (Control de Roles: 'super_admin', 'member')
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'member', -- 'super_admin' o 'member'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security) en perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los usuarios pueden leer todos los perfiles"
ON profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Los usuarios pueden actualizar su propio perfil"
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Función y Trigger para crear automáticamente el perfil al registrarse en Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'role', 'member') -- Permite pre-asignar rol en el registro
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Clientes
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Proyectos
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Canales de Chat / Workspace
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Conversaciones (Mensajes con pgvector para RAG)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id UUID REFERENCES channels(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_type TEXT NOT NULL, -- 'human' o 'agent'
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Vector de 1536 dimensiones (OpenAI standard)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Documentos (Subidos a MinIO/Supabase Storage con RAG vectorial)
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Ruta en el storage
    mime_type TEXT,
    content TEXT NOT NULL, -- Texto completo extraído con Docling
    embedding VECTOR(1536), -- Embedding vectorial del contenido o resumen
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Reuniones (Transcripciones y grabaciones con RAG)
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    transcription TEXT, -- Texto completo de la transcripción
    audio_url TEXT, -- Grabación de audio
    embedding VECTOR(1536), -- Embedding del resumen o transcripción
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Decisiones (Extraídas automáticamente del chat/reuniones)
CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    justification TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_type TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Biblioteca de Activos (Prompts, Plantillas, MCPs)
CREATE TABLE IF NOT EXISTS library_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    asset_type TEXT NOT NULL, -- 'prompt', 'component', 'workflow', 'mcp'
    version TEXT NOT NULL DEFAULT '1.0.0',
    content TEXT NOT NULL,
    usage_count INTEGER DEFAULT 0,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS en Biblioteca de Activos (Solo Super Admin puede modificar configuraciones globales)
ALTER TABLE library_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede leer los activos de la biblioteca"
ON library_assets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Solo super_admin puede modificar activos de biblioteca"
ON library_assets FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'super_admin'
    )
);


-- 10. Experimentos
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    hypothesis TEXT NOT NULL,
    parameters JSONB,
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Errores (Logs y stack traces capturados en el Runner)
CREATE TABLE IF NOT EXISTS errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    severity TEXT NOT NULL DEFAULT 'Error',
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Aprendizajes / Lecciones Aprendidas (RAG de auto-aprendizaje)
CREATE TABLE IF NOT EXISTS learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    error_id UUID REFERENCES errors(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    lesson TEXT NOT NULL,
    embedding VECTOR(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices HNSW para búsquedas vectoriales rápidas por distancia coseno
CREATE INDEX ON messages USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON documents USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON meetings USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON decisions USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON library_assets USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON errors USING hnsw (embedding vector_cosine_ops);
CREATE INDEX ON learnings USING hnsw (embedding vector_cosine_ops);
