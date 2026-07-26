import uuid
from typing import Optional, Dict
from src.core.domain.base_entity import BaseEntity

class MemoryNode(BaseEntity):
    def __init__(self, content: str, meta: Dict, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.content = content
        self.meta = meta
