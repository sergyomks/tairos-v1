import uuid
from typing import List, Optional
from src.core.domain.base_entity import BaseEntity

class Participant(BaseEntity):
    def __init__(self, name: str, role: str, is_agent: bool, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.name = name
        self.role = role
        self.is_agent = is_agent

class Message(BaseEntity):
    def __init__(self, sender_id: uuid.UUID, content: str, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.sender_id = sender_id
        self.content = content

class Channel(BaseEntity):
    def __init__(self, name: str, id: Optional[uuid.UUID] = None):
        super().__init__(id)
        self.name = name
        self.messages: List[Message] = []
        self.participants: List[Participant] = []

    def add_message(self, message: Message):
        self.messages.append(message)
        self.update()

    def add_participant(self, participant: Participant):
        self.participants.append(participant)
        self.update()
