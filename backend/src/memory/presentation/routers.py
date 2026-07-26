from fastapi import APIRouter
from pydantic import BaseModel
from src.memory.infrastructure.repositories import InMemMemoryRepository
from src.memory.application.use_cases import IngestMemoryUseCase

router = APIRouter()
memory_repo = InMemMemoryRepository()

class IngestDTO(BaseModel):
    content: str
    meta: dict

@router.post("/ingest")
async def ingest_memory(dto: IngestDTO):
    use_case = IngestMemoryUseCase(memory_repo)
    node = use_case.execute(dto.content, dto.meta)
    return {"id": str(node.id), "status": "ingested"}
