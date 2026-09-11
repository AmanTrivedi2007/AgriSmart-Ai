import { Search, Mic, Brain, AlertTriangle, CheckCircle2, ChevronRight, History, Bolt } from 'lucide-react';
import { motion } from 'motion/react';

import { useState } from 'react';
interface AdvisorProps {
  sensorData: any[]
  alertsData: any[]
}

export function Advisor({ sensorData, alertsData }: AdvisorProps) {
  const [farmerQuestion, setFarmerQuestion] = useState('')
const [aiResponse, setAiResponse] = useState('')
const [isLoading, setIsLoading] = useState(false)
const askAdvisor = async () => {
  if (!farmerQuestion.trim()) return
  
  setIsLoading(true)
  setAiResponse('')

  try {
    const response = await fetch(
      'https://amrkhvszctilhhzeowoq.supabase.co/functions/v1/ai-advisor',
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ sensorData, alertsData, farmerQuestion })
      }
    )
    const data = await response.json()
    setAiResponse(data.result)
  } catch (error) {
    setAiResponse('Something went wrong. Please try again.')
  } finally {
    setIsLoading(false)
  }
}

  return (
    <div className="space-y-12">
      {/* Search & AI Input */}
      <section>
        <div className="bg-surface-container-lowest rounded-[2.5rem] p-4 shadow-sm border border-outline-variant/10">
          <div className="flex items-center gap-4 bg-surface-container-low rounded-full px-6 py-4">
            <Search className="text-primary" size={20} />
            <input 
  type="text" 
  placeholder="Ask Farmi AI about your crops..." 
  className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-on-surface-variant/50 font-medium"
  value={farmerQuestion}
  onChange={(e) => setFarmerQuestion(e.target.value)}
/>
            <button className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
              <Mic size={20} fill="currentColor" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 px-2 items-center">
            <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mr-2">Quick queries:</p>
            {['Yield prediction', 'Pest control tips', 'Soil health report'].map(query => (
              <button key={query} className="px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold hover:bg-primary/10 hover:text-primary transition-colors">
                {query}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Hero Analysis */}
      <section>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-primary-container p-8 md:p-12 shadow-2xl text-white">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight tracking-tight">Investigative Insights for Your Soil.</h1>
            <p className="text-white/80 text-lg mb-8 font-medium">Real-time sensor data processed through our custom neural network.</p>
            <button 
  onClick={askAdvisor}
  disabled={isLoading}
  className="bg-surface-container-lowest text-primary font-bold py-4 px-10 rounded-full flex items-center gap-3 hover:scale-105 transition-all shadow-lg group disabled:opacity-50"
>
  {isLoading ? 'Analysing...' : 'Analyse My Farm'}
  <Bolt size={20} className="group-hover:translate-x-1 transition-transform" fill="currentColor" />
</button>
          </div>
          <div className="absolute right-[-5%] top-[-5%] opacity-10 pointer-events-none">
            <Brain size={320} strokeWidth={1} />
          </div>
        </div>
      </section>
      {aiResponse && (
  <div className="bg-surface-container-low/50 rounded-[2.5rem] p-8 border border-surface-container-highest/20">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-tertiary-container text-white p-3 rounded-2xl">
        <Brain size={24} />
      </div>
      <h3 className="text-xl font-bold tracking-tight">Farm Analysis</h3>
    </div>
    <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap">
      {aiResponse}
    </p>
  </div>
)}

{!aiResponse && !isLoading && (
  <div className="text-center py-12 text-on-surface-variant/50">
    <Brain size={48} className="mx-auto mb-4 opacity-30" />
    <p className="font-medium">Ask Farmi AI a question to get your farm analysis</p>
  </div>
)}

{isLoading && (
  <div className="text-center py-12 text-on-surface-variant/50">
    <Brain size={48} className="mx-auto mb-4 opacity-30 animate-pulse" />
    <p className="font-medium">Farmi AI is analysing your farm...</p>
  </div>
)}
    </div>
  );
}
