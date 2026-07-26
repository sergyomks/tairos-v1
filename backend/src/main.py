from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.config import settings
from src.workspace.presentation.routers import router as workspace_router
from src.memory.presentation.routers import router as memory_router
from src.orchestration.presentation.routers import router as orchestration_router
from src.core.auth_router import router as auth_router

app = FastAPI(
    title="Tairos OS v1 API",
    description="Sistema Operativo para Organizaciones Inteligentes - Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",  # Permitir todos los orígenes (solo para desarrollo)
        "https://*.vercel.app",  # Tu dominio de Vercel
        "https://*.ngrok-free.app",  # ngrok
        "http://localhost:3000"  # Local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de los Bounded Contexts
app.include_router(workspace_router, prefix="/api/v1/workspace", tags=["Workspace"])
app.include_router(memory_router, prefix="/api/v1/memory", tags=["Memory"])
app.include_router(orchestration_router, prefix="/api/v1/orchestration", tags=["Orchestration"])
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Auth"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "app": "Tairos OS API",
        "version": "1.0.0"
    }
