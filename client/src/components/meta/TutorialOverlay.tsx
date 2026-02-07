import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronRight, Zap } from "lucide-react";
import { clsx } from "clsx";

interface TutorialOverlayProps {
  onComplete: () => void;
}

const steps = [
  {
    title: "Welcome to the Command Center",
    content: "This is proSIM OS. Your platform for scaling high-growth ecommerce engines. Manage the chaos, drive the growth.",
    target: "center",
  },
  {
    title: "The Application Dock",
    content: "Switch between your core tools here. Analytics, Inbox, and the War Room are always one click away.",
    target: "dock",
    style: { bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '70px' }
  },
  {
    title: "System Performance",
    content: "Keep a constant eye on the system bar. Your Vitals (Health, Trust, Morale) and Net Revenue are tracked in real-time.",
    target: "topbar",
    style: { top: '0px', left: '0px', width: '100%', height: '32px' }
  },
  {
    title: "Your Daily Mission",
    content: "The Inbox is where the narrative happens. Your decisions here will shape the future of the company.",
    target: "inbox",
    style: { bottom: '30px', left: 'calc(50% - 130px)', width: '60px', height: '60px' }
  }
];

export const TutorialOverlay = ({ onComplete }: TutorialOverlayProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
      {/* Background Dimmer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] pointer-events-auto" 
      />

      {/* Spotlight Effect */}
      <AnimatePresence mode="wait">
        {step.target !== "center" && (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute border-[2000px] border-slate-950/60 rounded-full pointer-events-none transition-all duration-500 ease-in-out"
            style={{
              ...step.style,
              margin: '-2000px',
              borderRadius: '24px',
              boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 100px rgba(59, 130, 246, 0.3)'
            }}
          />
        )}
      </AnimatePresence>

      {/* Tooltip Card */}
      <motion.div
        key={`card-${currentStep}`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={clsx(
          "relative w-[380px] glass-window p-8 pointer-events-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)] border-white/20",
          step.target === "dock" && "mb-64",
          step.target === "topbar" && "mt-64",
          step.target === "inbox" && "mb-64 mr-64"
        )}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-t-full opacity-50" />
        
        <div className="flex items-center gap-2 text-[10px] font-black text-primary tracking-[0.2em] uppercase mb-4">
          <Zap className="w-3 h-3" /> Step {currentStep + 1} / {steps.length}
        </div>

        <h2 className="text-xl font-black text-display mb-3 uppercase italic tracking-tight">
          {step.title}
        </h2>
        
        <p className="text-sm text-slate-400 leading-relaxed mb-10">
          {step.content}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 group"
        >
          {currentStep < steps.length - 1 ? "Next Analysis" : "Begin Mission"}
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};
