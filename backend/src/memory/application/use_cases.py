from src.memory.domain.entities import MemoryNode
from src.memory.domain.repository_interfaces import MemoryRepositoryInterface

class IngestMemoryUseCase:
    def __init__(self, memory_repo: MemoryRepositoryInterface):
        self.memory_repo = memory_repo

    def execute(self, content: str, meta: dict):
        node = MemoryNode(content=content, meta=meta)
        self.memory_repo.save(node)
        return node
