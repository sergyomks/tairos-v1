#!/bin/bash

# Script para ejecutar backend local con ngrok
# Uso: ./run-backend-with-ngrok.sh

echo "🚀 Iniciando backend local con túnel ngrok..."

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar si ngrok está instalado
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok no está instalado"
    echo "Instálalo con: sudo snap install ngrok"
    exit 1
fi

# 2. Activar entorno virtual y ejecutar backend en background
echo "📦 Activando entorno virtual..."
cd backend
source venv/bin/activate

echo "⚙️ Iniciando backend en puerto 8000..."
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Esperar a que el backend inicie
sleep 3

# 3. Iniciar ngrok
echo ""
echo "🌐 Creando túnel público con ngrok..."
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ Backend corriendo localmente en: http://localhost:8000${NC}"
echo -e "${BLUE}🌍 Copia la URL de ngrok que aparece abajo y úsala en Vercel${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

ngrok http 8000

# Cuando se cierra ngrok, matar el backend
echo "🛑 Cerrando backend..."
kill $BACKEND_PID
