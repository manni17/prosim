import { motion } from "framer-motion";
import { useState } from "react";
import { Inbox as InboxIcon, Send, Star, Trash2, Archive, Clock, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { InboxItem } from "@/services/api";
import { toast } from "sonner";

interface InboxProps {
  emails: InboxItem[];
  onDecision: (actionId: string) => Promise<void>;
}

const folders = [
  { id: "inbox", label: "Inbox", icon: InboxIcon },
  { id: "starred", label: "Starred", icon: Star },
  { id: "sent", label: "Sent", icon: Send },
  { id: "archive", label: "Archive", icon: Archive },
  { id: "trash", label: "Trash", icon: Trash2 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export const Inbox = ({ emails, onDecision }: InboxProps) => {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  const handleAction = async (actionId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    toast.info("Transmitting Orders...", { duration: 1500 });

    // Artificial Delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      await onDecision(actionId);
      toast.success("Orders Confirmed.");
      // Auto-select next email if available, or clear selection
      // This part is handled by parent refresh usually, but clearing here is safe
      setSelectedEmailId(null); 
    } catch (err) {
      console.error("Decision failed", err);
      toast.error("Transmission Failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-full relative">
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-primary animate-in fade-in duration-300">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <span className="text-sm font-bold tracking-widest uppercase">Encrypting Payload...</span>
        </div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="w-52 glass-sidebar p-3 flex flex-col gap-1"
      >
        {folders.map((folder) => {
          const Icon = folder.icon;
          const isActive = activeFolder === folder.id;
          const count = folder.id === 'inbox' ? emails.length : 0;

          return (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className={clsx(
                "flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "glass-hover text-[hsl(var(--primary))]"
                  : "hover:bg-[hsl(var(--glass-sidebar))] text-[hsl(var(--text-secondary))]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{folder.label}</span>
              </div>
              {count > 0 && (
                <span
                  className={clsx(
                    "text-xs font-medium px-1.5 py-0.5 rounded-full",
                    isActive
                      ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"
                      : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </motion.aside>

      {/* Email List */}
      <div className="w-80 border-r border-[hsl(var(--glass-border-subtle))] bg-[hsl(var(--glass-hover))] overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="divide-y divide-[hsl(var(--glass-border-subtle))]"
        >
          {emails.map((email) => (
            <motion.div
              key={email.id}
              variants={itemVariants}
              onClick={() => setSelectedEmailId(email.id)}
              className={clsx(
                "p-4 cursor-pointer transition-all duration-200",
                selectedEmailId === email.id
                  ? "bg-[hsl(var(--primary)/.08)]"
                  : "hover:bg-[hsl(var(--glass-card))]"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-medium text-[hsl(var(--text-inverse))] shrink-0 uppercase">
                  {email.sender.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-display">
                      {email.sender}
                    </span>
                    <span className="text-[10px] text-caption flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      Just now
                    </span>
                  </div>
                  <p className="text-sm font-medium text-display mb-1 truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-caption truncate">{email.body.substring(0, 40)}...</p>
                </div>
              </div>
            </motion.div>
          ))}
          {emails.length === 0 && <div className="p-8 text-center text-caption italic">No messages.</div>}
        </motion.div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col bg-[hsl(var(--glass-window)/.3)]">
        {selectedEmail ? (
          <>
            <div className="p-8 border-b border-[hsl(var(--glass-border-subtle))] bg-[hsl(var(--glass-card)/.2)]">
              <h2 className="text-2xl font-bold text-display mb-2">{selectedEmail.subject}</h2>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {selectedEmail.sender.charAt(0)}
                </div>
                <span className="text-sm font-medium text-[hsl(var(--text-secondary))]">{selectedEmail.sender}</span>
              </div>
            </div>
            <div className="flex-1 p-8 text-[hsl(var(--text-primary))] leading-relaxed text-sm overflow-y-auto whitespace-pre-wrap">
              {selectedEmail.body}
            </div>
            <div className="p-8 flex gap-4 bg-[hsl(var(--glass-card)/.4)] border-t border-[hsl(var(--glass-border-subtle))]">
              {selectedEmail.options.map(opt => (
                <button
                  key={opt.action_id}
                  onClick={() => handleAction(opt.action_id)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex flex-col items-center gap-1 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] opacity-70 font-normal uppercase tracking-widest">{opt.impact_hint}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-caption italic">
            Select a message to begin calibration.
          </div>
        )}
      </div>
    </div>
  );
};