from typing import List, Dict, Any, Optional, Union
from enum import Enum
from pydantic import BaseModel, Field

class TimeHorizon(str, Enum):
    SHORT_TERM = "short_term"
    MEDIUM_TERM = "medium_term"
    LONG_TERM = "long_term"

class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class RecommendationItem(BaseModel):
    action: str
    why_it_works: str
    metrics: List[str] = Field(default_factory=list)
    time_horizon: str = "medium_term"
    confidence: str = "high"
    confidence_score: float = 0.85
    conditions: Dict[str, Any] = Field(default_factory=dict)
    limitations: str = ""
    evidence: List[Dict[str, Any]] = Field(default_factory=list)

class EnvironmentalProfile(BaseModel):
    id: Optional[str] = "active"
    profile_name: Optional[str] = "Default Profile"
    region: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    climate_zone: Optional[str] = None
    metrics: Optional[Dict[str, Any]] = Field(default_factory=dict)

class LocationMetadata(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region: Optional[str] = None
    country: Optional[str] = None
    climate_zone: Optional[str] = None
    context_note: Optional[str] = None

class EnvironmentalMetrics(BaseModel):
    soil_organic_carbon: Optional[Union[float, str]] = Field(None, description="Soil Organic Carbon percentage e.g. 0.3%")
    soil_ph: Optional[Union[float, str]] = Field(None, description="Soil pH level e.g. 6.5")
    soil_moisture: Optional[str] = Field(None, description="Soil moisture condition: low, medium, high")
    soil_nutrients: Optional[str] = Field(None, description="Soil nutrient status e.g. nitrogen-deficient")
    soil_erosion: Optional[str] = Field(None, description="Erosion state: severe, moderate, low")
    soil_compaction: Optional[str] = Field(None, description="Soil compaction: high, moderate, low")
    soil_microbial_activity: Optional[str] = Field(None, description="Microbial activity level: low, moderate, high")
    rainfall: Optional[Union[float, str]] = Field(None, description="Rainfall level or annual mm e.g. 'low' or 350")
    temperature: Optional[Union[float, str]] = Field(None, description="Temperature regime or average °C")
    drought_frequency: Optional[str] = Field(None, description="Drought incidence e.g. frequent, seasonal")
    land_use: Optional[str] = Field(None, description="Land classification: cropland, monoculture, agroforestry, grassland, wetland")
    crop: Optional[str] = Field(None, description="Crop or dominant flora e.g. monoculture wheat")
    vegetation_cover: Optional[str] = Field(None, description="Vegetation ground cover: sparse, moderate, dense")
    species_richness: Optional[str] = Field(None, description="Species richness level: depleted, moderate, high")
    pollinator_diversity: Optional[str] = Field(None, description="Pollinator presence: low, moderate, high")
    water_availability: Optional[str] = Field(None, description="Water availability: scarce, stressed, adequate")
    irrigation: Optional[str] = Field(None, description="Irrigation type: rainfed, drip, flood")
    pesticide_use: Optional[str] = Field(None, description="Pesticide intensity: intensive, moderate, low, none")
    tillage: Optional[str] = Field(None, description="Tillage practice: conventional_deep, reduced, no-till")
    region: Optional[str] = Field(None, description="Geographic region")
    country: Optional[str] = Field(None, description="Country name")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    climate_zone: Optional[str] = Field(None, description="Climate zone e.g. semi-arid, Mediterranean, tropical")

    class Config:
        extra = "allow"

class EvidenceItem(BaseModel):
    source: str = Field(..., description="Authoritative institution e.g. FAO, IPCC, IPBES, UNEP, USDA")
    title: str = Field(..., description="Official publication title")
    url: str = Field(..., description="Canonical reference URL or institutional DOI")
    publication_year: Union[int, str] = Field(..., description="Year of publication")
    relevance: str = Field(..., description="Direct contextual relevance to intervention")
    evidence_type: str = Field(..., description="Type of scientific evidence: meta_analysis, institutional_report, peer_reviewed_paper")
    evidence_summary: str = Field(..., description="Summary of empirical findings")
    credibility_weight: float = Field(0.9, description="Source authority weight between 0.0 and 1.0")

class MetricEffect(BaseModel):
    direction: str = Field(..., description="increase, decrease, or stable")
    symbol: str = Field("↑", description="↑, ↓, or →")
    time_horizon: str = Field(..., description="Expected timeframe for measurable change")
    details: str = Field(..., description="Scientific explanation of the metric improvement")

class CausalRelationship(BaseModel):
    source_factor: Optional[str] = None
    target_metric: Optional[str] = None
    relationship_type: Optional[str] = "positive"
    strength: Optional[float] = 0.8
    confidence: Optional[Union[str, ConfidenceLevel]] = "high"
    evidence_citation: Optional[str] = None
    description: Optional[str] = None
    variables: List[str] = Field(default_factory=list)
    chain: List[str] = Field(default_factory=list)
    explanation: Optional[str] = None
    mechanism: Optional[str] = None

class RecommendedAction(BaseModel):
    id: str
    action: str = Field(..., description="Clear, precise intervention description")
    why_it_works: str = Field(..., description="Biophysical and ecological mechanism")
    metrics: List[str] = Field(..., description="All environmental metrics affected")
    expected_direction: Dict[str, MetricEffect] = Field(..., description="Targeted metric change trajectories")
    time_horizon: str = Field(..., description="Realistic time horizon e.g. Short-term (months), Medium-term (2-3 yrs)")
    evidence: List[EvidenceItem] = Field(default_factory=list, description="Retrieved scientific literature grounding this action")
    confidence: str = Field("Medium", description="High, Medium, or Low")
    confidence_score: float = Field(0.75, description="Composite confidence score 0.0-1.0")
    conditions: str = Field(..., description="Applicability criteria (soil type, rainfall, crop system)")
    limitations: str = Field(..., description="Potential bottlenecks or risks under adverse conditions")

class EvidenceScoreBreakdown(BaseModel):
    source_quality: float = Field(..., description="Credibility of retrieved scientific sources (0-1)")
    relevance: float = Field(..., description="Alignment between user query/metrics and evidence (0-1)")
    evidence_strength: float = Field(..., description="Empirical rigor and sample scale (0-1)")
    consistency: float = Field(..., description="Consensus across multiple references (0-1)")
    composite_score: float = Field(..., description="Weighted composite evidence score (0-1)")
    confidence_level: str = Field(..., description="High, Medium, or Low")

class MissingInformation(BaseModel):
    missing_fields: List[str] = Field(default_factory=list)
    priority_questions: List[str] = Field(default_factory=list)
    diagnostic_intent: str = Field("")

class RetrievedChunk(BaseModel):
    id: str
    topic: str
    domain: str
    similarity: float
    snippet: str
    source: str
    source_url: str
    publication_year: Union[int, str]

class RetrievalMetadata(BaseModel):
    documents_used: int = 0
    evidence_items: List[EvidenceItem] = Field(default_factory=list)
    search_query: str = ""
    similarity_threshold: float = 0.5
    retrieved_chunks: List[RetrievedChunk] = Field(default_factory=list)

class TransparencyStep(BaseModel):
    step: str
    summary: str
    details: Any

class EnvironmentalAnalysisResult(BaseModel):
    assessment: str
    key_factors: List[str]
    environment: EnvironmentalMetrics
    location_metadata: Optional[LocationMetadata] = None
    relationships: List[CausalRelationship]
    recommendations: List[RecommendedAction]
    missing_information: MissingInformation
    retrieval: RetrievalMetadata
    evidence_scoring: EvidenceScoreBreakdown
    transparency_log: List[TransparencyStep] = Field(default_factory=list)
    is_fallback: bool = False

class AnalysisRequest(BaseModel):
    query: Optional[str] = None
    environment: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, Any]] = None
    conversation_id: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    environment: Optional[Dict[str, Any]] = None
    location: Optional[Dict[str, Any]] = None
