import React, { useState } from 'react';
import {
  Network,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShieldCheck,
  Sprout,
  Droplets,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';

interface SimulationPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  variables: string[];
  nodes: {
    stage: string;
    description: string;
    icon: string;
  }[];
  outcomes: {
    metric: string;
    direction: 'up' | 'down';
    magnitude: string;
    horizon: string;
    detail: string;
  }[];
  scientific_principle: string;
}

const SIMULATIONS: SimulationPreset[] = [
  {
    id: "cover_crops",
    name: "Multispecies Cover Cropping",
    category: "Soil Conservation & Carbon Pumping",
    description: "Year-round vegetative ground armoring combined with fibrous and taproot rhizosphere exudation.",
    variables: ["Residue Mulch", "Kinetic Raindrop Energy", "Runoff Velocity", "Glomalin Synthesis", "Soil Carbon"],
    nodes: [
      {
        stage: "1. Physical Dissipation",
        description: "Surface biomass dissipates 90% of raindrop kinetic energy, preventing aggregate detachment and surface crusting.",
        icon: "shield"
      },
      {
        stage: "2. Hydrological Retardation",
        description: "Stem density increases tortuosity, reducing overland runoff velocity and multiplying infiltration time.",
        icon: "droplet"
      },
      {
        stage: "3. Biological Inoculation",
        description: "Living root exudates supply labile carbon to mycorrhizal fungi, stimulating glomalin secretion.",
        icon: "sprout"
      },
      {
        stage: "4. Carbon Stabilization",
        description: "Humification binds fungal hyphae and root debris into water-stable macroaggregates (>250 µm).",
        icon: "layers"
      }
    ],
    outcomes: [
      {
        metric: "Soil Erosion",
        direction: "down",
        magnitude: "-60% to -85%",
        horizon: "Short-term (1 season)",
        detail: "Continuous surface cover shields fragile epipedon against sheetwash detachment."
      },
      {
        metric: "Soil Organic Carbon",
        direction: "up",
        magnitude: "+0.3% to +0.6% / 3 yrs",
        horizon: "Medium-term (2-3 yrs)",
        detail: "Subterranean root turnover deposits recalcitrant carbon directly in mineral horizon."
      },
      {
        metric: "Water Infiltration Rate",
        direction: "up",
        magnitude: "+40% to +90%",
        horizon: "Medium-term (1-2 yrs)",
        detail: "Biopores created by decomposing taproots serve as preferential vertical drainage channels."
      },
      {
        metric: "Microbial Biomass",
        direction: "up",
        magnitude: "+50% to +120%",
        horizon: "Short-term (weeks to months)",
        detail: "Continuous rhizosphere carbon inputs maintain saprophytic and mycorrhizal metabolism."
      }
    ],
    scientific_principle: "Russell & Ewel (1995) / FAO SOLAW (2021): Soil loss decreases exponentially as vegetative surface cover exceeds 30%."
  },
  {
    id: "biochar_amendment",
    name: "Pyrogenic Biochar Soil Inoculation",
    category: "Recalcitrant Carbon & Pore Engineering",
    description: "High-temperature pyrolyzed biomass engineered for micro-porosity and cation adsorption.",
    variables: ["Biochar Matrix", "Micro-Porosity", "Cation Exchange Capacity", "Water Retention", "Centennial Carbon"],
    nodes: [
      {
        stage: "1. Pore Insertion",
        description: "Highly porous refractory carbon matrix amended into upper 15 cm of soil horizon.",
        icon: "layers"
      },
      {
        stage: "2. Capillary Storage",
        description: "Internal nanopores and mesopores hold plant-available water against gravitational drainage.",
        icon: "droplet"
      },
      {
        stage: "3. Cation Complexation",
        description: "Carboxylic and phenolic surface functional groups develop negative charges, binding NH4+ and K+.",
        icon: "shield"
      },
      {
        stage: "4. Microbial Micro-refugia",
        description: "Internal chamber diameter shields beneficial bacteria from protozoan predation and moisture stress.",
        icon: "sprout"
      }
    ],
    outcomes: [
      {
        metric: "Soil Organic Carbon",
        direction: "up",
        magnitude: "+1.2% to +2.5% permanent",
        horizon: "Immediate (months to centuries)",
        detail: "Aromatic ring structures resist microbial enzymatic oxidation for 100-500+ years."
      },
      {
        metric: "Plant-Available Water",
        direction: "up",
        magnitude: "+15% to +35%",
        horizon: "Immediate (1 season)",
        detail: "Elevated specific surface area expands soil water retention curves in drought-prone sands."
      },
      {
        metric: "Nutrient Leaching",
        direction: "down",
        magnitude: "-30% to -50%",
        horizon: "Short-term (1 yr)",
        detail: "High CEC retains soluble cations against heavy rainfall washouts."
      }
    ],
    scientific_principle: "Lehmann & Joseph (2015): Pyrogenic carbon exhibits half-lives exceeding 1000 years with high specific surface areas (200-400 m²/g)."
  },
  {
    id: "agroforestry",
    name: "Agroforestry Canopy & Windbreak Stratification",
    category: "Vertical Niche Partitioning & Microclimate",
    description: "Integration of perennial woody trees, hedgerows, and annual crop corridors.",
    variables: ["Canopy Interception", "Deep Root Safety-Net", "Wind Shear Reduction", "Thermal Buffering", "Pollinator Niches"],
    nodes: [
      {
        stage: "1. Wind Boundary Buffering",
        description: "Perennial windbreaks reduce downwind surface wind speed by 40-70% for a distance of 15-20x tree height.",
        icon: "shield"
      },
      {
        stage: "2. Microclimate Thermoregulation",
        description: "Canopy shade dampens peak midday soil temperature spikes by 3-6°C, curbing non-productive evaporative loss.",
        icon: "droplet"
      },
      {
        stage: "3. Deep Nutrient Interception",
        description: "Deep tree roots pump leached nitrates and minerals from subsoil horizons beyond annual crop root reaches.",
        icon: "sprout"
      },
      {
        stage: "4. Perennial Biodiversity Habitat",
        description: "Continuous woody corridors and floral sequences sustain wild apoidea pollinators and natural pest predators.",
        icon: "layers"
      }
    ],
    outcomes: [
      {
        metric: "Evapotranspiration Stress",
        direction: "down",
        magnitude: "-20% to -35%",
        horizon: "Medium-term (2-4 yrs)",
        detail: "Attenuated wind shear and thermal shade conserve critical topsoil moisture."
      },
      {
        metric: "Pollinator Diversity",
        direction: "up",
        magnitude: "+70% to +140%",
        horizon: "Medium-term (1-2 yrs)",
        detail: "Perennial hedgerows provide year-round pollen, nectar, and subterranean nesting sites."
      },
      {
        metric: "Wind Erosion",
        direction: "down",
        magnitude: "-75% to -95%",
        horizon: "Medium-term (2-3 yrs)",
        detail: "Friction velocity remains below saltation threshold across sheltered fields."
      }
    ],
    scientific_principle: "Jose (2009) / IPCC Special Report on Climate Change and Land (2019): Agroforestry combines microclimate buffering with vertical resource complementarity."
  }
];

