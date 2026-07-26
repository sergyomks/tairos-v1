#!/bin/bash

# Script de despliegue para Tairos OS v1
# Uso: ./deploy.sh [production|staging]

ENV=${1:-production}

echo "🚀 Desplegando Tairos OS v1 en $ENV..."

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Build y deploy con Docker Compose
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "🔄 Stopping old containers..."
docker-compose -f docker-compose.prod.yml down

echo "🚀 Starting new containers..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deploy completo!"
echo "🌐 Frontend: http://localhost:3000"
echo "⚙️  Backend: http://localhost:8000"

# 3. Verificar salud
sleep 5
echo "🔍 Verificando servicios..."
curl -f http://localhost:8000/ && echo "✅ Backend OK" || echo "❌ Backend FAIL"
curl -f http://localhost:3000/ && echo "✅ Frontend OK" || echo "❌ Frontend FAIL"
