import { motion } from "framer-motion";
import { Zap, Shield, Target, ChevronRight } from "lucide-react";

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen = ({ onStart }: StartScreenProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center canvas-default overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-xl glass-window p-12 relative overflow-hidden"
      >
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-8">
            <Zap className="w-3 h-3" /> System Initialization
          </div>
          
          <h1 className="text-5xl font-black text-display tracking-tighter mb-4 italic">
            proSIM OS
          </h1>
          <p className="text-body text-sm leading-relaxed mb-12 max-w-md mx-auto">
            Welcome to the Hot Seat. Your objective is to scale the ecommerce engine to $100k ARR while maintaining system stability and stakeholder trust.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-12">
            <MissionStat icon={<Target className="w-4 h-4" />} label="Objective" value="$100k" />
            <MissionStat icon={<Shield className="w-4 h-4" />} label="Clearance" value="Level 1" />
            <MissionStat icon={<Zap className="w-4 h-4" />} label="Status" value="Standby" />
          </div>

          <button
            onClick={onStart}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-sm tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
          >
            Initialize Environment
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MissionStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 glass-card rounded-xl flex flex-col items-center gap-1">
    <div className="text-primary mb-1">{icon}</div>
    <div className="text-[9px] font-bold text-caption uppercase tracking-tighter">{label}</div>
    <div className="text-xs font-bold text-display">{value}</div>
  </div>
);
