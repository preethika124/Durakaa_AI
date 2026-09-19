"""
Chunker and Metadata Extractor for DARUKAA.EARTH
Splits environmental knowledge documents into dense semantic chunks with enriched metadata.
"""
from typing import List, Dict, Any

class KnowledgeChunker:
    @staticmethod
    def chunk_document(doc: Dict[str, Any]) -> List[Dict[str, Any]]:
        chunks = []
        doc_id = doc["id"]
        topic = doc["topic"]
        domain = doc["domain"]
        problem = doc.get("problem", "")
        description = doc.get("description", "")
        mechanisms = doc.get("mechanisms", [])
        affects_metrics = doc.get("affects_metrics", [])
        conditions = doc.get("conditions", {})
        time_detail = doc.get("time_horizon_detail", "")
        evidence_list = doc.get("evidence", [])

        # Chunk 1: Diagnostic overview (Problem + Description + Affected Metrics)
        chunk1_text = (
            f"Topic: {topic}. Domain: {domain}.\n"
            f"Environmental Problem: {problem}\n"
            f"Ecosystem Description: {description}\n"
            f"Affected Metrics: {', '.join(affects_metrics)}.\n"
            f"Climatic & Soil Conditions: {conditions}"
        )
        c1_id = f"{doc_id}_c1_diag"
        chunks.append({
            "id": c1_id,
            "chunk_id": c1_id,
            "document_id": doc_id,
            "topic": topic,
            "domain": domain,
            "content": chunk1_text,
            "chunk_content": chunk1_text,
            "metrics": affects_metrics,
            "source": evidence_list[0]["source"] if evidence_list else "Ecological Literature",
            "source_url": evidence_list[0].get("url", "") if evidence_list else "",
            "publication_year": str(evidence_list[0].get("publication_year", "2020")) if evidence_list else "2020",
            "metadata": {
                "chunk_type": "diagnostic_overview",
                "time_horizon": doc.get("expected_time_horizon", "medium_term"),
                "time_detail": time_detail,
                "conditions": conditions
            }
        })

        # Chunk 2: Scientific Mechanisms (How & Why it works)
        mechanisms_text = " ".join([f"• {m}" for m in mechanisms])
        chunk2_text = (
            f"Topic: {topic} (Scientific Mechanisms).\n"
            f"How it works: {mechanisms_text}\n"
            f"Time Horizon for Impact: {time_detail}\n"
            f"Governed Metrics: {', '.join(affects_metrics)}."
        )
        c2_id = f"{doc_id}_c2_mech"
        chunks.append({
            "id": c2_id,
            "chunk_id": c2_id,
            "document_id": doc_id,
            "topic": topic,
            "domain": domain,
            "content": chunk2_text,
            "chunk_content": chunk2_text,
            "metrics": affects_metrics,
            "source": evidence_list[0]["source"] if evidence_list else "Ecological Literature",
            "source_url": evidence_list[0].get("url", "") if evidence_list else "",
            "publication_year": str(evidence_list[0].get("publication_year", "2020")) if evidence_list else "2020",
            "metadata": {
                "chunk_type": "mechanisms",
                "time_horizon": doc.get("expected_time_horizon", "medium_term"),
                "time_detail": time_detail
            }
        })

        # Chunk 3..N: Dedicated Evidence Items
        for idx, ev in enumerate(evidence_list):
            ev_text = (
                f"Topic: {topic}. Evidence Source: {ev['source']} ({ev.get('publication_year', '')}).\n"
                f"Title: {ev['title']}\n"
                f"Summary: {ev['evidence_summary']}\n"
                f"Relevance: {ev['relevance']}\n"
                f"Evidence Type: {ev.get('evidence_type', 'peer_reviewed_paper')}"
            )
            c_ev_id = f"{doc_id}_c_ev_{idx}"
            chunks.append({
                "id": c_ev_id,
                "chunk_id": c_ev_id,
                "document_id": doc_id,
                "topic": topic,
                "domain": domain,
                "content": ev_text,
                "chunk_content": ev_text,
                "metrics": affects_metrics,
                "source": ev["source"],
                "source_url": ev.get("url", ""),
                "publication_year": str(ev.get("publication_year", "2020")),
                "metadata": {
                    "chunk_type": "evidence",
                    "evidence_item": ev,
                    "credibility_weight": ev.get("credibility_weight", 0.95)
                }
            })

        return chunks
