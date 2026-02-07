import { motion } from "framer-motion";
import { AlertOctagon, Clock, Zap, Server, ShieldCheck, Activity } from "lucide-react";
import { clsx } from "clsx";
import { Intervention } from "@/services/api";

interface WarRoomProps {
  interventions: Intervention[];
  onIntervention: (actionId: string) => void;
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

export const WarRoom = ({ interventions, onIntervention }: WarRoomProps) => {
  const categories = ["Engineering", "Product", "Comms"];

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
          <p className="text-sm text-body mt-1">
            Intervention Required • Operational costs will be billed to departmental budget.
          </p>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Actions Column */}
        <div className="col-span-8 space-y-6">
          {categories.map(cat => (
            <div key={cat}>
              <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase mb-4 px-2">{cat} Tactical Ops</h3>
              <div className="grid grid-cols-2 gap-4">
                {interventions
                  .filter(i => i.category === cat)
                  .map((action) => (
                    <motion.button
                      key={action.id}
                      variants={itemVariants}
                      onClick={() => onIntervention(action.id)}
                      className="group p-5 glass-card rounded-2xl text-left transition-all hover:bg-glass-hover hover:border-primary/50 shadow-sm relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <div className="font-bold text-sm text-display group-hover:text-primary transition-colors mb-1">{action.label}</div>
                        <p className="text-xs text-caption line-clamp-2 mb-3">{action.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(action.cost).map(([k, v]) => (
                            <span key={k} className="text-[9px] font-mono font-bold bg-destructive/10 text-destructive px-2 py-0.5 rounded-full uppercase">
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
            </div>
          ))}
        </div>

        {/* Status Column */}
        <div className="col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase">Nodes</h3>
              <Activity className="w-3 h-3 text-success animate-pulse" />
            </div>
            <div className="space-y-4">
              {systemStatus.map((region) => (
                <div key={region.name} className="flex flex-col gap-1.5 py-2 border-b border-glass-border-subtle last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-display">{region.name}</span>
                    <span className={clsx(
                      "text-[10px] font-bold uppercase",
                      region.status === "critical" ? "text-destructive" : region.status === "degraded" ? "text-warning" : "text-success"
                    )}>
                      {region.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-[hsl(var(--glass-border-strong))] rounded-full overflow-hidden">
                      <div 
                        className={clsx(
                          "h-full rounded-full transition-all",
                          region.status === "critical" ? "bg-destructive w-[90%]" : region.status === "degraded" ? "bg-warning w-[45%]" : "bg-success w-[5%]"
                        )}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-caption">{region.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 bg-primary/5 border-primary/20">
            <h3 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" /> System Integrity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-body">Load Balancer</span>
                <span className="text-success font-bold">100%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-body">WAF Layer</span>
                <span className="text-success font-bold">Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-body">Cache Hit Rate</span>
                <span className="text-warning font-bold">72%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};