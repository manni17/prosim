import { motion } from "framer-motion";
import { ShoppingBag, Zap, Shield, Users, Globe, Rocket, CheckCircle2 } from "lucide-react";
import { clsx } from "clsx";

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: any;
}

const availableUpgrades: Upgrade[] = [
  { id: "cdn", name: "Global CDN", description: "Reduce latency across all regions.", cost: 15000, icon: Globe },
  { id: "waf", name: "Enterprise WAF", description: "Block 99% of malicious bot traffic.", cost: 25000, icon: Shield },
  { id: "ai_cx", name: "AI Support", description: "Improve trust through 24/7 instant replies.", cost: 40000, icon: Rocket },
  { id: "scaling", name: "Auto-Scaling", description: "Dynamically handle traffic spikes.", cost: 60000, icon: Zap },
  { id: "referral", name: "Referral Engine", description: "Viral loop for exponential traffic.", cost: 100000, icon: Users },
];

interface MarketplaceProps {
  revenue: number;
  onBuy: (id: string) => void;
}

export const Marketplace = ({ revenue, onBuy }: MarketplaceProps) => {
  return (
    <div className="p-8 h-full flex flex-col gap-8 overflow-y-auto no-scrollbar">
      <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-black text-display uppercase tracking-tight">Q2 Growth Marketplace</h2>
          <p className="text-sm text-body">Invest your revenue into long-term infrastructure and growth.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-caption tracking-widest uppercase mb-1">Available Capital</div>
          <div className="text-3xl font-black text-primary font-mono">${revenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pb-8">
        {availableUpgrades.map((upgrade) => {
          const canAfford = revenue >= upgrade.cost;
          const Icon = upgrade.icon;

          return (
            <motion.div
              key={upgrade.id}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center border border-glass-border-subtle group-hover:border-primary/30 transition-colors">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-caption tracking-widest uppercase mb-1">Cost</div>
                    <div className="text-lg font-bold text-display font-mono">${upgrade.cost.toLocaleString()}</div>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-display mb-2">{upgrade.name}</h3>
                <p className="text-sm text-body leading-relaxed mb-6">{upgrade.description}</p>
              </div>

              <button
                disabled={!canAfford}
                onClick={() => onBuy(upgrade.id)}
                className={clsx(
                  "w-full py-3 rounded-xl font-bold text-xs tracking-widest transition-all shadow-lg",
                  canAfford 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20 active:scale-95" 
                    : "bg-slate-800 text-slate-600 cursor-not-allowed grayscale border border-slate-700"
                )}
              >
                {canAfford ? "PURCHASE UPGRADE" : "INSUFFICIENT FUNDS"}
              </button>

              <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
