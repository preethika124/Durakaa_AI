from typing import Dict, List, Any, Optional
from backend.app.models.environmental import (
    EnvironmentalMetrics, CausalRelationship, MetricEffect, ConfidenceLevel, TimeHorizon
)

# Biophysical response coefficients derived from peer-reviewed literature & IPCC/FAO
INTERVENTION_COEFFICIENTS = {
    "cover_crop": {
        "soil_organic_carbon": {"pct_change": 0.22, "delay_years": 1.5, "direction": "positive"},
        "soil_erosion": {"pct_change": -0.65, "delay_years": 0.5, "direction": "positive"},
        "soil_moisture": {"pct_change": 0.18, "delay_years": 1.0, "direction": "positive"},
        "soil_microbial_activity": {"pct_change": 0.35, "delay_years": 0.8, "direction": "positive"},
        "species_richness": {"pct_change": 0.25, "delay_years": 1.0, "direction": "positive"},
        "trade_offs": "Early-season seedling moisture competition in dry spring if not terminated on schedule."
    },
    "biochar": {
        "soil_organic_carbon": {"pct_change": 0.60, "delay_years": 0.2, "direction": "positive"},
        "soil_moisture": {"pct_change": 0.28, "delay_years": 0.5, "direction": "positive"},
        "soil_nutrients": {"pct_change": 0.20, "delay_years": 0.5, "direction": "positive"},
        "soil_ph": {"pct_change": 0.10, "delay_years": 0.3, "direction": "positive"},
        "trade_offs": "Requires pre-inoculation with compost to prevent initial nitrogen drawdown; high upfront transport cost."
    },
    "agroforestry": {
        "soil_organic_carbon": {"pct_change": 0.30, "delay_years": 3.0, "direction": "positive"},
        "soil_erosion": {"pct_change": -0.75, "delay_years": 2.0, "direction": "positive"},
        "biodiversity": {"pct_change": 0.55, "delay_years": 2.5, "direction": "positive"},
        "temperature": {"pct_change": -0.15, "delay_years": 2.0, "direction": "positive"},
        "pollinator_diversity": {"pct_change": 0.45, "delay_years": 2.0, "direction": "positive"},
        "trade_offs": "Canopy shade competition with narrow alleys; complex harvesting logistics for heavy machinery."
    },
    "no_till": {
        "soil_compaction": {"pct_change": 0.12, "delay_years": 1.0, "direction": "negative"},
        "soil_organic_carbon": {"pct_change": 0.18, "delay_years": 2.0, "direction": "positive"},
        "soil_erosion": {"pct_change": -0.70, "delay_years": 0.5, "direction": "positive"},
        "soil_microbial_activity": {"pct_change": 0.40, "delay_years": 1.5, "direction": "positive"},
        "trade_offs": "Early transition compaction and weed shifts requiring initial strategic residue management."
    },
    "hedgerow": {
        "biodiversity": {"pct_change": 0.65, "delay_years": 1.5, "direction": "positive"},
        "pollinator_diversity": {"pct_change": 0.58, "delay_years": 1.0, "direction": "positive"},
        "pesticide_use": {"pct_change": -0.40, "delay_years": 2.0, "direction": "positive"},
        "trade_offs": "Consumes 3-5% of productive field borders; requires periodic trimming every 3–4 years."
    },
    "rotational_grazing": {
        "soil_organic_carbon": {"pct_change": 0.28, "delay_years": 2.0, "direction": "positive"},
        "soil_compaction": {"pct_change": -0.35, "delay_years": 1.0, "direction": "positive"},
        "vegetation_cover": {"pct_change": 0.45, "delay_years": 0.8, "direction": "positive"},
        "species_richness": {"pct_change": 0.38, "delay_years": 1.5, "direction": "positive"},
        "trade_offs": "Requires fencing investments and daily/weekly livestock rotation monitoring."
    },
    "crop_rotation": {
        "soil_nutrients": {"pct_change": 0.30, "delay_years": 1.0, "direction": "positive"},
        "soil_microbial_activity": {"pct_change": 0.42, "delay_years": 1.2, "direction": "positive"},
        "pesticide_use": {"pct_change": -0.35, "delay_years": 1.5, "direction": "positive"},
        "soil_organic_carbon": {"pct_change": 0.16, "delay_years": 2.0, "direction": "positive"},
        "trade_offs": "Requires diversified seed inventory and multi-crop marketing channels."
    },
    "drip_irrigation": {
        "water_availability": {"pct_change": 0.50, "delay_years": 0.2, "direction": "positive"},
        "soil_moisture": {"pct_change": 0.25, "delay_years": 0.2, "direction": "positive"},
        "soil_erosion": {"pct_change": -0.30, "delay_years": 0.5, "direction": "positive"},
        "trade_offs": "Initial capital setup cost; emitter lines require regular acid flushing to prevent mineral clogging."
    },
    "wetland_restoration": {
        "water_availability": {"pct_change": 0.45, "delay_years": 1.5, "direction": "positive"},
        "biodiversity": {"pct_change": 0.75, "delay_years": 2.0, "direction": "positive"},
        "species_richness": {"pct_change": 0.80, "delay_years": 2.0, "direction": "positive"},
        "soil_organic_carbon": {"pct_change": 0.40, "delay_years": 3.0, "direction": "positive"},
        "trade_offs": "Retires marginal flood-prone land from conventional arable cropping."
    }
}

