import { motion } from "framer-motion";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface CanvasProps {
  children: ReactNode;
  variant?: "default" | "critical";
}

export const Canvas = ({ children, variant = "default" }: CanvasProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        background:
          variant === "critical"
            ? "linear-gradient(135deg, hsl(0, 72%, 20%) 0%, hsl(15, 90%, 15%) 50%, hsl(0, 0%, 5%) 100%)"
            : "linear-gradient(135deg, hsl(239, 84%, 15%) 0%, hsl(215, 28%, 10%) 50%, hsl(0, 0%, 0%) 100%)",
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className={clsx(
        "fixed inset-0 w-screen h-screen overflow-hidden"
      )}
    >
      {/* Mesh overlay for depth - more subtle for dark mode */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-1/4 -left-1/4 w-2/3 h-2/3 rounded-full bg-indigo-500/30 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full bg-purple-500/20 blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 15, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-blue-500/20 blur-2xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
};
