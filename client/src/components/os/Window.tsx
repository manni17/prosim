import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface WindowProps {
  title: string;
  children: ReactNode;
  variant?: "default" | "critical";
  isVisible: boolean;
}

export const Window = ({ title, children, variant = "default", isVisible }: WindowProps) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className={clsx(
            "w-full max-w-5xl h-[70vh] rounded-2xl overflow-hidden",
            variant === "critical" ? "glass-critical" : "glass-window"
          )}
        >
          {/* Window Header */}
          <div className="h-11 px-4 flex items-center border-b border-[hsl(var(--glass-border-subtle))]">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <button className="traffic-light traffic-red" />
              <button className="traffic-light traffic-yellow" />
              <button className="traffic-light traffic-green" />
            </div>

            {/* Title */}
            <span className="absolute left-1/2 transform -translate-x-1/2 text-sm font-medium text-[hsl(var(--text-primary))]">
              {title}
            </span>
          </div>

          {/* Window Content */}
          <div className="h-[calc(100%-2.75rem)] overflow-auto no-scrollbar">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
