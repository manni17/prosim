import React, { useEffect, useState } from 'react';
import { generateCompetencyReport, CompetencyScores } from '@/engine/AssessmentEngine';
import { GameState } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Download, ShieldCheck, Brain, Target, Scale, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface CompetencyScorecardProps {
  gameState: GameState;
  sessionId: string;
  onClose: () => void;
}

export const CompetencyScorecard = ({ gameState, sessionId, onClose }: CompetencyScorecardProps) => {
  const [scores, setScores] = useState<CompetencyScores | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCompetencyReport(gameState, sessionId)
      .then(setScores)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [gameState, sessionId]);

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-window w-full max-w-[800px] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
      >
        {/* Background Aura */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        
        <div className="flex items-center gap-3 text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-8 relative z-10">
          <Zap className="w-4 h-4 fill-primary" /> Behavioral Assessment System
        </div>

        <div className="flex justify-between items-end mb-12 relative z-10">
          <div>
            <h2 className="text-4xl font-black text-display uppercase italic tracking-tighter">
              Competency Scorecard
            </h2>
            <p className="text-sm text-slate-500 font-mono mt-2">
              SID: {sessionId.split('-')[0]}... // PROSIM PROTOCOL V4.0
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-black text-white tracking-tighter tabular-nums">
              {loading ? "--" : scores?.overall}
            </div>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">PM Quotient (PQ)</p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Processing Behavioral Stream...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 relative z-10">
            <MetricCard 
              title="Conviction" 
              score={scores!.conviction} 
              icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              desc="Speed and decisiveness under incomplete information."
            />
            <MetricCard 
              title="Consistency" 
              score={scores!.strategic_consistency} 
              icon={<Target className="w-5 h-5 text-blue-400" />}
              desc="Adherence to strategic pillars; avoidance of reversals."
            />
            <MetricCard 
              title="Durability" 
              score={scores!.cognitive_durability} 
              icon={<Brain className="w-5 h-5 text-purple-400" />}
              desc="Performance stability following crisis narrative triggers."
            />
            <MetricCard 
              title="Trade-Offs" 
              score={scores!.trade_off_intelligence} 
              icon={<Scale className="w-5 h-5 text-amber-400" />}
              desc="Efficiency of resource exchange (Revenue vs Trust)."
            />
          </div>
        )}

        <div className="flex gap-4 mt-12 relative z-10">
          <button
            onClick={onClose}
            className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all"
          >
            Close Analyst
          </button>
          <button
            onClick={() => window.print()}
            className="flex-1 py-5 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Assessment (PDF)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MetricCard = ({ title, score, icon, desc }: { title: string, score: number, icon: React.ReactNode, desc: string }) => {
  const isHigh = score >= 80;
  const isLow = score < 50;

  return (
    <div className="p-6 rounded-2xl bg-white/2 border border-white/5 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            {icon}
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">{title}</h4>
            <span className={clsx(
              "text-[9px] font-bold uppercase",
              isHigh ? "text-emerald-400" : isLow ? "text-rose-400" : "text-slate-500"
            )}>
              {isHigh ? "Mastery" : isLow ? "Risk" : "Standard"}
            </span>
          </div>
        </div>
        <div className="text-2xl font-black text-white font-mono">{score}</div>
      </div>
      <p className="text-[10px] text-slate-500 leading-relaxed pr-4">{desc}</p>
      
      {/* Mini Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={clsx(
            "h-full",
            isHigh ? "bg-emerald-500" : isLow ? "bg-rose-500" : "bg-primary"
          )} 
        />
      </div>
    </div>
  );
};
