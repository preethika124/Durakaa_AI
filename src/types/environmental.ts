export interface EvidenceItem {
  source: string;
  title: string;
  url: string;
  publication_year: number | string;
  relevance: string;
  evidence_type: string;
  evidence_summary: string;
  credibility_weight: number;
}

export interface MetricEffect {
  direction: string;
  symbol: string;
  time_horizon: string;
  details: string;
}

export interface CausalRelationship {
  variables: string[];
  chain: string[];
  explanation: string;
  mechanism: string;
}

export interface RecommendedAction {
  id: string;
  action: string;
  why_it_works: string;
  metrics: string[];
  expected_direction: Record<string, MetricEffect>;
  time_horizon: string;
  evidence: EvidenceItem[];
  confidence: string;
  confidence_score: number;
  conditions: string;
  limitations: string;
}

export interface EvidenceScoreBreakdown {
  source_quality: number;
  relevance: number;
  evidence_strength: number;
  consistency: number;
  composite_score: number;
  confidence_level: string;
}

export interface MissingInformation {
  missing_fields: string[];
  priority_questions: string[];
  diagnostic_intent: string;
}

export interface RetrievedChunk {
  id: string;
  topic: string;
  domain: string;
  similarity: number;
  snippet: string;
  source: string;
  source_url: string;
  publication_year: string | number;
}

export interface RetrievalMetadata {
  documents_used: number;
  evidence_items: EvidenceItem[];
  search_query: string;
  similarity_threshold: number;
  retrieved_chunks: RetrievedChunk[];
}

export interface TransparencyStep {
  step: string;
  summary: string;
  details: any;
}

export interface EnvironmentalMetrics {
  soil_organic_carbon?: number | string;
  soil_ph?: number | string;
  soil_moisture?: string;
  soil_nutrients?: string;
  soil_erosion?: string | number;
  soil_compaction?: string | number;
  soil_microbial_activity?: string | number;
  rainfall?: number | string;
  temperature?: number | string;
  drought_frequency?: string;
  land_use?: string;
  crop?: string;
  vegetation_cover?: string;
  species_richness?: string | number;
  pollinator_diversity?: string | number;
  water_availability?: string;
  irrigation?: string;
  pesticide_use?: string | number;
  tillage?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  climate_zone?: string;
}

export interface EnvironmentalAnalysisResult {
  assessment: string;
  key_factors: string[];
  environment: EnvironmentalMetrics;
  relationships: CausalRelationship[];
  recommendations: RecommendedAction[];
  missing_information: MissingInformation;
  retrieval: RetrievalMetadata;
  evidence_scoring: EvidenceScoreBreakdown;
  transparency_log: TransparencyStep[];
  is_fallback?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: EnvironmentalAnalysisResult;
  clarification_prompt?: string[];
  created_at: string;
}

export interface KnowledgeDocument {
  id: string;
  topic: string;
  domain: string;
  problem: string;
  description: string;
  mechanisms: string[];
  affects_metrics: string[];
  conditions: Record<string, any>;
  expected_time_horizon: string;
  time_horizon_detail: string;
  evidence: EvidenceItem[];
}