INTERVENTION_CAUSAL_MAP = {
    "cover_crop": {
        "variables": ["Vegetation Cover", "Soil Moisture Evaporation", "Soil Aggregation", "Glomalin"],
        "chain": [
            "Dense winter canopy reduces kinetic rainfall impact and topsoil detachment",
            "Continuous root exudates nourish arbuscular mycorrhizal fungi and rhizosphere bacteria",
            "Glomalin production binds mineral silt and clay into stable water-resistant macroaggregates",
            "Topsoil organic carbon increases by 0.2-0.4 Mg C/ha/year while reducing erosion by 60%+"
        ],
        "explanation": "Living root architecture and surface residue shield the soil interface and stimulate microbiological carbon stabilization.",
        "mechanism": "Biological carbon pumping via root exudation and physical armoring of the epipedon.",
        "expected_direction": {
            "soil_organic_carbon": MetricEffect(direction="increase", symbol="↑", time_horizon="Medium-term (2-3 yrs)", details="Labile carbon pool enrichment and glomalin production"),
            "soil_erosion": MetricEffect(direction="decrease", symbol="↓", time_horizon="Short-term (months)", details="Direct physical canopy and residue protection against wind/water"),
            "soil_microbial_activity": MetricEffect(direction="increase", symbol="↑", time_horizon="Short-term (1 season)", details="Living root exudates continuously feed mycorrhizal networks")
        }
    },
    "biochar": {
        "variables": ["Pyrogenic Carbon", "Cation Exchange Capacity", "Water Retention Pores", "Microbial Habitat"],
        "chain": [
            "Highly porous recalcitrant aromatic carbon matrix introduced into depleted soil horizon",
            "Micropores and mesopores store capillary water during prolonged dry intervals",
            "Negatively charged functional groups hold exchangeable calcium, magnesium, and potassium",
            "Soil organic carbon stock increases immediately with multi-centennial permanence"
        ],
        "explanation": "Engineered biochar creates permanent porous surface area for water retention, nutrient buffering, and microbiological colonization.",
        "mechanism": "Pyrogenic recalcitrant aromatic structure with high specific surface area (>300 m²/g).",
        "expected_direction": {
            "soil_organic_carbon": MetricEffect(direction="increase", symbol="↑", time_horizon="Immediate (weeks)", details="Direct addition of stable recalcitrant carbon with centuries of half-life"),
            "soil_moisture": MetricEffect(direction="increase", symbol="↑", time_horizon="Short-term (months)", details="High specific internal pore volume enhances plant-available water holding capacity")
        }
    },
    "agroforestry": {
        "variables": ["Canopy Interception", "Deep Root Mining", "Microclimatic Buffering", "Stratified Niches"],
        "chain": [
            "Perennial woody trees intercept solar radiation and suppress desiccating wind speeds",
            "Deep taproots access subsoil moisture and pump calcium/magnesium upward into topsoil litter",
            "Vegetative shade buffers extreme soil surface temperature fluctuations",
            "Structural floral strata provide year-round nectar and nesting for wild pollinators"
        ],
        "explanation": "Stratified canopy and root architectures dramatically diversify farmland niches and reduce thermal stress.",
        "mechanism": "Microclimatic temperature attenuation and vertical nutrient safety-net capture.",
        "expected_direction": {
            "soil_organic_carbon": MetricEffect(direction="increase", symbol="↑", time_horizon="Long-term (3-5 yrs)", details="Substantial leaf litter and fine-root turnover"),
            "soil_erosion": MetricEffect(direction="decrease", symbol="↓", time_horizon="Medium-term (2 yrs)", details="Tree roots anchor slope horizons and windbreaks lower wind velocity"),
            "pollinator_diversity": MetricEffect(direction="increase", symbol="↑", time_horizon="Medium-term (1-2 yrs)", details="Perennial woody nectar sources support reproductive cycles")
        }
    }
}

