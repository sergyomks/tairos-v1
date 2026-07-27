import io
from typing import List

CHUNK_SIZE = 1000
CHUNK_OVERLAP = 150


def extract_text(filename: str, content: bytes, mime_type: str) -> str:
    lower_name = filename.lower()

    if lower_name.endswith(".pdf") or mime_type == "application/pdf":
        return _extract_pdf(content)

    if lower_name.endswith(".docx"):
        return _extract_docx(content)

    if lower_name.endswith((".txt", ".md")) or (mime_type or "").startswith("text/"):
        return content.decode("utf-8", errors="ignore")

    # Fallback: intentar decodificar como texto plano
    try:
        return content.decode("utf-8", errors="ignore")
    except Exception:
        raise ValueError(f"Formato de archivo no soportado: {filename}")


def _extract_pdf(content: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(content))
    pages_text = [page.extract_text() or "" for page in reader.pages]
    return "\n\n".join(pages_text)


def _extract_docx(content: bytes) -> str:
    from docx import Document

    document = Document(io.BytesIO(content))
    paragraphs = [p.text for p in document.paragraphs]
    return "\n".join(paragraphs)


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    text = text.strip()
    if not text:
        return []

    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        if end == text_len:
            break
        start = end - overlap

    return chunks
