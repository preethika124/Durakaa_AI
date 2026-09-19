from typing import Dict, Any, List
from backend.app.ingestion.seed_data import ALL_SEED_KNOWLEDGE_DOCUMENTS
from backend.app.ingestion.chunker import KnowledgeChunker
from backend.app.services.embedding_service import embedding_service
from backend.app.database.repositories import knowledge_repo

def initialize_knowledge_base(force_reload: bool = False) -> Dict[str, Any]:
    """
    Ingests all structured environmental knowledge documents, chunks them,
    computes dense semantic vector embeddings, and stores them in the persistent repository.
    """
    existing_count = knowledge_repo.count_documents()
    if existing_count > 0 and not force_reload:
        return {
            "status": "already_initialized",
            "documents_count": existing_count,
            "chunks_count": knowledge_repo.count_chunks()
        }

    docs_loaded = 0
    chunks_loaded = 0

    for doc in ALL_SEED_KNOWLEDGE_DOCUMENTS:
        # 1. Embed parent document
        doc_text = f"{doc['topic']} {doc['problem']} {doc['description']} {' '.join(doc.get('affects_metrics', []))}"
        doc_embedding = embedding_service.generate_embedding(doc_text)
        knowledge_repo.save_document(doc, doc_embedding)
        docs_loaded += 1

        # 2. Chunk document into semantic segments
        chunks = KnowledgeChunker.chunk_document(doc)
        for chunk in chunks:
            c_text = chunk.get("content") or chunk.get("chunk_content", "")
            chunk_text = f"{chunk['topic']} {chunk['domain']} {c_text}"
            chunk_embedding = embedding_service.generate_embedding(chunk_text)
            knowledge_repo.save_chunk(chunk, chunk_embedding)
            chunks_loaded += 1

    return {
        "status": "success",
        "documents_loaded": docs_loaded,
        "chunks_loaded": chunks_loaded
    }
