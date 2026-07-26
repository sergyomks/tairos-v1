import abc
import uuid
from typing import Optional, List
from src.workspace.domain.entities import Channel

class ChannelRepositoryInterface(abc.ABC):
    @abc.abstractmethod
    def save(self, channel: Channel) -> None:
        pass

    @abc.abstractmethod
    def find_by_id(self, id: uuid.UUID) -> Optional[Channel]:
        pass

    @abc.abstractmethod
    def list_all(self) -> List[Channel]:
        pass
