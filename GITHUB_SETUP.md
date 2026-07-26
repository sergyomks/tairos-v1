# Guía para Subir a GitHub

## Paso 1: Crear el Repositorio en GitHub

1. Ve a https://github.com
2. Click en el botón "+" (arriba derecha) → "New repository"
3. Configuración:
   - **Repository name**: `tairos-v1` (o el nombre que prefieras)
   - **Description**: "Sistema Operativo para Organizaciones Inteligentes"
   - **Visibility**: Private (recomendado) o Public
   - **NO marques** "Initialize this repository with a README"

4. Click en "Create repository"

## Paso 2: Conectar tu Repositorio Local

Después de crear el repositorio, GitHub te mostrará instrucciones. Usa estos comandos:

```bash
# Desde la raíz del proyecto (tairos-v1)
git remote add origin https://github.com/TU_USUARIO/tairos-v1.git
git push -u origin main
```

Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

## Paso 3: Verificar

Ve a tu repositorio en GitHub y verifica que todo el código esté ahí.

## Paso 4: Configurar Vercel

1. Ve a https://vercel.com
2. Click en "Add New..." → "Project"
3. Importa tu repositorio de GitHub
4. Configuración de build:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. Variables de entorno:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_API_URL=https://your-ngrok-url.ngrok-free.dev
   ```

6. Click en "Deploy"

## Notas Importantes

- ✅ Los archivos `.env` con credenciales NO se subieron a GitHub
- ✅ Los archivos `.env.example` SÍ se subieron como plantillas
- ⚠️ Nunca compartas tu repositorio si es público sin revisar antes
- ⚠️ Recuerda mantener el backend corriendo localmente con ngrok

## Troubleshooting

Si te pide autenticación al hacer `git push`:
- Usa GitHub CLI: `gh auth login`
- O configura un Personal Access Token
