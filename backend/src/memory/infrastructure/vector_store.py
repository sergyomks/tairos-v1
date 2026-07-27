import uuid
from typing import List, Optional, Dict, Any

from sqlalchemy import text
from src.core.infrastructure.database import engine


def _to_pgvector(embedding: List[float]) -> str:
    return "[" + ",".join(str(x) for x in embedding) + "]"


class PgVectorDocumentStore:
    """Almacén de documentos y fragmentos (chunks) con búsqueda vectorial real sobre pgvector."""

    def create_document(
        self,
        name: str,
        mime_type: Optional[str],
        size_bytes: Optional[int],
        uploaded_by: Optional[str],
    ) -> str:
        document_id = str(uuid.uuid4())
        with engine.connect() as conn:
            conn.execute(
                text(
                    """
                    INSERT INTO documents (id, name, mime_type, size_bytes, status, uploaded_by)
                    VALUES (:id, :name, :mime_type, :size_bytes, 'processing', :uploaded_by)
                    """
                ),
                {
                    "id": document_id,
                    "name": name,
                    "mime_type": mime_type,
                    "size_bytes": size_bytes,
                    "uploaded_by": uploaded_by,
                },
            )
            conn.commit()
        return document_id

    def mark_indexed(self, document_id: str, content_preview: str) -> None:
        with engine.connect() as conn:
            conn.execute(
                text(
                    """
                    UPDATE documents
                    SET status = 'indexed', content = :content
                    WHERE id = :id
                    """
                ),
                {"id": document_id, "content": content_preview},
            )
            conn.commit()

    def mark_error(self, document_id: str, error_message: str) -> None:
        with engine.connect() as conn:
            conn.execute(
                text(
                    """
                    UPDATE documents
                    SET status = 'error', error_message = :error_message
                    WHERE id = :id
                    """
                ),
                {"id": document_id, "error_message": error_message[:2000]},
            )
            conn.commit()

    def save_chunks(self, document_id: str, chunks: List[str], embeddings: List[List[float]]) -> None:
        with engine.connect() as conn:
            for idx, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                conn.execute(
                    text(
                        """
                        INSERT INTO document_chunks (document_id, chunk_index, content, embedding)
                        VALUES (:document_id, :chunk_index, :content, CAST(:embedding AS vector))
                        """
                    ),
                    {
                        "document_id": document_id,
                        "chunk_index": idx,
                        "content": chunk,
                        "embedding": _to_pgvector(embedding),
                    },
                )
            conn.commit()

    def list_documents(self) -> List[Dict[str, Any]]:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT id, name, mime_type, size_bytes, status, error_message, created_at
                    FROM documents
                    ORDER BY created_at DESC
                    """
                )
            ).mappings().all()
        return [dict(row) for row in rows]

    def search_similar_chunks(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        with engine.connect() as conn:
            rows = conn.execute(
                text(
                    """
                    SELECT
                        dc.content,
                        dc.chunk_index,
                        d.name AS document_name,
                        1 - (dc.embedding <=> CAST(:embedding AS vector)) AS similarity
                    FROM document_chunks dc
                    JOIN documents d ON d.id = dc.document_id
                    WHERE dc.embedding IS NOT NULL
                    ORDER BY dc.embedding <=> CAST(:embedding AS vector)
                    LIMIT :limit
                    """
                ),
                {"embedding": _to_pgvector(query_embedding), "limit": limit},
            ).mappings().all()
        return [dict(row) for row in rows]
