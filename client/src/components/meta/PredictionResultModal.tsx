import { motion } from "framer-motion";
import { Zap, CheckCircle2, AlertCircle, Trophy } from "lucide-react";
import { clsx } from "clsx";

interface PredictionResult {
  accuracy: number;
  score_gain: number;
  message: string;
  results: Record<string, string>;
}

interface PredictionResultModalProps {
  result: PredictionResult;
  onClose: () => void;
}

export const PredictionResultModal = ({ result, onClose }: PredictionResultModalProps) => {
  const isHighAccuracy = result.accuracy >= 75;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-window w-full max-w-[500px] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-3 text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-8">
          <Zap className="w-4 h-4 fill-primary" /> Strategic Analysis Complete
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black text-display uppercase italic tracking-tighter">
            Post-Mortem
          </h2>
          <div className={clsx(
            "px-4 py-2 rounded-full font-black text-xs tracking-widest uppercase",
            isHighAccuracy ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
          )}>
            Accuracy: {Math.round(result.accuracy)}%
          </div>
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/5 mb-8">
          <div className="flex items-start gap-4">
            {isHighAccuracy ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
            )}
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{result.message}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-4 glass-card rounded-xl border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Impact Score</p>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-lg font-black text-white">+{result.score_gain} XP</span>
            </div>
          </div>
          <div className="p-4 glass-card rounded-xl border-white/5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Product Sense</p>
            <span className="text-lg font-black text-white">{isHighAccuracy ? "Rank: A" : "Rank: C"}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-5 bg-primary hover:bg-primary-hover border border-white/20 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]"
        >
          Proceed to Dashboard
        </button>
      </motion.div>
    </div>
  );
};
