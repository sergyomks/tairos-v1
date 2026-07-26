import uuid
from typing import Optional, List
from src.core.domain.base_entity import BaseEntity

class Agent(BaseEntity):
    def __init__(self, name: str, role: str, system_prompt: str, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
