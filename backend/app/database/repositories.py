import json
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
import uuid

from backend.app.database.connection import get_db_connection
from backend.app.models.environmental import EnvironmentalMetrics, EvidenceItem
from backend.app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from backend.app.models.conversation import ConversationRecord, ChatMessage

class KnowledgeRepository:
    def save_document(self, doc: Dict[str, Any], embedding: Optional[List[float]] = None):
        conn = get_db_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO knowledge_documents (
                id, topic, domain, problem, description, mechanisms,
                affects_metrics, conditions, expected_time_horizon,
                time_horizon_detail, evidence, embedding, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            doc["id"],
            doc["topic"],
            doc["domain"],
            doc["problem"],
            doc["description"],
            json.dumps(doc.get("mechanisms", [])),
            json.dumps(doc.get("affects_metrics", [])),
            json.dumps(doc.get("conditions", {})),
            doc.get("expected_time_horizon", ""),
            doc.get("time_horizon_detail", ""),
            json.dumps(doc.get("evidence", [])),
            json.dumps(embedding) if embedding else None,
            now
        ))
        conn.commit()
        conn.close()

    def get_all_documents(self) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM knowledge_documents ORDER BY domain, topic")
        rows = cursor.fetchall()
        conn.close()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "topic": r["topic"],
                "domain": r["domain"],
                "problem": r["problem"],
                "description": r["description"],
                "mechanisms": json.loads(r["mechanisms"] or "[]"),
                "affects_metrics": json.loads(r["affects_metrics"] or "[]"),
                "conditions": json.loads(r["conditions"] or "{}"),
                "expected_time_horizon": r["expected_time_horizon"],
                "time_horizon_detail": r["time_horizon_detail"],
                "evidence": json.loads(r["evidence"] or "[]"),
                "embedding": json.loads(r["embedding"]) if r["embedding"] else None,
            })
        return results

    def get_document_by_id(self, doc_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM knowledge_documents WHERE id = ?", (doc_id,))
        r = cursor.fetchone()
        conn.close()
        if not r:
            return None
        return {
            "id": r["id"],
            "topic": r["topic"],
            "domain": r["domain"],
            "problem": r["problem"],
            "description": r["description"],
            "mechanisms": json.loads(r["mechanisms"] or "[]"),
            "affects_metrics": json.loads(r["affects_metrics"] or "[]"),
            "conditions": json.loads(r["conditions"] or "{}"),
            "expected_time_horizon": r["expected_time_horizon"],
            "time_horizon_detail": r["time_horizon_detail"],
            "evidence": json.loads(r["evidence"] or "[]"),
            "embedding": json.loads(r["embedding"]) if r["embedding"] else None,
        }

    def save_chunk(self, chunk: Dict[str, Any], embedding: List[float]):
        conn = get_db_connection()
        cursor = conn.cursor()
        c_id = chunk.get("id") or chunk.get("chunk_id", "")
        c_content = chunk.get("content") or chunk.get("chunk_content", "")
        cursor.execute("""
            INSERT OR REPLACE INTO knowledge_chunks (
                id, document_id, topic, domain, content, metrics,
                source, source_url, publication_year, metadata, embedding
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            c_id,
            chunk["document_id"],
            chunk["topic"],
            chunk["domain"],
            c_content,
            json.dumps(chunk.get("metrics", [])),
            chunk["source"],
            chunk["source_url"],
            str(chunk.get("publication_year", "")),
            json.dumps(chunk.get("metadata", {})),
            json.dumps(embedding)
        ))
        conn.commit()
        conn.close()

    def get_all_chunks(self) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM knowledge_chunks")
        rows = cursor.fetchall()
        conn.close()
        results = []
        for r in rows:
            results.append({
                "id": r["id"],
                "document_id": r["document_id"],
                "topic": r["topic"],
                "domain": r["domain"],
                "content": r["content"],
                "metrics": json.loads(r["metrics"] or "[]"),
                "source": r["source"],
                "source_url": r["source_url"],
                "publication_year": r["publication_year"],
                "metadata": json.loads(r["metadata"] or "{}"),
                "embedding": json.loads(r["embedding"]) if r["embedding"] else []
            })
        return results

    def count_documents(self) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM knowledge_documents")
        row = cursor.fetchone()
        conn.close()
        return row["cnt"] if row else 0

    def count_chunks(self) -> int:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as cnt FROM knowledge_chunks")
        row = cursor.fetchone()
        conn.close()
        return row["cnt"] if row else 0

class ConversationRepository:
    def get_conversation(self, conv_id: str) -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return None
        cursor.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conv_id,))
        msg_rows = cursor.fetchall()
        messages = []
        for m in msg_rows:
            messages.append({
                "id": m["id"],
                "role": m["role"],
                "content": m["content"],
                "analysis": json.loads(m["analysis"]) if m["analysis"] else None,
                "clarification_prompt": json.loads(m["clarification_prompt"]) if m["clarification_prompt"] else None,
                "created_at": m["created_at"]
            })
        conn.close()
        return {
            "id": row["id"],
            "title": row["title"],
            "environmental_profile": json.loads(row["environmental_profile"] or "{}"),
            "created_at": row["created_at"],
            "updated_at": row["updated_at"],
            "messages": messages
        }

    def get_messages(self, conv_id: str) -> List[Dict[str, Any]]:
        c = self.get_conversation(conv_id)
        return c["messages"] if c else []

    def create_conversation(self, conv_id: str, title: str = "Environmental Inquiry", profile: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO conversations (id, title, environmental_profile, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (conv_id, title, json.dumps(profile or {}), now, now))
        conn.commit()
        conn.close()
        return {
            "id": conv_id,
            "title": title,
            "environmental_profile": profile or {},
            "created_at": now,
            "updated_at": now,
            "messages": []
        }

    def get_or_create_conversation(self, conv_id: Optional[str] = None) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        if not conv_id:
            conv_id = f"conv_{uuid.uuid4().hex[:12]}"

        cursor.execute("SELECT * FROM conversations WHERE id = ?", (conv_id,))
        row = cursor.fetchone()
        if not row:
            cursor.execute("""
                INSERT INTO conversations (id, title, environmental_profile, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?)
            """, (conv_id, "Biodiversity Consultation", "{}", now, now))
            conn.commit()
            record = {
                "id": conv_id,
                "title": "Biodiversity Consultation",
                "environmental_profile": {},
                "created_at": now,
                "updated_at": now,
                "messages": []
            }
        else:
            cursor.execute("SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC", (conv_id,))
            msg_rows = cursor.fetchall()
            messages = []
            for m in msg_rows:
                messages.append({
                    "id": m["id"],
                    "role": m["role"],
                    "content": m["content"],
                    "analysis": json.loads(m["analysis"]) if m["analysis"] else None,
                    "clarification_prompt": json.loads(m["clarification_prompt"]) if m["clarification_prompt"] else None,
                    "created_at": m["created_at"]
                })
            record = {
                "id": row["id"],
                "title": row["title"],
                "environmental_profile": json.loads(row["environmental_profile"] or "{}"),
                "created_at": row["created_at"],
                "updated_at": row["updated_at"],
                "messages": messages
            }

        conn.close()
        return record

    def update_profile(self, conv_id: str, profile_update: Dict[str, Any]):
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT environmental_profile FROM conversations WHERE id = ?", (conv_id,))
        row = cursor.fetchone()
        current_profile = json.loads(row["environmental_profile"] or "{}") if row else {}
        # Merge non-null fields
        for k, v in profile_update.items():
            if v is not None and v != "":
                current_profile[k] = v

        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            UPDATE conversations
            SET environmental_profile = ?, updated_at = ?
            WHERE id = ?
        """, (json.dumps(current_profile), now, conv_id))
        conn.commit()
        conn.close()
        return current_profile

    def add_message(self, conv_id: str, role: str, content: str, analysis: Optional[Dict[str, Any]] = None, clarification_prompt: Optional[List[str]] = None) -> Dict[str, Any]:
        conn = get_db_connection()
        cursor = conn.cursor()
        msg_id = f"msg_{uuid.uuid4().hex[:12]}"
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO messages (id, conversation_id, role, content, analysis, clarification_prompt, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            msg_id,
            conv_id,
            role,
            content,
            json.dumps(analysis) if analysis else None,
            json.dumps(clarification_prompt) if clarification_prompt else None,
            now
        ))
        cursor.execute("UPDATE conversations SET updated_at = ? WHERE id = ?", (now, conv_id))
        conn.commit()
        conn.close()
        return {
            "id": msg_id,
            "role": role,
            "content": content,
            "analysis": analysis,
            "clarification_prompt": clarification_prompt,
            "created_at": now
        }

    def list_conversations(self) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 30")
        rows = cursor.fetchall()
        conn.close()
        res = []
        for r in rows:
            res.append({
                "id": r["id"],
                "title": r["title"],
                "environmental_profile": json.loads(r["environmental_profile"] or "{}"),
                "created_at": r["created_at"],
                "updated_at": r["updated_at"]
            })
        return res

