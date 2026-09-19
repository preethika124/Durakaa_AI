import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BaselineProfilePanel } from './components/BaselineProfilePanel';
import { ConsultationView } from './components/ConsultationView';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer';
import { CausalSimulatorView } from './components/CausalSimulatorView';
import { AuditLogView } from './components/AuditLogView';
import { ChatMessage, EnvironmentalMetrics } from './types/environmental';

export default function App() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'knowledge' | 'causal' | 'audit'>('consultation');
  const [systemStatus, setSystemStatus] = useState<{
    status: string;
    documents_count: number;
    chunks_count: number;
  } | null>(null);

  const [activeMetrics, setActiveMetrics] = useState<EnvironmentalMetrics>({
    soil_organic_carbon: 0.8,
    soil_ph: 6.2,
    soil_moisture: 'low',
    soil_erosion: 'moderate',
    tillage: 'conventional_deep',
    rainfall: 480,
    temperature: 21,
    pesticide_use: 'moderate',
    crop: 'monoculture wheat',
    land_use: 'cropland'
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [conversationId, setConversationId] = useState<string>('conv_' + Date.now());

  // Load system health on mount
  useEffect(() => {
    fetchSystemStatus();
    // Auto-load initial restorative analysis
    runInitialAnalysis();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setSystemStatus(data);
      }
    } catch (err) {
      console.error('Failed to load system status:', err);
    }
  };

  const runInitialAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'Perform initial baseline assessment: How do multispecies cover crops and reduced tillage reverse soil organic carbon loss and minimize erosion on degraded cropland?',
          environment: activeMetrics,
          conversation_id: conversationId
        })
      });

      if (res.ok) {
        const data = await res.json();
        const initialUserMsg: ChatMessage = {
          id: 'msg_init_user',
          role: 'user',
          content: 'Perform initial baseline assessment: How do multispecies cover crops and reduced tillage reverse soil organic carbon loss and minimize erosion on degraded cropland?',
          created_at: new Date().toISOString()
        };
        const initialAssistantMsg: ChatMessage = {
          id: 'msg_init_asst',
          role: 'assistant',
          content: data.analysis.assessment,
          analysis: data.analysis,
          clarification_prompt: data.analysis.missing_information?.priority_questions,
          created_at: new Date().toISOString()
        };
        setMessages([initialUserMsg, initialAssistantMsg]);
        if (data.environmental_profile) {
          setActiveMetrics((prev) => ({ ...prev, ...data.environmental_profile }));
        }
      }
    } catch (err) {
      console.error('Initial analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: queryText,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: queryText,
          conversation_id: conversationId,
          environment: activeMetrics
        })
      });

      if (res.ok) {
        const data = await res.json();
        const asstMsg: ChatMessage = {
          id: 'asst_' + Date.now(),
          role: 'assistant',
          content: data.message,
          analysis: data.analysis,
          clarification_prompt: data.clarification_prompt,
          created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, asstMsg]);
        if (data.environmental_profile) {
          setActiveMetrics((prev) => ({ ...prev, ...data.environmental_profile }));
        }
      }
    } catch (err) {
      console.error('Chat inquiry failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetricsChange = (updated: Partial<EnvironmentalMetrics>) => {
    setActiveMetrics((prev) => ({ ...prev, ...updated }));
  };

  const handleApplyPreset = (presetName: string) => {
    console.log(`Applied baseline preset: ${presetName}`);
  };

  const handleReloadSeed = async () => {
    setIsReloading(true);
    try {
      const res = await fetch('/api/seed/reload', { method: 'POST' });
      if (res.ok) {
        await fetchSystemStatus();
      }
    } catch (err) {
      console.error('Failed to reload seed:', err);
    } finally {
      setIsReloading(false);
    }
  };

  const handleSelectTopicForConsultation = (topic: string) => {
    setActiveTab('consultation');
    handleSendMessage(`Provide a comprehensive ecological assessment and implementation pathway for: ${topic}`);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans antialiased">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        onReloadSeed={handleReloadSeed}
        isReloading={isReloading}
      />

      {/* Main App Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {activeTab === 'consultation' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            {/* Left Column: Environmental Baseline & Field Profile */}
            <div className="lg:col-span-4 space-y-4">
              <BaselineProfilePanel
                metrics={activeMetrics}
                onChange={handleMetricsChange}
                onApplyPreset={handleApplyPreset}
              />
            </div>

            {/* Right Column: Active Consultation & Causal Feedback Feed */}
            <div className="lg:col-span-8 flex flex-col min-h-[650px] lg:h-full">
              <ConsultationView
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                activeMetrics={activeMetrics}
              />
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="flex-1 min-h-[650px]">
            <KnowledgeBaseExplorer
              onSelectTopicForConsultation={handleSelectTopicForConsultation}
            />
          </div>
        )}

        {activeTab === 'causal' && (
          <div className="flex-1 min-h-[650px]">
            <CausalSimulatorView />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="flex-1 min-h-[650px]">
            <AuditLogView
              onReloadSeed={handleReloadSeed}
              isReloading={isReloading}
              systemStatus={systemStatus}
            />
          </div>
        )}
      </main>
    </div>
  );
}
