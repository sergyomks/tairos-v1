from fastapi import APIRouter, BackgroundTasks, UploadFile, File, HTTPException, Header
from typing import Optional
from pydantic import BaseModel

from src.memory.infrastructure.repositories import InMemMemoryRepository
from src.memory.application.use_cases import IngestMemoryUseCase
from src.memory.infrastructure.vector_store import PgVectorDocumentStore
from src.memory.application.document_use_cases import IngestDocumentUseCase, QueryMemoryUseCase

router = APIRouter()
memory_repo = InMemMemoryRepository()
document_store = PgVectorDocumentStore()

MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB


class IngestDTO(BaseModel):
    content: str
    meta: dict


class ChatDTO(BaseModel):
    query: str


@router.post("/ingest")
async def ingest_memory(dto: IngestDTO):
    use_case = IngestMemoryUseCase(memory_repo)
    node = use_case.execute(dto.content, dto.meta)
    return {"id": str(node.id), "status": "ingested"}


@router.get("/documents")
async def list_documents():
    return document_store.list_documents()


@router.post("/documents/upload")
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    authorization: Optional[str] = Header(None),
):
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="El archivo supera el tamaño máximo de 15 MB")

    ingest_use_case = IngestDocumentUseCase(document_store)
    document_id = ingest_use_case.create_pending(
        name=file.filename,
        mime_type=file.content_type,
        size_bytes=len(content),
        uploaded_by=None,
    )

    background_tasks.add_task(
        ingest_use_case.process, document_id, file.filename, content, file.content_type
    )

    return {"id": document_id, "name": file.filename, "status": "processing"}


@router.post("/chat")
async def chat_with_memory(dto: ChatDTO, authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No autorizado")

    if not dto.query or not dto.query.strip():
        raise HTTPException(status_code=400, detail="La pregunta no puede estar vacía")

    try:
        use_case = QueryMemoryUseCase(document_store)
        return use_case.execute(dto.query)
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al procesar la consulta: {e}")
