# TAIROS OS V1

Sistema Operativo para Organizaciones Inteligentes

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 16 + React 19 + TypeScript + TailwindCSS
- **Backend**: FastAPI + Python 3.12
- **Database**: Supabase (PostgreSQL + pgvector)
- **Auth**: Supabase Auth

## 📁 Estructura del Proyecto

```
tairos-v1/
├── frontend/          # Aplicación Next.js
├── backend/           # API FastAPI
├── docker-compose.yml # Orquestación Docker (opcional)
└── DEPLOYMENT.md      # Guía de despliegue
```

## 🛠️ Instalación Local

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales
npm run dev
```

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Editar .env con tus credenciales
uvicorn src.main:app --reload
```

## 🌐 Despliegue

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa de despliegue.

## 📚 Documentación

- [Prompts y Arquitectura](./prompts.md)
- [Schema de Base de Datos](./supabase_schema.sql)

## 🔑 Variables de Entorno

Los archivos `.env.example` contienen plantillas de las variables necesarias.

**NUNCA** subas archivos `.env` con credenciales reales a GitHub.

## 📝 Licencia

Privado - Todos los derechos reservados.
