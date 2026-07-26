# Conector Mock para pgvector y LlamaIndex
class MockVectorStore:
    def add_node(self, node_id, content, embedding):
        pass
        
    def query(self, query_str, limit=5):
        return []
