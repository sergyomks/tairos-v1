# 🚀 GUÍA DE DESPLIEGUE - TAIROS OS V1

## 📋 Opciones de Despliegue

### ⭐ Opción 1: Vercel + Railway (RECOMENDADO)
- **Frontend**: Vercel (Gratis)
- **Backend**: Railway ($5/mes)
- **Base de Datos**: Supabase (Ya configurado)
- **Tiempo**: 10-15 minutos

### 🐳 Opción 2: Docker en VPS
- **Servidor**: DigitalOcean/AWS/GCP
- **Costo**: Desde $5/mes
- **Control**: Total
- **Tiempo**: 30-60 minutos

### 🌐 Opción 3: Todo en Railway
- **Todo en un lugar**
- **Costo**: $10-15/mes
- **Facilidad**: Máxima
- **Tiempo**: 15-20 minutos

---

## 🎯 OPCIÓN 1: VERCEL + RAILWAY

### A. Desplegar Frontend en Vercel

1. **Preparar repositorio:**
```bash
cd /home/sergyo/Documentos/tairos-v1
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/tairos-v1.git
git push -u origin main
```

2. **Desplegar en Vercel:**
- Ve a https://vercel.com
- Conecta con GitHub
- Import repository
- Root Directory: `frontend`
- Variables de entorno:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  NEXT_PUBLIC_API_URL=https://your-backend.railway.app
  ```
- Deploy

### B. Desplegar Backend en Railway

1. **Ir a Railway:**
- https://railway.app
- New Project → Deploy from GitHub
- Root Directory: `backend`

2. **Variables de entorno:**
```env
DATABASE_URL=postgresql://postgres.PROJECT:PASSWORD@HOST:PORT/postgres?pgbouncer=true
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
```

3. **Deploy automático** ✅

### C. Configurar CORS en Backend

Actualiza `src/main.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tu-app.vercel.app"],  # Tu dominio de Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🐳 OPCIÓN 2: DOCKER EN VPS

### A. Preparar VPS

```bash
# Conectar a tu VPS
ssh root@tu-ip

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### B. Clonar y Desplegar

```bash
# Clonar repositorio
git clone https://github.com/TU-USUARIO/tairos-v1.git
cd tairos-v1

# Crear archivo .env
cp .env.example .env
# Editar .env con tus credenciales

# Desplegar
./deploy.sh production
```

### C. Configurar Nginx y SSL

```bash
# Instalar Certbot para SSL
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tudominio.com
```

---

## 🌐 OPCIÓN 3: TODO EN RAILWAY

1. **Crear 2 servicios en Railway:**
   - Servicio 1: Frontend (root: `frontend`)
   - Servicio 2: Backend (root: `backend`)

2. **Variables de entorno** (igual que Opción 1)

3. **Deploy automático desde GitHub** ✅

---

## ✅ VERIFICACIÓN POST-DEPLOY

```bash
# Backend
curl https://tu-backend.railway.app/

# Frontend
curl https://tu-app.vercel.app/
```

---

## 🔧 MANTENIMIENTO

### Actualizar en Vercel/Railway:
```bash
git add .
git commit -m "Update"
git push origin main
# Deploy automático ✅
```

### Actualizar en VPS:
```bash
ssh root@tu-ip
cd tairos-v1
./deploy.sh production
```

---

## 🆘 TROUBLESHOOTING

### Error 500 en Backend:
- Verificar variables de entorno
- Revisar logs: `railway logs` o `docker logs tairos-backend`

### Frontend no conecta con Backend:
- Verificar CORS en backend
- Verificar NEXT_PUBLIC_API_URL

### Base de datos no conecta:
- Verificar DATABASE_URL
- Verificar IP whitelisting en Supabase

---

## 📊 COSTOS ESTIMADOS

| Opción | Costo Mensual | Pros |
|--------|---------------|------|
| Vercel + Railway | $5-10 | Fácil, rápido |
| VPS Docker | $5-20 | Control total |
| Todo Railway | $10-15 | Todo en un lugar |

---

## 🎯 RECOMENDACIÓN FINAL

Para desarrollo y MVP: **Vercel + Railway** ⭐

Para producción seria: **VPS con Docker** 🐳

---

¿Preguntas? Revisa los logs o contacta al equipo.
