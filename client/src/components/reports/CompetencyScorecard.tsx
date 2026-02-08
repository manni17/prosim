import React, { useEffect, useState } from 'react';
import { generateCompetencyReport, CompetencyScores } from '@/engine/AssessmentEngine';
import api from '@/services/api';
import { Loader2, Download, ShieldCheck, Brain, Target, Scale, XCircle } from 'lucide-react';

interface Props {
  simulationId: string;
  onClose: () => void;
}

export const CompetencyScorecard: React.FC<Props> = ({ simulationId, onClose }) => {
  const [scores, setScores] = useState<CompetencyScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const state = await api.getState(simulationId);
        const report = await generateCompetencyReport(state, simulationId);
        setScores(report);
      } catch (e) {
        console.error("Assessment Data Fetch Failed:", e);
      } finally {
        setLoading(false);
      }
    };

    if (simulationId && simulationId !== "unknown") {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [simulationId]);

  if (loading) return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-6 py-4 bg-slate-900 border border-white/10 rounded-lg shadow-xl">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-slate-200 font-mono text-sm uppercase tracking-widest">Generating Assessment...</span>
      </div>
    </div>
  );

  if (!scores) return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/90">
      <div className="bg-rose-950/30 border border-rose-500/50 p-8 rounded-2xl text-rose-200 flex flex-col items-center gap-4 max-w-md text-center shadow-2xl">
        <XCircle className="w-12 h-12 text-rose-500" />
        <h3 className="text-xl font-black uppercase italic tracking-tighter">Telemetry Sync Failure</h3>
        <p className="text-sm opacity-70">The behavioral stream for session {simulationId.split('-')[0]} could not be recovered.</p>
        <button onClick={onClose} className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold uppercase text-xs tracking-widest transition-all">Close Diagnostic</button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[600] overflow-y-auto bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 print:bg-white print:p-0">
      <div className="bg-slate-900 border border-white/5 rounded-3xl max-w-5xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden print:shadow-none print:border-none print:bg-white print:text-black">
        
        {/* Header */}
        <div className="flex justify-between items-start p-10 border-b border-white/5 bg-white/2 print:bg-white print:border-black">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic print:text-black">Behavioral Scorecard</h1>
            <p className="text-slate-500 text-[10px] font-black mt-2 font-mono uppercase tracking-[0.2em] print:text-gray-600">
              Protocol: PROSIM-V4 • SID: {simulationId}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black text-primary print:text-black">{scores.overall}</div>
            <div className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 print:text-black">PM Quotient</div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10 bg-slate-900 print:bg-white">
          <ScoreCard 
            title="Conviction" 
            score={scores.conviction} 
            icon={<ShieldCheck className="w-6 h-6" />}
            desc="Measures decision speed and decisiveness. High scores indicate rapid synthesis of incomplete information without analysis paralysis."
          />
          <ScoreCard 
            title="Strategic Consistency" 
            score={scores.strategic_consistency} 
            icon={<Target className="w-6 h-6" />}
            desc="Measures adherence to a unified strategy. Penalizes 'flip-flopping' on key resource allocations (e.g., Budget, Scope)."
          />
          <ScoreCard 
            title="Cognitive Durability" 
            score={scores.cognitive_durability} 
            icon={<Brain className="w-6 h-6" />}
            desc="Measures performance stability under pressure. Evaluates decision quality immediately following Crisis triggers."
          />
          <ScoreCard 
            title="Trade-Off Intelligence" 
            score={scores.trade_off_intelligence} 
            icon={<Scale className="w-6 h-6" />}
            desc="Measures economic efficiency. High scores indicate optimal exchange of Budget for Sentiment/Trust."
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-8 border-t border-white/5 bg-white/2 print:hidden">
          <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
            * Generated Artifact // Behavioral Telemetry Stream
          </div>
          <div className="flex gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-3 text-slate-400 hover:text-white transition-colors font-bold text-xs uppercase tracking-widest"
            >
              Discard
            </button>
            <button 
              onClick={() => window.print()} 
              className="flex items-center px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ScoreCard = ({ title, score, icon, desc }: { title: string, score: number, icon: any, desc: string }) => {
  const getGrade = (s: number) => {
    if (s >= 80) return { color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', label: 'ELITE' };
    if (s >= 60) return { color: 'text-primary border-primary/20 bg-primary/5', label: 'STRONG' };
    if (s >= 40) return { color: 'text-amber-400 border-amber-500/20 bg-amber-500/5', label: 'DEVELOPING' };
    return { color: 'text-rose-400 border-rose-500/20 bg-rose-500/5', label: 'AT RISK' };
  };

  const style = getGrade(score);

  return (
    <div className={`p-8 rounded-2xl border ${style.color} relative overflow-hidden group print:border-black print:text-black print:bg-white`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 font-black print:text-black">
          <span className="p-2 rounded-xl bg-white/5 print:bg-gray-100">{icon}</span>
          <span className="uppercase tracking-tight text-sm">{title}</span>
        </div>
        <div className="text-3xl font-black print:text-black">{score}</div>
      </div>
      <p className="text-[11px] font-medium opacity-60 leading-relaxed min-h-[3rem] print:text-gray-700">{desc}</p>
      
      {/* Visual Bar */}
      <div className="mt-6 h-1.5 bg-white/5 rounded-full overflow-hidden print:bg-gray-200">
        <div className="h-full bg-current opacity-80 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};