from typing import List
from src.memory.domain.entities import MemoryNode
from src.memory.domain.repository_interfaces import MemoryRepositoryInterface

class InMemMemoryRepository(MemoryRepositoryInterface):
    def __init__(self):
        self.nodes = []

    def save(self, node: MemoryNode) -> None:
        self.nodes.append(node)

    def search_vector(self, query: str, limit: int = 5) -> List[MemoryNode]:
        # Búsqueda textual básica de mock
        results = [n for n in self.nodes if query.lower() in n.content.lower()]
        return results[:limit]
