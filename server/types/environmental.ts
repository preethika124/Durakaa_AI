export type DomainType =
  | 'Soil Health'
  | 'Land Use'
  | 'Biodiversity'
  | 'Climate'
  | 'Human Impact'
  | 'Water';

export interface EvidenceItem {
  source: string;
  title: string;
  url: string;
  publication_year: number | string;
  relevance: string;
  evidence_type: 'peer_reviewed_paper' | 'institutional_report' | 'meta_analysis' | 'government_dataset';
  evidence_summary: string;
  credibility_weight?: number; // 0.0 - 1.0
}

export interface KnowledgeDocument {
  id: string;
  topic: string;
  domain: DomainType;
  problem: string;
  description: string;
  mechanisms: string[];
  affects_metrics: string[];
  conditions: {
    rainfall?: string;
    soil_type?: string;
    crop_system?: string;
    climate_zone?: string;
    slope?: string;
    temperature_range?: string;
    [key: string]: any;
  };
  expected_time_horizon: 'short_term' | 'medium_term' | 'long_term' | 'multi_stage';
  time_horizon_detail: string;
  evidence: EvidenceItem[];
  embedding?: number[];
}

export interface EnvironmentalMetrics {
  soil_organic_carbon?: number | string; // e.g. 0.3 (%)
  soil_ph?: number | string; // e.g. 6.5
  soil_moisture?: string; // 'low' | 'medium' | 'high' | percentage
  soil_nutrients?: string; // e.g. 'nitrogen_deficient'
  soil_erosion?: string; // 'severe' | 'moderate' | 'low'
  soil_compaction?: string; // 'high' | 'moderate' | 'low'
  soil_microbial_activity?: string; // 'low' | 'moderate' | 'high'
  rainfall?: string | number; // 'low' | 'medium' | 'high' | mm/yr
  temperature?: string | number; // 'high' | 'moderate' | 'low' | °C
  drought_frequency?: string; // 'frequent' | 'rare'
  land_use?: string; // 'cropland' | 'forest' | 'grassland' | 'wetland' | 'monoculture' | 'agroforestry'
  crop?: string; // e.g. 'monoculture wheat'
  vegetation_cover?: string; // 'sparse' | 'moderate' | 'dense'
  species_richness?: string; // 'depleted' | 'moderate' | 'high'
  pollinator_diversity?: string; // 'low' | 'moderate' | 'high'
  water_availability?: string; // 'scarce' | 'adequate' | 'excess'
  irrigation?: string; // 'none_rainfed' | 'drip' | 'flood'
  pesticide_use?: string; // 'intensive' | 'moderate' | 'none'
  tillage?: string; // 'conventional_deep' | 'reduced' | 'no_till'
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  climate_zone?: string; // 'semi-arid' | 'arid' | 'tropical' | 'temperate' | 'boreal' | 'mediterranean'
  [key: string]: any;
}

export interface CausalRelationship {
  from: string;
  to: string;
  mechanism: string;
  variables: string[];
  severity: 'critical' | 'moderate' | 'informational';
}

export interface RecommendedAction {
  id: string;
  action: string;
  why_it_works: string;
  metrics: string[];
  expected_direction: Record<string, {
    direction: 'increase' | 'decrease' | 'stable';
    symbol: '↑' | '↓' | '→';
    time_horizon: string;
    details: string;
  }>;
  time_horizon: string;
  evidence: EvidenceItem[];
  confidence: 'High' | 'Medium' | 'Low';
  confidence_score: number; // 0.0 - 1.0
  conditions: string;
  limitations: string;
}

export interface EvidenceScoreBreakdown {
  source_quality: number; // 0-1
  relevance: number; // 0-1
  evidence_strength: number; // 0-1
  consistency: number; // 0-1
  composite_score: number; // 0-1
  confidence_level: 'High' | 'Medium' | 'Low';
}

export interface EnvironmentalAnalysisResult {
  assessment: string;
  key_factors: string[];
  environment: EnvironmentalMetrics;
  location_metadata?: {
    region?: string;
    country?: string;
    coordinates?: { lat: number; lng: number };
    climate_zone?: string;
    context_note?: string;
  };
  relationships: {
    variables: string[];
    chain: string[];
    explanation: string;
  }[];
  recommendations: RecommendedAction[];
  missing_information: {
    missing_fields: string[];
    priority_questions: string[];
    diagnostic_intent: string;
  };
  retrieval: {
    documents_used: number;
    evidence_items: EvidenceItem[];
    search_query: string;
    similarity_threshold: number;
    retrieved_chunks: {
      id: string;
      topic: string;
      domain: string;
      similarity: number;
      snippet: string;
      source: string;
    }[];
  };
  evidence_scoring: EvidenceScoreBreakdown;
  transparency_log: {
    step: string;
    summary: string;
    details: any;
  }[];
  is_fallback?: boolean;
}

export interface ConversationState {
  id: string;
  created_at: string;
  updated_at: string;
  environmental_profile: EnvironmentalMetrics;
  messages: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    analysis?: EnvironmentalAnalysisResult;
  }[];
}
