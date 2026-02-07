import { motion } from "framer-motion";
import { Wifi, Battery, Volume2, Heart, Zap, Shield, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { GameState } from "@/services/api";
import { useProgressiveValue } from "@/hooks/useProgressiveValue";
import { toast } from "sonner";

interface TopBarProps {
  gameState: GameState;
}

export const TopBar = ({ gameState }: TopBarProps) => {
  const [time, setTime] = useState(new Date());
  
  const progHealth = useProgressiveValue(gameState.health * 100);
  const progMorale = useProgressiveValue(gameState.morale * 100);
  const progTrust = useProgressiveValue(gameState.trust * 100);
  const progSense = useProgressiveValue(gameState.product_sense_score);

  useEffect(() => {
    if (gameState.last_prediction_results) {
      const results = gameState.last_prediction_results;
      const allCorrect = Object.values(results.results).every(v => v === "CORRECT");
      
      if (allCorrect) {
        toast.success("Strategic Insight: 100% Accuracy", {
          description: `Score Gain: +${results.score_gain}`
        });
      } else {
        toast.warning("Prediction Mismatch", {
          description: `Trust: ${results.results.trust}. Revenue: ${results.results.revenue}.`
        });
      }
    }
  }, [gameState.last_prediction_results]);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-7 px-4 flex items-center justify-between"
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-[hsl(var(--text-inverse))] opacity-90">
          Steller OS
        </span>
      </div>

      {/* Center - Time */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-3">
        <span className="text-xs font-medium text-[hsl(var(--text-inverse))] opacity-90">
          {formattedDate}
        </span>
        <span className="text-xs font-semibold text-[hsl(var(--text-inverse))]">
          {formattedTime}
        </span>
      </div>

      {/* Right - Status Icons */}
      <div className="flex items-center gap-4">
        {/* Metrics */}
        <div className="flex items-center gap-3 mr-2">
          <div className="flex items-center gap-1.5 text-red-400">
            <Heart className="w-3 h-3" />
            <span className="text-[10px] font-bold font-mono">{progHealth.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400">
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-bold font-mono">{progMorale.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3 h-3" />
            <span className="text-[10px] font-bold font-mono">{progTrust.toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-purple-400 ml-2">
            <Brain className="w-3 h-3" />
            <span className="text-[10px] font-bold font-mono">{progSense.toFixed(0)}</span>
          </div>
        </div>

        <div className="h-3 w-px bg-[hsl(var(--text-inverse))] opacity-20" />

        <Volume2 className="w-3.5 h-3.5 text-[hsl(var(--text-inverse))] opacity-80" />
        <Wifi className="w-3.5 h-3.5 text-[hsl(var(--text-inverse))] opacity-80" />
        <div className="flex items-center gap-1">
          <Battery className="w-4 h-4 text-[hsl(var(--text-inverse))] opacity-80" />
          <span className="text-[10px] font-medium text-[hsl(var(--text-inverse))] opacity-80">
            100%
          </span>
        </div>
      </div>
    </motion.header>
  );
};
