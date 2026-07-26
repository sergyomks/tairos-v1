from fastapi import APIRouter, Depends, HTTPException
import uuid
from src.workspace.application.use_cases import SendMessageUseCase
from src.workspace.application.dtos import SendMessageDTO
from src.workspace.infrastructure.repositories import InMemChannelRepository
from src.workspace.domain.entities import Channel

router = APIRouter()

# Instancia compartida en memoria para demo/scaffolding
channel_repo = InMemChannelRepository()

# Agregar canal por defecto
default_channel_id = uuid.UUID("00000000-0000-0000-0000-000000000000")
default_channel = Channel(name="General", id=default_channel_id)
channel_repo.save(default_channel)

@router.post("/channels/{channel_id}/messages")
async def send_message(channel_id: uuid.UUID, dto: SendMessageDTO):
    use_case = SendMessageUseCase(channel_repo)
    try:
        msg = use_case.execute(channel_id, dto.sender_id, dto.content)
        return {"id": str(msg.id), "content": msg.content, "created_at": msg.created_at}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/channels")
async def list_channels():
    return [{"id": str(c.id), "name": c.name} for c in channel_repo.list_all()]
