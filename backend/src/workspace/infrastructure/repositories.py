import uuid
from typing import Optional, List
from src.workspace.domain.entities import Channel
from src.workspace.domain.repository_interfaces import ChannelRepositoryInterface

class InMemChannelRepository(ChannelRepositoryInterface):
    def __init__(self):
        self.channels = {}

    def save(self, channel: Channel) -> None:
        self.channels[channel.id] = channel

    def find_by_id(self, id: uuid.UUID) -> Optional[Channel]:
        return self.channels.get(id)

    def list_all(self) -> List[Channel]:
        return list(self.channels.values())
