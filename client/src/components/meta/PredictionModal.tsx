import { motion } from "framer-motion";
import { useState } from "react";
import { Zap, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface PredictionModalProps {
  actionLabel: string;
  onConfirm: (prediction: Record<string, number>) => void;
  onCancel: () => void;
}

export const PredictionModal = ({ actionLabel, onConfirm, onCancel }: PredictionModalProps) => {
  const [prediction, setPrediction] = useState<Record<string, number>>({
    revenue: 0,
    trust: 0,
    health: 0,
    morale: 0,
  });

  const metrics = [
    { id: "revenue", label: "Revenue Impact", description: "Long-term growth vs immediate cash." },
    { id: "trust", label: "Stakeholder Trust", description: "Confidence from the board & users." },
    { id: "health", label: "System Health", description: "Stability vs speed of execution." },
    { id: "morale", label: "Team Morale", description: "Engineering fatigue & alignment." },
  ];

  const getLabel = (val: number) => {
    if (val === 2) return "Massive Increase";
    if (val === 1) return "Slight Increase";
    if (val === 0) return "Neutral";
    if (val === -1) return "Slight Decrease";
    if (val === -2) return "Massive Decrease";
    return "Neutral";
  };

  const getColor = (val: number) => {
    if (val > 0) return "text-emerald-400";
    if (val < 0) return "text-rose-400";
    return "text-slate-400";
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-window w-full max-w-[550px] p-10 border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center gap-3 text-[10px] font-black text-primary tracking-[0.3em] uppercase mb-8">
          <Zap className="w-4 h-4 fill-primary" /> Strategic Directive Allocation
        </div>

        <h2 className="text-3xl font-black text-display mb-3 uppercase italic tracking-tighter">
          Hypothesis Lock
        </h2>
        <p className="text-sm text-slate-400 mb-10 leading-relaxed max-w-[400px]">
          Predict the directional impact of <span className="text-white font-bold underline decoration-primary">"{actionLabel}"</span>. 
          The Board will grade your product sense based on the accuracy of this forecast.
        </p>

        <div className="space-y-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-wider">{metric.label}</p>
                  <p className="text-[10px] text-slate-500">{metric.description}</p>
                </div>
                <span className={clsx("text-[10px] font-black font-mono uppercase", getColor(prediction[metric.id]))}>
                  {getLabel(prediction[metric.id])}
                </span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="1"
                value={prediction[metric.id]}
                onChange={(e) => setPrediction(prev => ({ ...prev, [metric.id]: parseInt(e.target.value) }))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mt-10">
          <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-tight">
            Commitment is final. Once the directive is issued, the simulation will advance and telemetry will be compared against your forecast.
          </p>
        </div>

        <div className="flex gap-4 mt-10">
          <button
            onClick={onCancel}
            className="flex-1 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all"
          >
            Abort
          </button>
          <button
            onClick={() => onConfirm(prediction)}
            className="flex-[2] py-5 bg-primary hover:bg-primary-hover border border-white/20 rounded-2xl font-black text-[10px] tracking-[0.2em] uppercase transition-all shadow-[0_0_30px_rgba(59,130,246,0.4)]"
          >
            Issue Directive
          </button>
        </div>
      </motion.div>
    </div>
  );
};