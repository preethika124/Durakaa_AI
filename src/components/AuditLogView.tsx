import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Database,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';

interface RetrievalLog {
  id: string;
  query: string;
  retrieved_documents: string[];
  similarity_scores: number[];
  timestamp: string;
}

interface AuditLogViewProps {
  onReloadSeed: () => void;
  isReloading: boolean;
  systemStatus: {
    status: string;
    documents_count: number;
    chunks_count: number;
  } | null;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  onReloadSeed,
  isReloading,
  systemStatus
}) => {
  const [logs, setLogs] = useState<RetrievalLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/retrieval-logs?limit=30');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error('Error loading retrieval logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scientific Provenance & Audit Trail</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            RAG Retrieval & Evidence Telemetry
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            Every AI consultation and causal analysis is grounded strictly in deterministic vector retrieval
            and peer-reviewed evidence items. Inspect active query vectors, similarity scores, and knowledge
            chunk retrieval audits below.
          </p>
        </div>
      </div>

      {/* System Integrity Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
            <span>DATABASE DOCUMENTS</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {systemStatus?.documents_count || 39}
          </div>
          <p className="text-[11px] text-stone-400">Structured ecological records</p>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
            <span>SEMANTIC CHUNKS</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-stone-900">
            {systemStatus?.chunks_count || 138}
          </div>
          <p className="text-[11px] text-stone-400">Embedded diagnostic & evidence vectors</p>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
            <span>REPOSITORY RE-INDEX</span>
            <RefreshCw className="w-4 h-4 text-stone-400" />
          </div>
          <button
            onClick={onReloadSeed}
            disabled={isReloading}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-semibold flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
            <span>{isReloading ? 'Re-indexing SQLite...' : 'Reseed & Re-index Knowledge'}</span>
          </button>
        </div>
      </div>

      {/* Retrieval Logs Feed */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500" />
            <span>Recent RAG Retrieval Operations</span>
          </h3>
          <button
            onClick={fetchLogs}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-mono transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-stone-400 text-xs font-mono">
            Loading telemetry logs...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-stone-500 text-xs bg-stone-50 rounded-xl border border-stone-200/60">
            No queries logged yet. Ask questions in the Intelligence Studio to generate retrieval logs.
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-stone-200/70 bg-stone-50/60 space-y-2.5 text-xs hover:border-emerald-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-semibold text-stone-900 flex items-center space-x-2">
                    <Search className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>"{log.query}"</span>
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-200/50">
                  <span className="text-[11px] text-stone-500 font-mono">Retrieved Chunks:</span>
                  {log.retrieved_documents.map((docId, idx) => {
                    const score = log.similarity_scores[idx];
                    return (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200 font-mono text-[10px] flex items-center gap-1"
                      >
                        <span className="font-medium text-emerald-800 truncate max-w-[160px]">{docId}</span>
                        {score !== undefined && (
                          <span className="text-stone-400 font-normal">
                            ({(score * 100).toFixed(0)}%)
                          </span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
