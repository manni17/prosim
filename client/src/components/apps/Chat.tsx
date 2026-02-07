import { motion } from "framer-motion";
import { useState } from "react";
import { MessageSquare, Users, Hash, Clock, Send } from "lucide-react";
import { clsx } from "clsx";
import { InboxItem } from "@/services/api";

interface ChatProps {
  messages: InboxItem[];
  onDecision: (actionId: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const Chat = ({ messages, onDecision }: ChatProps) => {
  const [resolvedIds] = useState(new Set<string>());

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-56 glass-sidebar p-4 flex flex-col gap-6"
      >
        <div>
          <div className="text-[10px] font-bold text-caption tracking-widest uppercase mb-3 flex items-center gap-2">
            <Hash className="w-3 h-3" /> Channels
          </div>
          <div className="space-y-1">
            <div className="px-3 py-1.5 bg-primary/10 border-r-2 border-primary text-sm font-medium text-primary cursor-pointer"># general</div>
            <div className="px-3 py-1.5 hover:bg-glass-sidebar text-sm text-body cursor-pointer rounded-lg transition-colors"># roadmap</div>
            <div className="px-3 py-1.5 hover:bg-glass-sidebar text-sm text-body cursor-pointer rounded-lg transition-colors"># incidents</div>
          </div>
        </div>

        <div>
          <div className="text-[10px] font-bold text-caption tracking-widest uppercase mb-3 flex items-center gap-2">
            <Users className="w-3 h-3" /> Direct Messages
          </div>
          <div className="space-y-1">
            <div className="px-3 py-1.5 hover:bg-glass-sidebar text-sm text-body cursor-pointer rounded-lg transition-colors flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div> Sarah (CMO)
            </div>
            <div className="px-3 py-1.5 hover:bg-glass-sidebar text-sm text-body cursor-pointer rounded-lg transition-colors flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success"></div> Dave (Lead Dev)
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-glass-hover/30">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {messages.map((msg) => (
              <motion.div key={msg.id} variants={itemVariants} className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-slate-400 shrink-0 shadow-lg border border-glass-border-subtle group-hover:border-primary/30 transition-colors uppercase">
                  {msg.sender[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-bold text-sm text-display">{msg.sender}</span>
                    <span className="text-[10px] text-caption flex items-center gap-1 opacity-60">
                      <Clock className="w-2.5 h-2.5" /> 10:42 AM
                    </span>
                  </div>
                  <div className="bg-glass-card p-4 rounded-2xl rounded-tl-none border border-glass-border-subtle text-sm text-display leading-relaxed shadow-sm">
                    {msg.body}
                  </div>
                  
                  {msg.options && msg.options.length > 0 && !resolvedIds.has(msg.id) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.options.map(opt => (
                        <button 
                          key={opt.action_id}
                          onClick={() => onDecision(opt.action_id)}
                          className="px-4 py-2 glass-card border border-glass-border-subtle hover:border-primary hover:bg-primary/10 rounded-xl text-xs font-medium text-body hover:text-primary transition-all active:scale-95"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-30 gap-2">
                <MessageSquare className="w-12 h-12" />
                <span className="text-sm italic">Secure communication channel active.</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-glass-card/20 border-t border-glass-border-subtle">
          <div className="relative">
            <div className="w-full px-4 py-3 bg-slate-950/40 border border-glass-border-subtle rounded-xl text-caption text-sm italic flex items-center justify-between">
              <span>Message #general...</span>
              <Send className="w-4 h-4 opacity-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
