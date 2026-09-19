import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  Sprout,
  Droplets,
  Layers,
  Sun,
  Activity,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { KnowledgeDocument } from '../types/environmental';

interface KnowledgeBaseExplorerProps {
  onSelectTopicForConsultation: (topic: string) => void;
}

const DOMAINS = ['All', 'Soil Health', 'Water', 'Biodiversity', 'Land Use', 'Climate'];

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({
  onSelectTopicForConsultation,
}) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [selectedDomain, searchQuery]);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedDomain !== 'All') {
        params.append('domain', selectedDomain);
      }
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      params.append('limit', '60');

      const res = await fetch(`/api/documents?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.documents || []);
        if (data.documents?.length > 0 && !selectedDoc) {
          setSelectedDoc(data.documents[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'soil health':
        return <Sprout className="w-3.5 h-3.5 text-emerald-600" />;
      case 'water':
        return <Droplets className="w-3.5 h-3.5 text-blue-600" />;
      case 'biodiversity':
        return <Activity className="w-3.5 h-3.5 text-purple-600" />;
      case 'climate':
        return <Sun className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Search & Domain Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedDomain === domain
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200/70'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 39 scientific documents..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Main Split View: Document List + Deep Detail Panel */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
        {/* Document List (Left 5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-3 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between text-xs font-semibold text-stone-600">
            <span>Knowledge Records ({documents.length})</span>
            <span className="text-[11px] text-stone-600">Peer-reviewed FAO/IPCC/IPBES</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-100 p-1">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-stone-500">
                Loading knowledge documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No documents match this filter.
              </div>
            ) : (
              documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all ${
                    selectedDoc?.id === doc.id
                      ? 'bg-emerald-50/80 border border-emerald-300/80 shadow-2xs'
                      : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    {getDomainIcon(doc.domain)}
                    <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
                      {doc.domain}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-stone-900 line-clamp-1 mb-1">
                    {doc.topic}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {doc.affects_metrics.slice(0, 3).map((m, mIdx) => (
                      <span
                        key={mIdx}
                        className="text-[9px] px-1.5 py-0.2 rounded bg-stone-100 text-stone-600 font-mono"
                      >
                        {m.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Document Detail Panel (Right 7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col overflow-y-auto p-6 space-y-6">
          {selectedDoc ? (
            <>
              {/* Header */}
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getDomainIcon(selectedDoc.domain)}
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      {selectedDoc.domain}
                    </span>
                  </div>
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                    Time Horizon: {selectedDoc.expected_time_horizon}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {selectedDoc.topic}
                </h3>
                <p className="text-xs text-stone-600">
                  <span className="font-semibold text-stone-700">Core Problem: </span>
                  {selectedDoc.problem}
                </p>
              </div>

              {/* Scientific Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                  Biophysical & Ecological Description
                </h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                  {selectedDoc.description}
                </p>
              </div>

              {/* Mechanisms */}
              {selectedDoc.mechanisms && selectedDoc.mechanisms.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                    Causal Mechanisms & Agronomic Steps
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedDoc.mechanisms.map((mech, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-stone-700 flex items-start space-x-2 bg-emerald-50/40 border border-emerald-100 p-2.5 rounded-lg"
                      >
                        <span className="w-4 h-4 rounded-full bg-emerald-200/70 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{mech}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Peer-Reviewed Evidence References */}
              {selectedDoc.evidence && selectedDoc.evidence.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center space-x-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Authoritative Scientific Evidence Grounding</span>
                  </h4>
                  <div className="space-y-2">
                    {selectedDoc.evidence.map((ev, eIdx) => (
                      <div
                        key={eIdx}
                        className="border border-stone-200 rounded-xl p-3 bg-white shadow-2xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                              {ev.source} ({ev.publication_year})
                            </span>
                            <span className="text-xs font-semibold text-stone-900 line-clamp-1">
                              {ev.title}
                            </span>
                          </div>
                          {ev.url && (
                            <a
                              href={ev.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-900 p-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {ev.evidence_summary}
                        </p>
                        <div className="text-[10px] text-stone-600 flex items-center space-x-2 pt-1 border-t border-stone-100">
                          <span>Evidence Type: {ev.evidence_type}</span>
                          <span>•</span>
                          <span>Credibility Weight: {ev.credibility_weight}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 border-t border-stone-100">
                <button
                  onClick={() => onSelectTopicForConsultation(selectedDoc.topic)}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>Launch Diagnostic Inquiry on this Topic</span>
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-stone-400">
              Select a document to inspect scientific mechanisms and citations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
