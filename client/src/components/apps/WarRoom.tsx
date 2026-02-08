import { motion } from "framer-motion";
import { AlertOctagon, Zap, Activity, ShieldCheck, Server, Send, Users } from "lucide-react";
import { clsx } from "clsx";
import { Intervention } from "@/services/api";
import { parseWikiLinks } from "@/utils/textParser";

interface WarRoomProps {
  interventions: Intervention[];
  onIntervention: (actionId: string) => void;
  wiki: Record<string, any>;
}

const systemStatus = [
  { name: "US-East-1", status: "critical", latency: "2,450ms" },
  { name: "US-West-2", status: "degraded", latency: "890ms" },
  { name: "EU-Central-1", status: "operational", latency: "45ms" },
  { name: "AP-Southeast-1", status: "operational", latency: "78ms" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

export const WarRoom = ({ interventions, onIntervention, wiki }: WarRoomProps) => {
  const engineeringInterventions = interventions.filter(i => i.category === "Engineering");
  const productInterventions = interventions.filter(i => i.category === "Product");
  const commsInterventions = interventions.filter(i => i.category === "Comms");

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 overflow-y-auto max-h-full no-scrollbar"
    >
      {/* Header Alert Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex items-center gap-6 shadow-2xl"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-14 h-14 rounded-2xl bg-destructive flex items-center justify-center shadow-lg shadow-destructive/20"
        >
          <AlertOctagon className="w-7 h-7 text-destructive-foreground" />
        </motion.div>
        <div className="flex-1">
          <h2 className="text-xl font-black text-destructive tracking-tight uppercase">
            Active Incident: System Instability Detected
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Intervention Required • Operational costs will be billed to departmental budget.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Actions Column */}
        <div className="col-span-8 space-y-8">
          <section>
            <h3 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-4 px-2">Engineering Tactical Ops</h3>
            <div className="grid grid-cols-2 gap-4">
              {engineeringInterventions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={itemVariants}
                  onClick={() => onIntervention(action.id)}
                  className="group p-5 glass-card rounded-2xl text-left transition-all hover:bg-white/5 hover:border-primary/50 shadow-sm relative overflow-hidden border border-white/5"
                >
                  <div className="relative z-10">
                    <div className="font-bold text-sm text-display group-hover:text-primary transition-colors mb-1 uppercase tracking-tight">{action.label}</div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">{parseWikiLinks(action.description, wiki)}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(action.cost).map(([k, v]) => (
                        <span key={k} className="text-[9px] font-mono font-black bg-destructive/10 text-destructive px-2 py-0.5 rounded-md uppercase">
                          {k[0]}: {v > 100 ? `${Math.round(v/1000)}k` : v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-12 h-12" />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-accent tracking-[0.2em] uppercase mb-4 px-2">Product Strategic Interventions</h3>
            <div className="grid grid-cols-2 gap-4">
              {productInterventions.map((action) => (
                <motion.button
                  key={action.id}
                  variants={itemVariants}
                  onClick={() => onIntervention(action.id)}
                  className="group p-5 glass-card rounded-2xl text-left transition-all hover:bg-white/5 hover:border-accent/50 shadow-sm relative overflow-hidden border border-white/5"
                >
                  <div className="relative z-10">
                    <div className="font-bold text-sm text-display group-hover:text-accent transition-colors mb-1 uppercase tracking-tight">{action.label}</div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">{parseWikiLinks(action.description, wiki)}</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(action.cost).map(([k, v]) => (
                        <span key={k} className="text-[9px] font-mono font-black bg-destructive/10 text-destructive px-2 py-0.5 rounded-md uppercase">
                          {k[0]}: {v > 100 ? `${Math.round(v/1000)}k` : v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                    <Activity className="w-12 h-12" />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </div>

        {/* Status Column */}
        <div className="col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Telemetry Nodes</h3>
              <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              {systemStatus.map((region) => (
                <div key={region.name} className="flex flex-col gap-1.5 py-2 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter">{region.name}</span>
                    <span className={clsx(
                      "text-[9px] font-black uppercase",
                      region.status === "critical" ? "text-destructive" : region.status === "degraded" ? "text-warning" : "text-emerald-500"
                    )}>
                      {region.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={clsx(
                          "h-full rounded-full transition-all",
                          region.status === "critical" ? "bg-destructive w-[90%]" : region.status === "degraded" ? "bg-warning w-[45%]" : "bg-emerald-500 w-[5%]"
                        )}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-500">{region.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 border border-white/5 bg-primary/5">
            <h3 className="text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-6">Crisis Communications</h3>
            <div className="space-y-3">
              {commsInterventions.map(action => (
                <button
                  key={action.id}
                  onClick={() => onIntervention(action.id)}
                  className="w-full p-4 glass-card rounded-xl text-left hover:bg-primary/10 transition-all border border-white/5 flex items-start gap-3 group"
                >
                  <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {action.id.includes('email') ? <Send className="w-3 h-3 text-primary" /> : <Users className="w-3 h-3 text-primary" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{action.label}</p>
                    <p className="text-[9px] text-slate-500 uppercase font-bold">Cost: ${Object.values(action.cost)[0] || 0}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};