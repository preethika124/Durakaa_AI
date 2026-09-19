import React from 'react';
import { Sliders, CheckCircle2, AlertTriangle, Droplets, Mountain, Sprout, Wind, MapPin } from 'lucide-react';
import { EnvironmentalMetrics } from '../types/environmental';

interface BaselineProfilePanelProps {
  metrics: EnvironmentalMetrics;
  onChange: (updated: Partial<EnvironmentalMetrics>) => void;
  onApplyPreset: (presetName: string) => void;
}

const PRESETS = [
  {
    name: "Degraded Arable Plain",
    desc: "Low SOC (0.7%), conventional moldboard plowing, moderate erosion.",
    data: {
      soil_organic_carbon: 0.7,
      soil_ph: 5.9,
      soil_moisture: "low",
      soil_erosion: "severe",
      tillage: "conventional_deep",
      rainfall: 480,
      temperature: 22,
      pesticide_use: "intensive",
      crop: "monoculture wheat",
      land_use: "cropland"
    }
  },
  {
    name: "Sahelian Dryland Rangeland",
    desc: "Severe crusted glacis, high drought frequency, 250mm rainfall.",
    data: {
      soil_organic_carbon: 0.4,
      soil_ph: 7.2,
      soil_moisture: "low",
      soil_erosion: "severe",
      tillage: "no-till",
      rainfall: 260,
      temperature: 32,
      pesticide_use: "none",
      crop: "pearl millet & sparse shrubs",
      land_use: "semi-arid rangeland"
    }
  },
  {
    name: "Sloped Mediterranean Basin",
    desc: "Calcareous soil, active sheetwash runoff, olive & vine culture.",
    data: {
      soil_organic_carbon: 1.1,
      soil_ph: 7.8,
      soil_moisture: "low",
      soil_erosion: "moderate",
      tillage: "reduced",
      rainfall: 550,
      temperature: 24,
      pesticide_use: "moderate",
      crop: "vineyards & olive groves",
      land_use: "sloped perennial culture"
    }
  },
  {
    name: "Compacted Clay Broadacre",
    desc: "Subsoil plow pan, poor infiltration, ponding & anaerobic layers.",
    data: {
      soil_organic_carbon: 1.4,
      soil_ph: 6.6,
      soil_moisture: "high",
      soil_compaction: "high",
      tillage: "conventional_deep",
      rainfall: 750,
      temperature: 18,
      pesticide_use: "intensive",
      crop: "continuous maize-soy",
      land_use: "cropland"
    }
  }
];

export const BaselineProfilePanel: React.FC<BaselineProfilePanelProps> = ({
  metrics,
  onChange,
  onApplyPreset,
}) => {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl shadow-sm p-4 sm:p-5">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-emerald-700" />
          <h2 className="font-semibold text-sm text-stone-900 tracking-tight">
            Environmental Baseline & Farm Profile
          </h2>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
          Field Parameters
        </span>
      </div>

      {/* Preset Quick Select */}
      <div className="mb-4">
        <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block mb-2">
          Ecosystem Baseline Presets
        </label>
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                onChange(preset.data);
                onApplyPreset(preset.name);
              }}
              className="text-left p-2 rounded-lg border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-xs group"
            >
              <div className="font-medium text-stone-800 group-hover:text-emerald-900 line-clamp-1">
                {preset.name}
              </div>
              <div className="text-[10px] text-stone-600 line-clamp-1">
                {preset.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Soil Health Section */}
      <div className="space-y-3 mb-4">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center space-x-1">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>Soil Biophysical State</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Soil Organic Carbon (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.soil_organic_carbon ?? ''}
              placeholder="e.g. 1.2"
              onChange={(e) => onChange({ soil_organic_carbon: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Soil pH Level
            </label>
            <input
              type="number"
              step="0.1"
              value={metrics.soil_ph ?? ''}
              placeholder="e.g. 6.5"
              onChange={(e) => onChange({ soil_ph: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Soil Moisture Condition
            </label>
            <select
              value={metrics.soil_moisture ?? 'medium'}
              onChange={(e) => onChange({ soil_moisture: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="low">Low (Drought Stress)</option>
              <option value="medium">Moderate / Balanced</option>
              <option value="high">High (Waterlogged/Ponding)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Erosion Severity
            </label>
            <select
              value={metrics.soil_erosion ?? 'moderate'}
              onChange={(e) => onChange({ soil_erosion: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="low">Low (&lt; 3 t/ha/yr)</option>
              <option value="moderate">Moderate (3-10 t/ha/yr)</option>
              <option value="severe">Severe (&gt; 10 t/ha/yr)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Climate & Farming Section */}
      <div className="space-y-3 pt-3 border-t border-stone-100">
        <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center space-x-1">
          <Droplets className="w-3.5 h-3.5 text-blue-600" />
          <span>Climate & Farm Practice</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Annual Rainfall (mm)
            </label>
            <input
              type="number"
              step="10"
              value={metrics.rainfall ?? ''}
              placeholder="e.g. 520"
              onChange={(e) => onChange({ rainfall: e.target.value ? parseFloat(e.target.value) : undefined })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-stone-600 mb-1">
              Tillage Practice
            </label>
            <select
              value={metrics.tillage ?? 'conventional_deep'}
              onChange={(e) => onChange({ tillage: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="conventional_deep">Conventional Plow</option>
              <option value="reduced">Reduced / Minimum Till</option>
              <option value="no-till">Direct Drill No-Till</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-medium text-stone-600 mb-1">
            Dominant Crop or Land System
          </label>
          <input
            type="text"
            value={metrics.crop ?? ''}
            placeholder="e.g. Monoculture wheat, corn-soy, rangeland"
            onChange={(e) => onChange({ crop: e.target.value })}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  );
};
