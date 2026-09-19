from typing import List, Dict, Any, Optional
import re
from backend.app.database.repositories import knowledge_repo, retrieval_log_repo
from backend.app.services.embedding_service import embedding_service
from backend.app.models.knowledge import KnowledgeChunk, EvidenceItem

class RAGService:
    def __init__(self):
        pass

    def retrieve(
        self,
        query: str,
        domain_filter: Optional[str] = None,
        metric_filters: Optional[List[str]] = None,
        top_k: int = 5,
        min_similarity: float = 0.35
    ) -> List[Dict[str, Any]]:
        """
        Executes hybrid vector + lexical retrieval over knowledge chunks:
        1. Dense vector cosine similarity
        2. Lexical keyword matching boost
        3. Domain & metric metadata filtering
        4. Evidence credibility weighting
        """
        all_chunks = knowledge_repo.get_all_chunks()
        if not all_chunks:
            return []

        query_vec = embedding_service.generate_embedding(query)
        query_words = set(re.findall(r'\b[a-z0-9_\-]+\b', query.lower()))

        scored_chunks = []
        for chunk in all_chunks:
            # 1. Domain filter
            if domain_filter and domain_filter.lower() != "all":
                if chunk["domain"].lower() != domain_filter.lower():
                    continue

            # 2. Metric filter
            if metric_filters:
                chunk_metrics = [m.lower() for m in chunk.get("metrics", [])]
                if not any(mf.lower() in chunk_metrics for mf in metric_filters):
                    # Slight penalty or skip if strict
                    pass

            chunk_vec = chunk.get("embedding", [])
            if not chunk_vec:
                continue

            # Vector cosine similarity [0.0 - 1.0]
            sim = embedding_service.cosine_similarity(query_vec, chunk_vec)

            # Lexical keyword match bonus
            content_lower = chunk["content"].lower()
            topic_lower = chunk["topic"].lower()
            matches = sum(1 for w in query_words if len(w) > 3 and (w in content_lower or w in topic_lower))
            lexical_bonus = min(0.20, matches * 0.04)

            # Evidence credibility bonus
            metadata = chunk.get("metadata", {})
            credibility = metadata.get("credibility_weight", 0.90)
            credibility_bonus = (credibility - 0.85) * 0.15 if credibility > 0.85 else 0

            final_score = sim * 0.70 + lexical_bonus * 0.20 + credibility_bonus * 0.10

            if final_score >= min_similarity or len(scored_chunks) < 3:
                scored_chunks.append({
                    "chunk": chunk,
                    "similarity": round(float(sim), 4),
                    "final_score": round(float(final_score), 4)
                })

        # Sort by final score descending
        scored_chunks.sort(key=lambda x: x["final_score"], reverse=True)
        top_results = scored_chunks[:top_k]

        # Log retrieval operation for scientific transparency
        retrieved_ids = [r["chunk"]["id"] for r in top_results]
        scores = [r["final_score"] for r in top_results]
        retrieval_log_repo.log_retrieval(query, retrieved_ids, scores)

        return top_results

    def format_context_for_prompt(self, retrieved_results: List[Dict[str, Any]]) -> str:
        """
        Formats retrieved knowledge chunks and scientific citations into an enriched context block.
        """
        if not retrieved_results:
            return "No specific environmental documents matched the query criteria."

        context_lines = ["=== RETRIEVED SCIENTIFIC EVIDENCE & ECOLOGICAL KNOWLEDGE ==="]
        for i, res in enumerate(retrieved_results, 1):
            chunk = res["chunk"]
            context_lines.append(
                f"\n[Source #{i}] {chunk['topic']} ({chunk['domain']}) | Score: {res['final_score']}\n"
                f"Source Citation: {chunk['source']} ({chunk['publication_year']}) - URL: {chunk['source_url']}\n"
                f"Affected Environmental Metrics: {', '.join(chunk.get('metrics', []))}\n"
                f"Content & Scientific Findings:\n{chunk['content']}"
            )
        context_lines.append("\n=== END OF SCIENTIFIC EVIDENCE ===")
        return "\n".join(context_lines)

rag_service = RAGService()
