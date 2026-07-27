from typing import Optional
from src.memory.infrastructure.vector_store import PgVectorDocumentStore
from src.memory.infrastructure.document_parser import extract_text, chunk_text
from src.memory.infrastructure import llm_client


class IngestDocumentUseCase:
    """Orquesta la extracción, fragmentación e indexado vectorial de un documento subido."""

    def __init__(self, store: PgVectorDocumentStore):
        self.store = store

    def create_pending(
        self,
        name: str,
        mime_type: Optional[str],
        size_bytes: Optional[int],
        uploaded_by: Optional[str],
    ) -> str:
        return self.store.create_document(name, mime_type, size_bytes, uploaded_by)

    def process(self, document_id: str, filename: str, content: bytes, mime_type: Optional[str]) -> None:
        try:
            text_content = extract_text(filename, content, mime_type or "")
            chunks = chunk_text(text_content)

            if not chunks:
                self.store.mark_error(document_id, "No se pudo extraer texto del documento.")
                return

            embeddings = llm_client.get_embeddings_batch(chunks)
            self.store.save_chunks(document_id, chunks, embeddings)

            preview = text_content[:5000]
            self.store.mark_indexed(document_id, preview)
        except Exception as e:
            self.store.mark_error(document_id, str(e))


class QueryMemoryUseCase:
    """Responde preguntas usando RAG: busca chunks relevantes y genera una respuesta con LLM."""

    def __init__(self, store: PgVectorDocumentStore):
        self.store = store

    def execute(self, question: str, limit: int = 5) -> dict:
        query_embedding = llm_client.get_embedding(question)
        matches = self.store.search_similar_chunks(query_embedding, limit=limit)

        context_chunks = [m["content"] for m in matches]
        answer = llm_client.generate_answer(question, context_chunks)

        sources = [
            {
                "document_name": m["document_name"],
                "similarity": round(float(m["similarity"]), 4),
            }
            for m in matches
        ]

        return {"answer": answer, "sources": sources}
