import abc
from typing import List
from src.memory.domain.entities import MemoryNode

class MemoryRepositoryInterface(abc.ABC):
    @abc.abstractmethod
    def save(self, node: MemoryNode) -> None:
        pass

    @abc.abstractmethod
    def search_vector(self, query: str, limit: int = 5) -> List[MemoryNode]:
        pass
