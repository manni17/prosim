import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";

interface PredictionModalProps {
  actionLabel: string;
  onConfirm: (prediction: Record<string, string>) => void;
  onCancel: () => void;
}

export const PredictionModal = ({ actionLabel, onConfirm, onCancel }: PredictionModalProps) => {
  const [prediction, setPrediction] = useState<Record<string, string>>({
    revenue: "neutral",
    trust: "neutral",
  });

  const metrics = [
    { id: "revenue", label: "Revenue Impact" },
    { id: "trust", label: "Stakeholder Trust" },
  ];

  const options = [
    { id: "increase", label: "Increase", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/50" },
    { id: "neutral", label: "Neutral", icon: Minus, color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30" },
    { id: "decrease", label: "Decrease", icon: TrendingDown, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/50" },
  ];

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-md pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-window w-full max-w-[450px] p-8 border-white/20 shadow-[0_50px_100px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-6">
          <Zap className="w-3 h-3" /> Strategic Forecast Required
        </div>

        <h2 className="text-2xl font-black text-display mb-2 uppercase italic italic">
          Hypothesis Lock
        </h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Predict the impact of <span className="text-white font-bold">"{actionLabel}"</span> before committing to the directive. Your Product Sense score depends on accuracy.
        </p>

        <div className="space-y-8">
          {metrics.map((metric) => (
            <div key={metric.id}>
              <p className="text-[10px] font-bold text-caption tracking-widest uppercase mb-3">{metric.label}</p>
              <div className="grid grid-cols-3 gap-2">
                {options.map((opt) => {
                  const isActive = prediction[metric.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setPrediction(prev => ({ ...prev, [metric.id]: opt.id }))}
                      className={clsx(
                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200",
                        isActive ? `${opt.bg} ${opt.border} scale-[1.02]` : "bg-white/5 border-white/5 hover:bg-white/10"
                      )}
                    >
                      <opt.icon className={clsx("w-5 h-5", isActive ? opt.color : "text-slate-500")} />
                      <span className={clsx("text-[10px] font-bold uppercase tracking-tighter", isActive ? "text-white" : "text-slate-500")}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-10">
          <button
            onClick={onCancel}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all"
          >
            Abort
          </button>
          <button
            onClick={() => onConfirm(prediction)}
            className="flex-[2] py-4 bg-primary hover:bg-primary-hover border border-white/10 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            Commit Strategy
          </button>
        </div>
      </motion.div>
    </div>
  );
};
