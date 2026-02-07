import { motion } from "framer-motion";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { RefreshCw, FileWarning, CheckCircle2, Download } from "lucide-react";
import { GameState } from "@/services/api";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { toast } from "sonner";

interface ReportCardProps {
  gameState: GameState;
  onRetry: () => void;
}

export const ReportCard = ({ gameState, onRetry }: ReportCardProps) => {
  const isVictory = gameState.status === 'VICTORY' || gameState.status === 'WON';
  const cause = gameState.termination_details?.cause || "Unknown Error";
  const notes = gameState.termination_details?.notes || "No additional details provided by HR.";
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const calculateGrade = (val: number) => {
    if (val > 0.8) return 'A';
    if (val > 0.6) return 'B';
    if (val > 0.4) return 'C';
    return 'D';
  };

  const handleExport = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    toast("Generating credential artifact...");

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2, // High DPI
        useCORS: true,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `prosim_report_${gameState.current_level}_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Artifact downloaded.");
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Failed to generate report.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-3xl flex items-center justify-center p-8">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl glass-window p-12 overflow-hidden relative shadow-2xl border-l-4 border-l-red-500"
      >
        <div className="absolute top-0 right-0 p-4 opacity-50">
          <FileWarning className="w-24 h-24 text-red-500/20 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-12">
          {/* Left Column: Narrative */}
          <div className="flex-1 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold tracking-widest uppercase mb-4">
                Official HR Document
              </div>
              <h1 className="text-4xl font-black text-display uppercase tracking-tighter mb-2">
                {isVictory ? "Mission Accomplished" : "Notice of Termination"}
              </h1>
              <p className="text-body font-mono text-xs uppercase tracking-widest opacity-70">
                Ref: {gameState.player_name.toUpperCase()} // Q{gameState.current_level}
              </p>
            </div>

            {!isVictory && (
              <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-xl">
                <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">Primary Cause</h3>
                <div className="text-2xl font-bold text-red-500 mb-4">{cause}</div>
                <h3 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2">HR Notes</h3>
                <p className="text-sm text-red-200/80 leading-relaxed font-mono">
                  "{notes}"
                </p>
              </div>
            )}

            <div>
              <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase mb-4">Audit Logs</h3>
              <div className="h-40 glass-card rounded-xl p-4 border-dashed border-glass-border-subtle">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={gameState.history}>
                    <defs>
                      <linearGradient id="auditGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="turn_index" hide />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ background: "hsl(var(--glass-card))", border: "1px solid hsl(var(--glass-border-subtle))", borderRadius: "8px", backdropFilter: "blur(12px)" }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#ef4444" fill="url(#auditGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column: Stats */}
          <div className="w-full md:w-80 flex flex-col justify-between border-l border-glass-border-subtle pl-12">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase">Severance Assessment</h3>
              
              <GradeItem label="Health Status" grade={calculateGrade(gameState.health)} color="text-red-500" />
              <GradeItem label="Team Morale" grade={calculateGrade(gameState.morale)} color="text-blue-500" />
              <GradeItem label="Trust Index" grade={calculateGrade(gameState.trust)} color="text-emerald-500" />
            </div>

            <div className="pt-12 space-y-4">
              <div>
                <div className="text-[10px] font-bold text-caption tracking-widest uppercase mb-1">Final Valuation</div>
                <div className="text-3xl font-black text-display font-mono">${gameState.revenue.toLocaleString()}</div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onRetry}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
                >
                  <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  {isVictory ? "Start New Career" : "Appeal Decision"}
                </button>

                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-3 bg-slate-800/50 text-slate-300 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-slate-800 hover:text-white transition-all border border-transparent hover:border-slate-600 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <span className="animate-pulse">Rendering...</span>
                  ) : (
                    <>
                      <Download className="w-3 h-3" />
                      Export Record
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const GradeItem = ({ label, grade, color }: { label: string, grade: string, color: string }) => (
  <div className="flex items-center justify-between p-3 border-b border-glass-border-subtle">
    <span className="text-[10px] font-bold text-muted-foreground uppercase">{label}</span>
    <span className={`text-lg font-black ${color} font-mono`}>{grade}</span>
  </div>
);
