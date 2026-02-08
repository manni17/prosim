import { motion } from "framer-motion";
import { BarChart3, Mail, AlertTriangle, Settings, MessageSquare, ShoppingBag } from "lucide-react";
import { clsx } from "clsx";

interface DockProps {
  activeApp: string;
  onAppChange: (app: string) => void;
}

const dockItems = [
  { id: "maxpanel", icon: BarChart3, label: "Analytics" },
  { id: "inbox", icon: Mail, label: "Inbox" },
  { id: "warroom", icon: AlertTriangle, label: "War Room" },
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "marketplace", icon: ShoppingBag, label: "Marketplace" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const Dock = ({ activeApp, onAppChange }: DockProps) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.23, 1, 0.32, 1],
        delay: 0.3 
      }}
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50"
    >
      <div className="glass-dock rounded-3xl px-3 py-3 flex items-center gap-2 border border-white/10 shadow-2xl">
        {dockItems.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            isActive={activeApp === item.id}
            onClick={() => onAppChange(item.id)}
          />
        ))}
      </div>
    </motion.nav>
  );
};

interface DockIconProps {
  item: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };
  isActive: boolean;
  onClick: () => void;
}

const DockIcon = ({ item, isActive, onClick }: DockIconProps) => {
  const Icon = item.icon;

  return (
    <motion.button
      onClick={onClick}
      className="relative flex flex-col items-center group"
      whileHover={{ scale: 1.2, y: -8 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Tooltip */}
      <div className="absolute -top-12 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        {item.label}
      </div>

      {/* Icon Container */}
      <div
        className={clsx(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 border",
          isActive
            ? "bg-primary/20 border-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
        )}
      >
        <Icon
          className={clsx(
            "w-5 h-5 transition-colors",
            isActive
              ? "text-primary fill-primary/10"
              : "text-slate-400 group-hover:text-white"
          )}
        />
      </div>

      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="dock-active"
          className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary shadow-[0_0_10px_#3b82f6]"
        />
      )}
    </motion.button>
  );
};