import { motion } from "framer-motion";
import { Construction } from "lucide-react";

interface PlaceholderProps {
  appName: string;
}

export const Placeholder = ({ appName }: PlaceholderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col items-center justify-center gap-4"
    >
      <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center">
        <Construction className="w-8 h-8 text-[hsl(var(--text-secondary))]" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-display">{appName}</h2>
        <p className="text-sm text-body mt-1">Coming soon</p>
      </div>
    </motion.div>
  );
};
