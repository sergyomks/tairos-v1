from typing import List
from openai import OpenAI
from src.config import settings

EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o-mini"


def _get_client() -> OpenAI:
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY == "mock-key":
        raise RuntimeError(
            "OPENAI_API_KEY no está configurada en backend/.env. "
            "Agrega tu API key de OpenAI para usar el chat RAG."
        )
    return OpenAI(api_key=settings.OPENAI_API_KEY)


def get_embedding(text: str) -> List[float]:
    client = _get_client()
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


def get_embeddings_batch(texts: List[str]) -> List[List[float]]:
    if not texts:
        return []
    client = _get_client()
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=texts)
    return [item.embedding for item in response.data]


def generate_answer(question: str, context_chunks: List[str]) -> str:
    client = _get_client()

    if context_chunks:
        context_text = "\n\n---\n\n".join(context_chunks)
        system_prompt = (
            "Eres el Asistente RAG de Tairos OS. Respondes preguntas usando "
            "únicamente la información de contexto proporcionada, extraída de la "
            "memoria organizacional (documentos, decisiones, conversaciones). "
            "Si el contexto no contiene la respuesta, dilo claramente en vez de inventar. "
            "Responde en español, de forma clara y concisa."
        )
        user_prompt = f"Contexto:\n{context_text}\n\nPregunta: {question}"
    else:
        system_prompt = (
            "Eres el Asistente RAG de Tairos OS. No se encontró contexto relevante "
            "en la memoria organizacional para esta pregunta. Indícalo con claridad."
        )
        user_prompt = question

    response = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content or ""