class RetrievalLogRepository:
    def log_retrieval(self, query: str, retrieved_docs: List[str], similarity_scores: List[float]):
        conn = get_db_connection()
        cursor = conn.cursor()
        log_id = f"ret_{uuid.uuid4().hex[:10]}"
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT INTO retrieval_logs (id, query, retrieved_documents, similarity_scores, timestamp)
            VALUES (?, ?, ?, ?, ?)
        """, (
            log_id,
            query,
            json.dumps(retrieved_docs),
            json.dumps(similarity_scores),
            now
        ))
        conn.commit()
        conn.close()

    def get_recent_logs(self, limit: int = 15) -> List[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM retrieval_logs ORDER BY timestamp DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        conn.close()
        res = []
        for r in rows:
            res.append({
                "id": r["id"],
                "query": r["query"],
                "retrieved_documents": json.loads(r["retrieved_documents"] or "[]"),
                "similarity_scores": json.loads(r["similarity_scores"] or "[]"),
                "timestamp": r["timestamp"]
            })
        return res

class ProfileRepository:
    def get_profile(self, profile_id: str = "active") -> Optional[Dict[str, Any]]:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM environmental_profiles WHERE id = ?", (profile_id,))
        r = cursor.fetchone()
        conn.close()
        if not r:
            return None
        return {
            "id": r["id"],
            "profile_name": r["profile_name"],
            "region": r["region"],
            "country": r["country"],
            "latitude": r["latitude"],
            "longitude": r["longitude"],
            "climate_zone": r["climate_zone"],
            "metrics": json.loads(r["metrics"] or "{}"),
            "updated_at": r["updated_at"]
        }

    def save_profile(self, profile_data: Dict[str, Any]):
        conn = get_db_connection()
        cursor = conn.cursor()
        now = datetime.now(timezone.utc).isoformat()
        cursor.execute("""
            INSERT OR REPLACE INTO environmental_profiles (
                id, profile_name, region, country, latitude, longitude,
                climate_zone, metrics, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            profile_data.get("id", "active"),
            profile_data.get("profile_name", "Default Profile"),
            profile_data.get("region", "Global"),
            profile_data.get("country", "Global"),
            float(profile_data.get("latitude", 0.0)),
            float(profile_data.get("longitude", 0.0)),
            profile_data.get("climate_zone", "Temperate"),
            json.dumps(profile_data.get("metrics", {})),
            now
        ))
        conn.commit()
        conn.close()

knowledge_repo = KnowledgeRepository()
conversation_repo = ConversationRepository()
retrieval_log_repo = RetrievalLogRepository()
profile_repo = ProfileRepository()

