import React from 'react';
import { Globe, Database, Network, ShieldCheck, Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'consultation' | 'knowledge' | 'causal' | 'audit';
  setActiveTab: (tab: 'consultation' | 'knowledge' | 'causal' | 'audit') => void;
  systemStatus: {
    status: string;
    documents_count: number;
    chunks_count: number;
  } | null;
  onReloadSeed: () => void;
  isReloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  systemStatus,
  onReloadSeed,
  isReloading,
}) => {
  return (
    <header className="border-b border-emerald-950/20 bg-emerald-950/90 text-emerald-50 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-300/30">
              <Globe className="w-5 h-5 text-emerald-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-lg text-emerald-100 font-mono">
                  DARUKAA<span className="text-emerald-400">.EARTH</span>
                </span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-800/60 text-emerald-300 border border-emerald-700/50">
                  AI Biodiversity Intelligence
                </span>
              </div>
              <p className="text-xs text-emerald-300/80 hidden sm:block">
                Evidence-Grounded Ecological Modeling & Causal Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab('consultation')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'consultation'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Intelligence Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'knowledge'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Evidence Base</span>
              <span className="text-[10px] ml-1 px-1.5 py-0.2 rounded bg-emerald-800/80 text-emerald-200">
                {systemStatus?.documents_count ?? 39}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('causal')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'causal'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <Network className="w-4 h-4" />
              <span className="hidden md:inline">Causal Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                activeTab === 'audit'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-sm'
                  : 'text-emerald-200/70 hover:text-emerald-100 hover:bg-emerald-900/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">Audit Log</span>
            </button>
          </nav>

          {/* System Telemetry & Refresh */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 text-xs text-emerald-300/80 bg-emerald-900/50 border border-emerald-800/60 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Vector RAG Active</span>
              <span className="text-emerald-500">|</span>
              <span>{systemStatus?.chunks_count ?? 138} Chunks</span>
            </div>

            <button
              onClick={onReloadSeed}
              disabled={isReloading}
              title="Reload and re-index scientific seed documents"
              className="p-2 rounded-lg text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/60 border border-emerald-800/50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
