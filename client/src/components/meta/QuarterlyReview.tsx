import { motion } from "framer-motion";
import { useState } from "react";
import { Rocket, ShieldCheck, DollarSign, Check } from "lucide-react";
import { clsx } from "clsx";

interface QuarterlyReviewProps {
  currentLevel: number;
  onCommit: (focusId: string) => void;
}

const strategies = [
  {
    id: "blitzscale",
    title: "Blitzscale",
    icon: Rocket,
    description: "Aggressive growth at any cost. Flood the system with traffic and capture market share.",
    modifiers: ["+30% Traffic Volume", "+10% Operating Costs"],
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30"
  },
  {
    id: "fortify",
    title: "Fortify",
    icon: ShieldCheck,
    description: "Prioritize system stability and team morale. Pay down technical debt and optimize ops.",
    modifiers: ["+20% Stability Retention", "-10% Traffic Overhead"],
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30"
  },
  {
    id: "monetize",
    title: "Monetize",
    icon: DollarSign,
    description: "Extract maximum value from current traffic. Increase margins and average basket size.",
    modifiers: ["+20% Average Order Value", "-5% Conversion Friction"],
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30"
  }
];

export const QuarterlyReview = ({ currentLevel, onCommit }: QuarterlyReviewProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-[250] bg-slate-950/80 backdrop-blur-3xl flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl relative"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-6"
          >
            Quarter {currentLevel} Concluded
          </motion.div>
          <h1 className="text-4xl font-black text-display tracking-tighter mb-4 italic uppercase">
            Quarterly Business Review
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Your performance has been reviewed by the board. Define the strategic directive for Quarter {currentLevel + 1} to begin calibration.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {strategies.map((strat) => {
            const isSelected = selected === strat.id;
            const Icon = strat.icon;

            return (
              <motion.div
                key={strat.id}
                whileHover={{ y: -8 }}
                onClick={() => setSelected(strat.id)}
                className={clsx(
                  "p-8 glass-card rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group",
                  isSelected 
                    ? `${strat.borderColor} ${strat.bgColor} shadow-[0_0_40px_rgba(59,130,246,0.15)]` 
                    : "border-glass-border-subtle hover:border-white/20 bg-white/5"
                )}
              >
                <div className={clsx(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors shadow-lg",
                  isSelected ? "bg-primary text-primary-foreground" : "glass-card text-caption"
                )}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-bold text-display mb-3">{strat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-8 h-12 line-clamp-3 italic">
                  "{strat.description}"
                </p>

                <div className="space-y-3 mb-8">
                  {strat.modifiers.map((mod, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold tracking-tight">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      <span className="text-slate-300 uppercase">{mod}</span>
                    </div>
                  ))}
                </div>

                <div className={clsx(
                  "absolute top-6 right-6 w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                  isSelected ? "bg-emerald-500 border-emerald-500 text-white scale-110" : "border-slate-700 text-transparent scale-100"
                )}>
                  <Check className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            disabled={!selected}
            onClick={() => selected && onCommit(selected)}
            className={clsx(
              "px-12 py-4 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all shadow-2xl",
              selected 
                ? "bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-primary/30" 
                : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-50 grayscale"
            )}
          >
            Confirm Strategic Directive
          </button>
        </div>
      </motion.div>
    </div>
  );
};
