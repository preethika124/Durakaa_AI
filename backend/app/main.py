import os
import json
import re
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.app.models.environmental import (
    EnvironmentalMetrics, EnvironmentalAnalysisResult, AnalysisRequest, ChatRequest
)
from backend.app.database.repositories import (
    knowledge_repo, conversation_repo, retrieval_log_repo
)
from backend.app.ingestion.document_loader import initialize_knowledge_base
from backend.app.services.rag_service import rag_service
from backend.app.services.gemini_service import gemini_service
from backend.app.services.causal_engine import causal_engine

app = FastAPI(
    title="DARUKAA.EARTH — AI Biodiversity Intelligence System",
    description="Scientific environmental research platform combining structured ecological knowledge bases, vector RAG retrieval, multi-metric causal reasoning, and evidence citations.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    """Ensure seed knowledge base is loaded on startup."""
    initialize_knowledge_base(force_reload=False)

@app.get("/api/health")
def health_check():
    doc_count = knowledge_repo.count_documents()
    chunk_count = knowledge_repo.count_chunks()
    return {
        "status": "healthy",
        "system": "DARUKAA.EARTH AI Biodiversity Intelligence",
        "documents_count": doc_count,
        "chunks_count": chunk_count,
        "database": "sqlite/persistent",
        "version": "1.0.0"
    }

@app.get("/api/documents")
def list_documents(
    domain: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50
):
    docs = knowledge_repo.get_all_documents()
    if domain and domain.lower() != "all":
        docs = [d for d in docs if d["domain"].lower() == domain.lower()]
    if search:
        s_lower = search.lower()
        docs = [
            d for d in docs
            if s_lower in d["topic"].lower()
            or s_lower in d["problem"].lower()
            or s_lower in d["description"].lower()
            or any(s_lower in m.lower() for m in d.get("affects_metrics", []))
        ]
    return {
        "total": len(docs),
        "documents": docs[:limit]
    }

@app.get("/api/documents/{doc_id}")
def get_document(doc_id: str = Path(..., description="The ID of the document")):
    doc = knowledge_repo.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Environmental document not found")
    return doc

def extract_parameters_from_text(text: str) -> Dict[str, Any]:
    """Heuristic extraction of environmental metrics mentioned in natural language text."""
    extracted = {}
    t_lower = text.lower()

    # pH e.g., "pH 6.5" or "pH of 5.8"
    ph_match = re.search(r'\bph\s*(?:of|is|=)?\s*([0-9]+(?:\.[0-9]+)?)\b', t_lower)
    if ph_match:
        extracted["soil_ph"] = float(ph_match.group(1))

    # Soil carbon e.g., "0.8% carbon" or "carbon of 1.2%"
    c_match = re.search(r'\b([0-9]+(?:\.[0-9]+)?)\s*%\s*(?:carbon|soc|organic matter|som)\b', t_lower)
    if c_match:
        extracted["soil_organic_carbon"] = float(c_match.group(1))

    # Rainfall e.g., "350mm rainfall" or "400 mm annual precipitation"
    rain_match = re.search(r'\b([0-9]{2,4})\s*(?:mm|millimeters)\b', t_lower)
    if rain_match:
        extracted["rainfall"] = float(rain_match.group(1))

    # Tillage mentions
    if "no-till" in t_lower or "zero till" in t_lower or "direct drill" in t_lower:
        extracted["tillage"] = "no-till"
    elif "conventional till" in t_lower or "plow" in t_lower or "plough" in t_lower:
        extracted["tillage"] = "conventional_deep"

    # Soil moisture mentions
    if "drought" in t_lower or "dry soil" in t_lower or "arid" in t_lower:
        extracted["soil_moisture"] = "low"
    elif "waterlogged" in t_lower or "ponding" in t_lower:
        extracted["soil_moisture"] = "high"

    return extracted

@app.post("/api/analyze")
def analyze_environment(req: AnalysisRequest):
    query = req.query or "Assess ecosystem restoration pathways and soil health."
    
    # Load or create conversation if id provided
    conv = conversation_repo.get_or_create_conversation(req.conversation_id)
    active_profile = dict(conv.get("environmental_profile", {}))
    
    # Merge incoming profile updates
    if req.environment:
        for k, v in req.environment.items():
            if v is not None and v != "":
                active_profile[k] = v
        conversation_repo.update_profile(conv["id"], active_profile)

    # Perform analysis
    result = gemini_service.analyze_environmental_query(
        query=query,
        environment=active_profile,
        location=req.location,
        conversation_history=conv.get("messages", [])
    )

    # Record interaction in conversation
    conversation_repo.add_message(
        conv_id=conv["id"],
        role="user",
        content=query
    )
    conversation_repo.add_message(
        conv_id=conv["id"],
        role="assistant",
        content=result.assessment,
        analysis=result.model_dump(),
        clarification_prompt=result.missing_information.priority_questions
    )

    return {
        "conversation_id": conv["id"],
        "analysis": result,
        "environmental_profile": active_profile
    }

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    conv = conversation_repo.get_or_create_conversation(req.conversation_id)
    active_profile = dict(conv.get("environmental_profile", {}))

    # Merge explicitly provided environment
    if req.environment:
        for k, v in req.environment.items():
            if v is not None and v != "":
                active_profile[k] = v

    # Extract implicit parameter mentions from the user's message
    inferred_metrics = extract_parameters_from_text(req.message)
    active_profile.update(inferred_metrics)
    conversation_repo.update_profile(conv["id"], active_profile)

    # Run analysis with context
    result = gemini_service.analyze_environmental_query(
        query=req.message,
        environment=active_profile,
        location=req.location,
        conversation_history=conv.get("messages", [])
    )

    # Save to history
    conversation_repo.add_message(
        conv_id=conv["id"],
        role="user",
        content=req.message
    )
    conversation_repo.add_message(
        conv_id=conv["id"],
        role="assistant",
        content=result.assessment,
        analysis=result.model_dump(),
        clarification_prompt=result.missing_information.priority_questions
    )

    return {
        "conversation_id": conv["id"],
        "message": result.assessment,
        "analysis": result,
        "environmental_profile": active_profile,
        "clarification_prompt": result.missing_information.priority_questions
    }

@app.get("/api/conversations")
def list_conversations():
    return conversation_repo.list_conversations()

@app.get("/api/conversations/{conv_id}")
def get_conversation(conv_id: str):
    conv = conversation_repo.get_or_create_conversation(conv_id)
    return conv

@app.post("/api/conversations/{conv_id}/profile")
def update_profile(conv_id: str, profile: Dict[str, Any]):
    updated = conversation_repo.update_profile(conv_id, profile)
    return {
        "conversation_id": conv_id,
        "environmental_profile": updated
    }

@app.get("/api/retrieval-logs")
def get_retrieval_logs(limit: int = 20):
    logs = retrieval_log_repo.get_recent_logs(limit=limit)
    return {"logs": logs}

class SimulationRequest(BaseModel):
    baseline_metrics: Dict[str, Any]
    proposed_interventions: List[str]

@app.post("/api/simulate")
def run_causal_simulation(req: SimulationRequest):
    metrics = EnvironmentalMetrics(**req.baseline_metrics)
    result = causal_engine.evaluate_interventions(
        baseline_metrics=metrics,
        proposed_interventions=req.proposed_interventions
    )
    return result

@app.get("/api/profiles")
def get_preset_profiles():
    return [
        {
            "id": "profile_semiarid_wheat",
            "profile_name": "Semi-Arid Rainfed Wheat Agroecosystem",
            "region": "Columbia Basin / Western Grain Belt",
            "country": "United States",
            "latitude": 45.8,
            "longitude": -119.5,
            "climate_zone": "Semi-arid continental (BSk)",
            "metrics": {
                "soil_organic_carbon": 0.85,
                "soil_moisture": "low",
                "soil_ph": 6.8,
                "soil_compaction": "moderate",
                "soil_erosion": "severe",
                "soil_microbial_activity": "low",
                "vegetation_cover": "sparse",
                "species_richness": "depleted",
                "biodiversity": "low",
                "pollinator_diversity": "low",
                "rainfall": 310.0,
                "temperature": 24.5,
                "drought_frequency": "frequent",
                "pesticide_use": "intensive",
                "tillage": "conventional_deep"
            }
        },
        {
            "id": "profile_sahel_dryland",
            "profile_name": "Sahelian Degraded Pastoral & Sorghum Belt",
            "region": "Northern Plateau",
            "country": "Burkina Faso",
            "latitude": 13.5,
            "longitude": -1.8,
            "climate_zone": "Tropical semi-arid (BSh)",
            "metrics": {
                "soil_organic_carbon": 0.42,
                "soil_moisture": "low",
                "soil_ph": 5.9,
                "soil_compaction": "high",
                "soil_erosion": "severe",
                "soil_microbial_activity": "low",
                "vegetation_cover": "sparse",
                "species_richness": "depleted",
                "biodiversity": "low",
                "pollinator_diversity": "low",
                "rainfall": 380.0,
                "temperature": 32.0,
                "drought_frequency": "frequent",
                "pesticide_use": "low",
                "tillage": "conventional_deep"
            }
        },
        {
            "id": "profile_mediterranean_slope",
            "profile_name": "Mediterranean Sloping Olive & Cereal Watershed",
            "region": "Andalusia Basin",
            "country": "Spain",
            "latitude": 37.4,
            "longitude": -4.2,
            "climate_zone": "Hot-summer Mediterranean (Csa)",
            "metrics": {
                "soil_organic_carbon": 1.10,
                "soil_moisture": "medium",
                "soil_ph": 7.8,
                "soil_compaction": "moderate",
                "soil_erosion": "moderate",
                "soil_microbial_activity": "moderate",
                "vegetation_cover": "moderate",
                "species_richness": "moderate",
                "biodiversity": "moderate",
                "pollinator_diversity": "moderate",
                "rainfall": 480.0,
                "temperature": 22.0,
                "drought_frequency": "seasonal",
                "pesticide_use": "moderate",
                "tillage": "reduced"
            }
        },
        {
            "id": "profile_temperate_alluvial",
            "profile_name": "Temperate Intensive Grain & Tile-Drained Alluvial Plain",
            "region": "Midwest Tile Plains",
            "country": "United States",
            "latitude": 41.2,
            "longitude": -88.5,
            "climate_zone": "Humid continental (Dfa)",
            "metrics": {
                "soil_organic_carbon": 2.40,
                "soil_moisture": "high",
                "soil_ph": 6.5,
                "soil_compaction": "high",
                "soil_erosion": "low",
                "soil_microbial_activity": "moderate",
                "vegetation_cover": "dense",
                "species_richness": "moderate",
                "biodiversity": "moderate",
                "pollinator_diversity": "low",
                "rainfall": 920.0,
                "temperature": 18.0,
                "drought_frequency": "low",
                "pesticide_use": "intensive",
                "tillage": "conventional_deep"
            }
        }
    ]

class RetrievalRequest(BaseModel):
    query: str
    domain: Optional[str] = None
    metrics: Optional[List[str]] = None
    top_k: int = 5
    min_similarity: float = 0.25

@app.post("/api/retrieve")
@app.post("/api/knowledge/retrieve")
def retrieve_endpoint(req: RetrievalRequest):
    results = rag_service.retrieve(
        query=req.query,
        domain_filter=req.domain,
        metric_filters=req.metrics,
        top_k=req.top_k,
        min_similarity=req.min_similarity
    )
    return {
        "query": req.query,
        "results_count": len(results),
        "results": results
    }

@app.post("/api/seed/reload")
def reload_knowledge_base():
    res = initialize_knowledge_base(force_reload=True)
    return res
