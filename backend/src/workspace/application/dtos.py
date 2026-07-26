from pydantic import BaseModel
import uuid

class SendMessageDTO(BaseModel):
    sender_id: uuid.UUID
    content: str
