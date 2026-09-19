import React, { useState, useEffect } from 'react';
import {
  Network,
  Play,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { EnvironmentalMetrics } from '../types/environmental';

interface CausalStudioProps {
  baselineMetrics: EnvironmentalMetrics;
}

interface SimulationResult {
  causal_relationships: Array<{
    source_factor?: string;
    target_metric?: string;
    relationship_type?: string;
    strength?: number;
    evidence_citation?: string;
    description?: string;
    variables?: string[];
    chain?: string[];
  }>;
  projected_metrics: Record<string, any>;
  trade_offs: string[];
  co_benefits: string[];
}

const AVAILABLE_INTERVENTIONS = [
  { id: 'cover_crop', label: 'Multispecies Cover Cropping', domain: 'Soil & Moisture' },
  { id: 'biochar', label: 'Inoculated Biochar Amendment', domain: 'Recalcitrant Carbon' },
  { id: 'agroforestry', label: 'Agroforestry & Tree Windbreaks', domain: 'Perennial Architecture' },
  { id: 'no_till', label: 'Continuous Conservation No-Till', domain: 'Soil Structure' },
  { id: 'hedgerow', label: 'Flowering Hedgerows & Corridors', domain: 'Pollinators & Habitat' },
  { id: 'rotational_grazing', label: 'Adaptive Multi-Paddock Grazing', domain: 'Rangeland Carbon' },
  { id: 'crop_rotation', label: 'Diverse 4-Year Crop Rotation', domain: 'Rhizosphere Ecology' },
  { id: 'drip_irrigation', label: 'Deficit Drip Micro-Irrigation', domain: 'Water Conservation' },
  { id: 'wetland_restoration', label: 'Riparian & Wetland Buffering', domain: 'Hydrologic Buffers' }
];

export const CausalStudio: React.FC<CausalStudioProps> = ({ baselineMetrics }) => {
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([
    'cover_crop',
    'agroforestry'
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    runSimulation();
  }, [selectedInterventions, baselineMetrics]);

  const toggleIntervention = (id: string) => {
    setSelectedInterventions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const runSimulation = async () => {
    if (selectedInterventions.length === 0) {
      setSimulationResult(null);
      return;
    }
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseline_metrics: baselineMetrics,
          proposed_interventions: selectedInterventions
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const metricsToCompare = [
    { key: 'soil_organic_carbon', label: 'Soil Organic Carbon', unit: '%', baseline: baselineMetrics.soil_organic_carbon || 0.8 },
    { key: 'soil_erosion', label: 'Soil Erosion Rate', unit: 't/ha/yr', baseline: baselineMetrics.soil_erosion || 12.0 },
    { key: 'soil_moisture', label: 'Soil Moisture Level', unit: '% v/v', baseline: baselineMetrics.soil_moisture || 16.0 },
    { key: 'soil_microbial_activity', label: 'Microbial Respiration', unit: 'mg C/kg', baseline: baselineMetrics.soil_microbial_activity || 14.0 },
    { key: 'biodiversity', label: 'Biodiversity Index', unit: 'Shannon (H)', baseline: 0.32 },
    { key: 'species_richness', label: 'Plant & Insect Richness', unit: 'spp', baseline: baselineMetrics.species_richness || 12.0 }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-400 text-xs font-mono">
            <Network className="w-3.5 h-3.5" />
            <span>Quantitative Multi-Metric Causal Modeling</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Ecosystem Intervention Simulator
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Test combined agroecological practices against the active baseline profile. The causal inference
            engine computes empirical biophysical response curves, response latencies, cross-metric trade-offs,
            and mutual co-benefits derived from FAO and IPCC syntheses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interventions Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono">
                Select Practices
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {selectedInterventions.length} active
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Toggle ecological interventions to observe simulated multi-metric ripple effects across the landscape.
            </p>

            <div className="space-y-2">
              {AVAILABLE_INTERVENTIONS.map((item) => {
                const active = selectedInterventions.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleIntervention(item.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                      active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
                        : 'bg-stone-50/70 border-stone-200/70 text-stone-600 hover:bg-stone-100/80'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{item.label}</div>
                      <div className="text-[11px] text-stone-400 font-normal">{item.domain}</div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        active ? 'bg-emerald-600 text-white' : 'border border-stone-300'
                      }`}
                    >
                      {active && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Simulation Outcomes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Projected Metric Deltas */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Simulated Metric Trajectories</span>
              </h3>
              {isSimulating && (
                <div className="flex items-center space-x-1.5 text-xs text-emerald-600 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Calculating biophysical propagation...</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {metricsToCompare.map((m) => {
                const projectedVal = simulationResult?.projected_metrics?.[m.key];
                const baseNum = typeof m.baseline === 'number' ? m.baseline : parseFloat(String(m.baseline)) || 1.0;
                const projNum = projectedVal !== undefined ? parseFloat(String(projectedVal)) : baseNum;
                const diff = projNum - baseNum;
                const isPositive = m.key === 'soil_erosion' ? diff < 0 : diff > 0;

                return (
                  <div
                    key={m.key}
                    className="p-4 rounded-xl border border-stone-200/70 bg-stone-50/50 space-y-2 hover:bg-white hover:shadow-xs transition-all"
                  >
                    <div className="text-xs text-stone-500 font-medium">{m.label}</div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold font-mono text-stone-900">
                        {projNum.toFixed(2)}
                        <span className="text-xs font-normal text-stone-400 ml-1">{m.unit}</span>
                      </span>
                      {diff !== 0 && (
                        <span
                          className={`text-xs font-mono font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                            isPositive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {diff > 0 ? '+' : ''}
                          {((diff / baseNum) * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono">
                      Baseline: {baseNum.toFixed(2)} {m.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trade-Offs & Biophysical Constraints */}
          {simulationResult && simulationResult.trade_offs.length > 0 && (
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wide font-mono">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Identified Ecological Trade-Offs & Bottlenecks</span>
              </div>
              <ul className="space-y-1.5 text-xs text-amber-950 leading-relaxed pl-1">
                {simulationResult.trade_offs.map((to, tidx) => (
                  <li key={tidx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                    <span>{to}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Synergistic Co-Benefits */}
          {simulationResult && simulationResult.co_benefits.length > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs uppercase tracking-wide font-mono">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Multi-Metric Ecological Co-Benefits</span>
              </div>
              <ul className="space-y-1.5 text-xs text-emerald-950 leading-relaxed pl-1">
                {simulationResult.co_benefits.map((cb, cbidx) => (
                  <li key={cbidx} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>{cb}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mechanistic Causal Chains */}
          {simulationResult && simulationResult.causal_relationships.length > 0 && (
            <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-700" />
                <span>Active Causal Mechanisms</span>
              </h3>
              <div className="space-y-3">
                {simulationResult.causal_relationships.slice(0, 4).map((rel, ridx) => (
                  <div
                    key={ridx}
                    className="p-3.5 rounded-xl border border-stone-200/60 bg-stone-50/60 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-stone-900 font-mono">
                        {rel.source_factor} → {rel.target_metric}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-200 text-stone-700">
                        {rel.evidence_citation}
                      </span>
                    </div>
                    {rel.description && (
                      <p className="text-stone-600 leading-relaxed">{rel.description}</p>
                    )}
                    {rel.chain && rel.chain.length > 0 && (
                      <div className="pl-2 border-l-2 border-emerald-300 space-y-1 pt-1">
                        {rel.chain.map((step, sidx) => (
                          <div key={sidx} className="text-stone-500 text-[11px] flex items-center space-x-1.5">
                            <ChevronRight className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
