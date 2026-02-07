import { motion } from "framer-motion";
import { User, Shield, LogOut, Terminal } from "lucide-react";
import { GameState } from "@/services/api";

interface SettingsProps {
  gameState: GameState;
  onResign: () => void;
}

export const Settings = ({ gameState, onResign }: SettingsProps) => {
  return (
      <div className="flex gap-8 max-w-4xl w-full">
        {/* Profile Card */}
        <div className="w-1/3 flex flex-col items-center p-8 glass-card rounded-2xl border-glass-border-subtle">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl mb-6 shadow-xl border-2 border-white/10 uppercase">
          {gameState.player_name.charAt(0)}
        </div>
        <h2 className="text-xl font-black text-display tracking-tight">{gameState.player_name}</h2>
        <p className="text-xs font-bold text-primary tracking-widest uppercase mt-1 opacity-80">{gameState.job_title}</p>
        
        <div className="w-full mt-8 pt-8 border-t border-glass-border-subtle space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Clearance</span>
            <span className="text-xs font-bold text-display">Lvl {gameState.current_level}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Session ID</span>
            <span className="text-[9px] font-mono text-slate-400 opacity-50 uppercase truncate ml-4">Authorized</span>
          </div>
        </div>
      </div>

      {/* System Controls */}
      <div className="flex-1 flex flex-col gap-8">
        <section>
          <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Shield className="w-3 h-3" /> Strategic Identity
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 glass-card rounded-xl border-glass-border-subtle">
              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Archetype</p>
              <p className="text-sm font-bold text-display capitalize">{gameState.strategy_archetype}</p>
            </div>
            <div className="p-4 glass-card rounded-xl border-glass-border-subtle">
              <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Status</p>
              <p className="text-sm font-bold text-emerald-500 uppercase">Active_Duty</p>
            </div>
          </div>
        </section>

        <section className="flex-1">
          <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-4 flex items-center gap-2">
            <Terminal className="w-3 h-3" /> Console Preferences
          </h3>
          <div className="p-4 glass-card rounded-xl border-glass-border-subtle opacity-50 cursor-not-allowed flex items-center justify-between">
            <span className="text-sm text-body italic">Glass Materials</span>
            <div className="w-8 h-4 bg-primary rounded-full flex items-center justify-end px-1">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
          </div>
        </section>

        <section className="pt-8 border-t border-glass-border-subtle">
          <button
            onClick={() => {
              if (confirm("SUBMIT RESIGNATION? Access to proSIM OS will be terminated and performance will be reviewed.")) {
                onResign();
              }
            }}
            className="w-full py-4 border border-destructive/50 hover:bg-destructive/10 text-destructive rounded-xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Resign Simulation
          </button>
        </section>
      </div>
    </div>
  );
};