export const CausalSimulatorView: React.FC = () => {
  const [activeSim, setActiveSim] = useState<SimulationPreset>(SIMULATIONS[0]);

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Simulation Selector Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-emerald-700" />
          <div>
            <h3 className="text-sm font-bold text-stone-900">
              Biophysical Causal Feedback Simulator
            </h3>
            <p className="text-[11px] text-stone-500">
              Interactive mechanistic propagation curves and metric vector trajectories
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {SIMULATIONS.map((sim) => (
            <button
              key={sim.id}
              onClick={() => setActiveSim(sim)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeSim.id === sim.id
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              {sim.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulator Canvas */}
      <div className="flex-1 bg-white border border-stone-200 rounded-2xl shadow-sm p-6 overflow-y-auto space-y-6">
        {/* Active Simulation Overview */}
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-700">
              {activeSim.category}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Deterministic Mathematical Propagation
            </span>
          </div>
          <h2 className="text-base font-bold text-stone-900 mb-1">
            {activeSim.name}
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            {activeSim.description}
          </p>
        </div>

        {/* Variables in the Causal Loop */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
            Coupled Environmental Variables
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {activeSim.variables.map((v, idx) => (
              <React.Fragment key={idx}>
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                  {v}
                </span>
                {idx < activeSim.variables.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step-by-Step Causal Cascade */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Mechanistic Cascade Stages
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSim.nodes.map((node, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-1.5"
              >
                <div className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-200/70 text-emerald-950 flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  <span>{node.stage}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed pl-6">
                  {node.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projected Outcome Trajectories */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
            Empirically Quantified Outcome Trajectories
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeSim.outcomes.map((out, idx) => {
              const isUp = out.direction === 'up';
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${
                    isUp
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-teal-50/50 border-teal-200 text-teal-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      {isUp ? (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-teal-600" />
                      )}
                      <span>{out.metric}</span>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current shadow-2xs">
                      {out.magnitude}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed mb-2">
                    {out.detail}
                  </p>
                  <div className="text-[10px] font-medium opacity-75">
                    Measurable Horizon: {out.horizon}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scientific Rationale Footnote */}
        <div className="bg-stone-100/70 border border-stone-200/80 rounded-xl p-3.5 flex items-start space-x-2.5 text-xs text-stone-700">
          <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Authoritative Literature Foundation:</span>
            <p className="text-[11px] text-stone-600 font-mono leading-relaxed">
              {activeSim.scientific_principle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