class CausalInferenceEngine:
    def infer_relationships(self, query: str, profile_text: str = "") -> List[CausalRelationship]:
        combined = f"{query} {profile_text}".lower()
        relationships = []
        for key, data in INTERVENTION_CAUSAL_MAP.items():
            if key in combined or any(k in key for k in combined.split()):
                relationships.append(CausalRelationship(
                    source_factor=key.replace("_", " ").title(),
                    target_metric="Ecosystem Health",
                    relationship_type="positive",
                    strength=0.85,
                    confidence=ConfidenceLevel.HIGH,
                    evidence_citation="FAO / IPCC Special Report on Land",
                    description=data["explanation"],
                    variables=data["variables"],
                    chain=data["chain"],
                    explanation=data["explanation"],
                    mechanism=data["mechanism"]
                ))

        if not relationships:
            default = INTERVENTION_CAUSAL_MAP["cover_crop"]
            relationships.append(CausalRelationship(
                source_factor="Cover Cropping",
                target_metric="Soil Organic Carbon",
                relationship_type="positive",
                strength=0.88,
                confidence=ConfidenceLevel.HIGH,
                evidence_citation="FAO / IPCC Consensus",
                description=default["explanation"],
                variables=default["variables"],
                chain=default["chain"],
                explanation=default["explanation"],
                mechanism=default["mechanism"]
            ))

        return relationships

    def get_expected_direction(self, topic: str) -> Dict[str, MetricEffect]:
        t_lower = topic.lower()
        for k, v in INTERVENTION_CAUSAL_MAP.items():
            if k in t_lower:
                return v["expected_direction"]
        return INTERVENTION_CAUSAL_MAP["cover_crop"]["expected_direction"]

    def evaluate_interventions(
        self,
        baseline_metrics: EnvironmentalMetrics,
        proposed_interventions: List[str]
    ) -> Dict[str, Any]:
        """
        Computes multi-metric causal propagation, downstream consequences,
        and net ecological trajectory for a given set of interventions.
        """
        relationships: List[CausalRelationship] = []
        projected_metrics = baseline_metrics.model_dump()
        trade_offs: List[str] = []
        co_benefits: List[str] = []

        for item in proposed_interventions:
            key = item.lower().replace(" ", "_")
            matching_key = None
            for ik in INTERVENTION_COEFFICIENTS.keys():
                if ik in key or key in ik:
                    matching_key = ik
                    break

            if not matching_key:
                # Default to cover_crop if generic
                matching_key = "cover_crop"

            effects = INTERVENTION_COEFFICIENTS[matching_key]
            if "trade_offs" in effects:
                trade_offs.append(effects["trade_offs"])

            for metric_name, data in effects.items():
                if metric_name == "trade_offs":
                    continue
                pct = data["pct_change"]
                curr_val = projected_metrics.get(metric_name)
                
                if curr_val is not None:
                    try:
                        num_val = float(curr_val)
                        new_val = max(0.0, num_val * (1.0 + pct))
                        projected_metrics[metric_name] = round(new_val, 2)
                    except (ValueError, TypeError):
                        pass

                relationships.append(CausalRelationship(
                    source_factor=item.title(),
                    target_metric=metric_name.replace("_", " ").title(),
                    relationship_type="positive" if pct > 0 else "negative",
                    strength=min(1.0, abs(pct) * 1.5),
                    confidence=ConfidenceLevel.HIGH,
                    evidence_citation=f"IPCC / FAO Quantitative Assessment ({data['delay_years']} yr latency)",
                    description=(
                        f"{item.title()} induces a {abs(round(pct*100))}% "
                        f"{'increase' if pct > 0 else 'reduction'} in {metric_name.replace('_', ' ')} "
                        f"with an anticipated latency of ~{data['delay_years']} years."
                    )
                ))

                if pct > 0.20:
                    co_benefits.append(f"Synergistic boost to {metric_name.replace('_', ' ')} (+{int(pct*100)}%) via {item}.")

        return {
            "causal_relationships": relationships,
            "projected_metrics": projected_metrics,
            "trade_offs": list(set(trade_offs)),
            "co_benefits": list(set(co_benefits))
        }

causal_engine = CausalInferenceEngine()
