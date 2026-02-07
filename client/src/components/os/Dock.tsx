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
      <div className="glass-dock rounded-full px-2 py-2 flex items-center gap-1">
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
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-10 px-2.5 py-1 rounded-md bg-[hsl(var(--text-primary))] text-[hsl(var(--text-inverse))] text-xs font-medium whitespace-nowrap pointer-events-none z-[100]"
      >
        {item.label}
      </motion.div>

      {/* Icon Container */}
      <div
        className={clsx(
          "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200",
          isActive
            ? "bg-[hsl(var(--glass-hover))] shadow-lg"
            : "bg-[hsl(var(--glass-card))] hover:bg-[hsl(var(--glass-hover))]"
        )}
      >
        <Icon
          className={clsx(
            "w-5 h-5 transition-colors",
            isActive
              ? "text-[hsl(var(--primary))]"
              : "text-[hsl(var(--text-primary))]"
          )}
        />
      </div>

      {/* Active Indicator */}
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[hsl(var(--text-primary))]"
      />
    </motion.button>
  );
};