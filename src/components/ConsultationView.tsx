import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  GitCommit,
  CheckCircle2
} from 'lucide-react';
import { ChatMessage, EnvironmentalAnalysisResult, EnvironmentalMetrics } from '../types/environmental';

interface ConsultationViewProps {
  messages: ChatMessage[];
  onSendMessage: (query: string) => void;
  isLoading: boolean;
  activeMetrics: EnvironmentalMetrics;
}

const SAMPLE_QUERIES = [
  "How do multispecies cover crops reverse soil organic carbon loss and reduce erosion?",
  "What are the biophysical trade-offs of switching from deep tillage to continuous no-till?",
  "How can biochar amendments improve water holding capacity in sandy drought-prone soils?",
  "Recommend agroforestry windbreaks and hedgerows to protect crops and restore wild pollinators."
];

export const ConsultationView: React.FC<ConsultationViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeMetrics,
}) => {
  const [inputQuery, setInputQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;
    onSendMessage(inputQuery.trim());
    setInputQuery('');
  };

  const handlePromptClick = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        {messages.length === 0 ? (
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-semibold text-stone-900">
                AI Biodiversity & Agroecological Intelligence
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">
                Ask any complex ecological, agroforestry, soil health, or hydrological question.
                DARUKAA.EARTH retrieves peer-reviewed literature (FAO, IPCC, IPBES) and models
                multi-metric causal feedback loops.
              </p>
            </div>

            {/* Starter queries */}
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-3">
                Suggested Research Inquiries
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {SAMPLE_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(q)}
                    className="p-3 rounded-xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-xs text-stone-700 hover:text-emerald-950 flex items-start space-x-2 group"
                  >
                    <ArrowUpRight className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    <span>{q}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-3">
              {msg.role === 'user' ? (
                /* User Message */
                <div className="flex justify-end">
                  <div className="max-w-2xl bg-stone-900 text-stone-50 rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm text-sm">
                    <p className="leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ) : (
                /* Assistant Scientific Diagnostic Message */
                <div className="flex justify-start">
                  <div className="w-full bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
                    {/* Diagnostic Summary Header */}
                    <div className="border-b border-stone-100 pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                            Scientific Diagnostic Assessment
                          </span>
                        </div>
                        {msg.analysis?.evidence_scoring && (
                          <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-200/70 px-2.5 py-0.5 rounded-full text-xs text-emerald-900">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-semibold">
                              Confidence: {msg.analysis.evidence_scoring.confidence_level}
                            </span>
                            <span className="text-emerald-600">
                              ({Math.round(msg.analysis.evidence_scoring.composite_score * 100)}%)
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-stone-800 leading-relaxed">
                        {msg.content}
                      </p>

                      {/* Key Factors */}
                      {msg.analysis?.key_factors && msg.analysis.key_factors.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {msg.analysis.key_factors.map((factor, idx) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200/80 font-medium"
                            >
                              • {factor}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recommendations Section */}
                    {msg.analysis?.recommendations && msg.analysis.recommendations.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Evidence-Grounded Restorative Interventions</span>
                        </h4>

                        <div className="space-y-4">
                          {msg.analysis.recommendations.map((rec) => (
                            <div
                              key={rec.id}
                              className="border border-stone-200 rounded-xl p-4 bg-stone-50/40 hover:bg-stone-50/80 transition-colors space-y-3"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <h5 className="font-semibold text-sm text-stone-900">
                                  {rec.action}
                                </h5>
                                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-900 border border-emerald-200/60 self-start sm:self-auto">
                                  Horizon: {rec.time_horizon}
                                </span>
                              </div>

                              <p className="text-xs text-stone-700 leading-relaxed">
                                {rec.why_it_works}
                              </p>

                              {/* Directional Metric Trajectories */}
                              {rec.expected_direction && Object.keys(rec.expected_direction).length > 0 && (
                                <div>
                                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Projected Metric Trajectories
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                    {Object.entries(rec.expected_direction).map(([metricKey, effect]) => {
                                      const isIncrease = effect.direction === 'increase';
                                      return (
                                        <div
                                          key={metricKey}
                                          className={`p-2 rounded-lg border text-xs flex items-start space-x-2 ${
                                            isIncrease
                                              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                                              : 'bg-teal-50/60 border-teal-200/80 text-teal-950'
                                          }`}
                                        >
                                          {isIncrease ? (
                                            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                          ) : (
                                            <TrendingDown className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                          )}
                                          <div>
                                            <div className="font-semibold capitalize flex items-center space-x-1">
                                              <span>{metricKey.replace(/_/g, ' ')}</span>
                                              <span className="font-mono text-[10px] opacity-80">
                                                ({effect.symbol} {effect.direction})
                                              </span>
                                            </div>
                                            <div className="text-[11px] opacity-85 mt-0.5">
                                              {effect.details}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Scientific Evidence Grounding */}
                              {rec.evidence && rec.evidence.length > 0 && (
                                <div className="pt-2 border-t border-stone-200/60">
                                  <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5 flex items-center space-x-1">
                                    <BookOpen className="w-3 h-3 text-emerald-700" />
                                    <span>Peer-Reviewed Evidence Grounding</span>
                                  </div>
                                  <div className="space-y-1.5">
                                    {rec.evidence.map((ev, eIdx) => (
                                      <div
                                        key={eIdx}
                                        className="text-xs bg-white border border-stone-200 rounded-lg p-2.5 flex items-start justify-between gap-3 shadow-2xs"
                                      >
                                        <div className="space-y-0.5">
                                          <div className="flex items-center space-x-2">
                                            <span className="px-1.5 py-0.2 rounded font-bold text-[10px] bg-stone-100 text-stone-800 border border-stone-200">
                                              {ev.source} ({ev.publication_year})
                                            </span>
                                            <span className="font-medium text-stone-900 line-clamp-1">
                                              {ev.title}
                                            </span>
                                          </div>
                                          <p className="text-[11px] text-stone-600 line-clamp-2">
                                            {ev.evidence_summary}
                                          </p>
                                        </div>
                                        {ev.url && (
                                          <a
                                            href={ev.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 text-emerald-700 hover:text-emerald-900 p-1 hover:bg-emerald-50 rounded"
                                            title="View scientific reference"
                                          >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                          </a>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Conditions & Limitations */}
                              <div className="text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                <div className="p-2 rounded bg-stone-100/70 border border-stone-200/50">
                                  <span className="font-semibold text-stone-700 block mb-0.5">
                                    Suitability Criteria:
                                  </span>
                                  <span className="text-stone-600">{rec.conditions}</span>
                                </div>
                                <div className="p-2 rounded bg-amber-50/60 border border-amber-200/60 text-amber-950">
                                  <span className="font-semibold block mb-0.5 flex items-center space-x-1">
                                    <AlertCircle className="w-3 h-3 text-amber-600" />
                                    <span>Operational Limitations & Trade-offs:</span>
                                  </span>
                                  <span className="text-stone-700">{rec.limitations}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Causal Feedback Loops */}
                    {msg.analysis?.relationships && msg.analysis.relationships.length > 0 && (
                      <div className="space-y-3 pt-3 border-t border-stone-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center space-x-1.5">
                          <GitCommit className="w-4 h-4 text-emerald-600" />
                          <span>Biophysical Causal Propagation Chains</span>
                        </h4>

                        <div className="space-y-2.5">
                          {msg.analysis.relationships.map((rel, rIdx) => (
                            <div
                              key={rIdx}
                              className="bg-stone-50/70 border border-stone-200 rounded-xl p-3.5 space-y-2"
                            >
                              <div className="flex flex-wrap items-center gap-1.5">
                                {rel.variables.map((v, vIdx) => (
                                  <React.Fragment key={vIdx}>
                                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100/80 text-emerald-950 border border-emerald-200/60">
                                      {v}
                                    </span>
                                    {vIdx < rel.variables.length - 1 && (
                                      <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>

                              <ol className="list-decimal list-inside text-xs text-stone-700 space-y-1 pl-1">
                                {rel.chain.map((step, sIdx) => (
                                  <li key={sIdx} className="leading-relaxed">
                                    {step}
                                  </li>
                                ))}
                              </ol>

                              <p className="text-[11px] text-stone-600 italic pt-1 border-t border-stone-200/50">
                                <span className="font-semibold text-stone-700 not-italic">
                                  Mechanistic Principle:{' '}
                                </span>
                                {rel.mechanism}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing Baseline Clarification Prompts */}
                    {msg.analysis?.missing_information?.priority_questions &&
                      msg.analysis.missing_information.priority_questions.length > 0 && (
                        <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 space-y-2.5">
                          <div className="flex items-center space-x-1.5 text-amber-900 font-semibold text-xs">
                            <HelpCircle className="w-4 h-4 text-amber-600" />
                            <span>Calibrate Field Diagnostic Accuracy</span>
                          </div>
                          <p className="text-[11px] text-amber-800 leading-relaxed">
                            Providing these specific site baseline parameters allows the causal engine
                            to refine response latency curves and nitrogen mineralization trade-offs:
                          </p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.analysis.missing_information.priority_questions.map((q, qIdx) => (
                              <button
                                key={qIdx}
                                onClick={() => handlePromptClick(`Regarding: ${q}`)}
                                className="text-left text-xs bg-white hover:bg-amber-100/50 text-stone-800 border border-amber-300/80 px-3 py-1.5 rounded-lg transition-colors shadow-2xs font-medium"
                              >
                                💬 {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm flex items-center space-x-3 text-stone-600 text-xs">
              <div className="w-4 h-4 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin"></div>
              <span>
                Running RAG retrieval across 39 scientific documents & simulating causal equations...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about ecological restoration, cover crops, soil carbon, or erosion..."
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-sm transition-all disabled:bg-stone-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="absolute right-1.5 p-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
