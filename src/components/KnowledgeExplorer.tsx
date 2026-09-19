import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Info,
  Clock,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface KnowledgeDoc {
  id: string;
  topic: string;
  domain: string;
  problem: string;
  description: string;
  mechanisms: string[];
  affects_metrics: string[];
  expected_time_horizon: string;
  time_horizon_detail: string;
  conditions: Record<string, any>;
  evidence: Array<{
    source: string;
    title: string;
    url: string;
    publication_year: number | string;
    relevance: string;
    evidence_type: string;
    evidence_summary: string;
    credibility_weight: number;
  }>;
}

export const KnowledgeExplorer: React.FC = () => {
  const [docs, setDocs] = useState<KnowledgeDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const domains = [
    'All',
    'Soil Health',
    'Water & Agrohydrology',
    'Agroforestry & Perennials',
    'Biodiversity & Biological Controls',
    'Grazing & Silvopasture'
  ];

  useEffect(() => {
    fetchDocuments();
  }, [selectedDomain, searchQuery]);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDomain !== 'All') {
        params.append('domain', selectedDomain);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      const res = await fetch(`/api/documents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedDocId(expandedDocId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>39 Curated Agroecological Knowledge Units</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            Scientific Knowledge Repository
          </h2>
          <p className="text-stone-300 text-sm leading-relaxed">
            All records in DARUKAA.EARTH are synthesized directly from consensus bodies including the
            FAO, IPCC, IPBES, UNEP, and leading peer-reviewed literature. Each intervention contains explicit
            biophysical mechanisms, time-horizon responses, regional boundaries, and source citations.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interventions, biophysical mechanisms, soil types, or crops..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Domain Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1" />
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedDomain === dom
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {loading ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200/80">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm">Querying SQLite scientific repository...</p>
        </div>
      ) : docs.length === 0 ? (
        <div className="p-12 text-center text-stone-500 bg-white rounded-2xl border border-stone-200/80">
          <p className="text-base font-semibold text-stone-700">No scientific records match your filter</p>
          <p className="text-xs text-stone-500 mt-1">Try clearing your search query or selecting "All" domains.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {docs.map((doc) => {
            const isExpanded = expandedDocId === doc.id;
            return (
              <div
                key={doc.id}
                className="bg-white border border-stone-200/90 rounded-2xl p-5 sm:p-6 shadow-sm hover:border-emerald-300/80 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60 font-semibold">
                        {doc.domain}
                      </span>
                      <span className="text-[11px] text-stone-600 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        {doc.expected_time_horizon.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900 tracking-tight">
                      {doc.topic}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleExpand(doc.id)}
                    className="self-start px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center space-x-1 transition-all"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'View Full Evidence'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Problem & Description */}
                <div className="space-y-2 text-sm">
                  <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-3 text-amber-950 text-xs">
                    <span className="font-semibold text-amber-900">Environmental Problem: </span>
                    {doc.problem}
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                {/* Affected Metrics Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs text-stone-600 font-medium mr-1">Governed Metrics:</span>
                  {doc.affects_metrics.map((m, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/60 font-mono"
                    >
                      {m.replace('_', ' ')}
                    </span>
                  ))}
                </div>

                {/* Expanded Details: Mechanisms & Evidence Citations */}
                {isExpanded && (
                  <div className="pt-4 border-t border-stone-100 space-y-5 animate-in fade-in duration-200">
                    {/* Mechanisms */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        Biophysical & Ecological Mechanisms
                      </h4>
                      <ul className="space-y-1.5 pl-2">
                        {doc.mechanisms.map((mech, midx) => (
                          <li key={midx} className="text-xs text-stone-700 flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{mech}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Regional & Soil Conditions */}
                    {doc.conditions && Object.keys(doc.conditions).length > 0 && (
                      <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/60 space-y-1.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          Applicability & Climatic Boundaries
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                          {Object.entries(doc.conditions).map(([k, v]) => (
                            <div key={k} className="flex items-start space-x-1.5">
                              <span className="font-semibold text-stone-700 capitalize">{k.replace('_', ' ')}:</span>
                              <span>{String(v)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Scientific Evidence & Citations */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5 font-mono">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Peer-Reviewed Evidence & Canonical Sources
                      </h4>
                      <div className="space-y-2">
                        {doc.evidence && doc.evidence.map((ev, eidx) => (
                          <div
                            key={eidx}
                            className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 text-xs space-y-1.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <div className="font-semibold text-emerald-950 flex items-center space-x-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-200/70 text-emerald-900 font-mono text-[10px]">
                                  {ev.source}
                                </span>
                                <span>{ev.title} ({ev.publication_year})</span>
                              </div>
                              {ev.url && (
                                <a
                                  href={ev.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 font-mono text-[11px] underline"
                                >
                                  <span>Citation Link</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-stone-700 leading-relaxed">
                              {ev.evidence_summary}
                            </p>
                            <div className="text-[11px] text-stone-500 italic">
                              Relevance: {ev.relevance}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
