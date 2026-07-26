import uuid
from typing import Optional
from src.core.domain.base_entity import BaseEntity

class Asset(BaseEntity):
    def __init__(self, name: str, type: str, content: str, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.name = name
        self.type = type # 'prompt', 'template', etc
        self.content = content
