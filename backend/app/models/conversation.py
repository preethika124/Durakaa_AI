from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field
from backend.app.models.environmental import EnvironmentalMetrics, EnvironmentalAnalysisResult

class ChatMessage(BaseModel):
    id: str
    role: str = Field(..., description="'user' or 'assistant'")
    content: str
    timestamp: str
    analysis: Optional[EnvironmentalAnalysisResult] = None
    clarification_prompt: Optional[List[str]] = None

class ConversationRecord(BaseModel):
    id: str
    title: str = "Environmental Inquiry"
    created_at: str
    updated_at: str
    environmental_profile: EnvironmentalMetrics = Field(default_factory=EnvironmentalMetrics)
    messages: List[ChatMessage] = Field(default_factory=list)

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    environmental_profile: Optional[EnvironmentalMetrics] = None

class ChatResponse(BaseModel):
    conversation_id: str
    analysis: str
    recommendations: List[Dict[str, Any]] = Field(default_factory=list)
    clarification_prompt: Optional[str] = None
    evidence: List[Dict[str, Any]] = Field(default_factory=list)
    causal_projection: Optional[Dict[str, Any]] = None

