from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field
from backend.app.models.environmental import EvidenceItem

class KnowledgeDocument(BaseModel):
    id: str
    topic: str
    domain: str = Field(..., description="Soil Health, Land Use, Biodiversity, Climate, Human Impact, Water")
    problem: str
    description: str
    mechanisms: List[str]
    affects_metrics: List[str]
    conditions: Dict[str, Any] = Field(default_factory=dict)
    expected_time_horizon: str
    time_horizon_detail: str
    evidence: List[EvidenceItem]
    embedding: Optional[List[float]] = None

class KnowledgeChunk(BaseModel):
    id: str
    document_id: str
    topic: str
    domain: str
    content: str
    metrics: List[str]
    source: str
    source_url: str
    publication_year: Union[int, str]
    embedding: Optional[List[float]] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class RetrievalLog(BaseModel):
    id: str
    query: str
    retrieved_documents: List[str]
    similarity_scores: List[float]
    timestamp: str
