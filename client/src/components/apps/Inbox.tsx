import { motion } from "framer-motion";
import { useState } from "react";
import { Inbox as InboxIcon, Send, Star, Trash2, Archive, Clock, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { InboxItem } from "@/services/api";
import { toast } from "sonner";
import { PredictionModal } from "../meta/PredictionModal";
import { PredictionResultModal } from "../meta/PredictionResultModal";
import { parseWikiLinks } from "@/utils/textParser";
import { telemetry } from "@/services/telemetry";

interface InboxProps {
  emails: InboxItem[];
  onDecision: (actionId: string, prediction?: Record<string, any>) => Promise<any>;
  onRefresh: () => Promise<void>;
  wiki: Record<string, any>;
  sessionId: string;
  turn: number;
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

export const Inbox = ({ emails, onDecision, onRefresh, wiki, sessionId, turn }: InboxProps) => {
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ id: string, label: string } | null>(null);
  const [predictionResult, setPredictionResult] = useState<any | null>(null);
  const [hoverHistory, setHoverHistory] = useState<string[]>([]);
  const [selectionTime, setSelectionTime] = useState<number | null>(null);

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  // Log DECISION_START and track timing
  useEffect(() => {
    if (selectedEmailId && sessionId) {
      const now = Date.now();
      setSelectionTime(now);
      setHoverHistory([]); // Reset history for new decision
      
      telemetry.logEvent({
        sessionId,
        type: 'DECISION_START',
        turn,
        metadata: { emailId: selectedEmailId, timestamp: now }
      }).catch(console.error);
    }
  }, [selectedEmailId, sessionId, turn]);

  const handleAction = async (actionId: string, prediction?: Record<string, any>) => {
    if (isProcessing) return;

    // Calculate Decision Context (Lead Debugger Quality Pass)
    const now = Date.now();
    const duration = selectionTime ? now - selectionTime : 0;
    const uniqueHovers = new Set(hoverHistory).size;
    const isReversal = hoverHistory.length > 1 && hoverHistory[hoverHistory.length - 1] !== actionId;

    // ... (prediction interception logic remains same)
    setShowPredictionModal(false);
    setPendingAction(null);
    
    setIsProcessing(true);
    toast.info("Transmitting Orders...", { duration: 1500 });

    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const response = await onDecision(actionId, prediction);
      
      telemetry.logEvent({
        sessionId,
        type: 'DECISION_COMMIT',
        turn,
        metadata: { 
          actionId, 
          hasPrediction: !!prediction,
          duration_ms: duration,
          hover_diversity: uniqueHovers,
          is_reversal: isReversal,
          total_hovers: hoverHistory.length
        }
      }).catch(console.error);

      if (prediction && response?.last_prediction_results) {
        setPredictionResult(response.last_prediction_results);
      } else {
        toast.success("Orders Confirmed.");
        setSelectedEmailId(null); 
        await onRefresh();
      }
    } catch (err) {
      console.error("Decision failed", err);
      toast.error("Transmission Failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResultClose = async () => {
    setPredictionResult(null);
    setSelectedEmailId(null);
    await onRefresh();
  };

  return (
    <div className="flex h-full relative">
      {isProcessing && (
        <div className="absolute inset-0 z-[100] bg-slate-950/40 backdrop-blur-md flex flex-col items-center justify-center text-primary animate-in fade-in duration-300">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <span className="text-sm font-black tracking-[0.2em] uppercase">Encrypting Payload...</span>
        </div>
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-52 glass-sidebar p-3 flex flex-col gap-1 border-r border-white/5"
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
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-white/5 text-slate-400"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-tighter">{folder.label}</span>
              </div>
              {count > 0 && (
                <span className={clsx("text-[10px] font-black px-1.5 py-0.5 rounded-md", isActive ? "bg-primary text-white" : "bg-white/5 text-slate-500")}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </motion.aside>

      {/* Email List */}
      <div className="w-80 border-r border-white/5 bg-white/2 overflow-y-auto no-scrollbar">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-white/5">
          {emails.map((email) => (
            <motion.div
              key={email.id}
              variants={itemVariants}
              onClick={() => setSelectedEmailId(email.id)}
              className={clsx(
                "p-4 cursor-pointer transition-all duration-200 border-l-2",
                selectedEmailId === email.id
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-white/5 border-transparent"
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-black text-white shrink-0 uppercase shadow-lg shadow-primary/20">
                  {email.sender.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-display uppercase tracking-tight truncate mr-2">
                      {email.sender}
                    </span>
                    <span className="text-[9px] text-slate-500 flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      NOW
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white mb-1 truncate uppercase tracking-tighter">
                    {parseWikiLinks(email.subject, wiki)}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{email.body.substring(0, 40).replace(/\[\[|\]\]/g, '')}...</p>
                </div>
              </div>
            </motion.div>
          ))}
          {emails.length === 0 && <div className="p-8 text-center text-[10px] text-slate-500 uppercase tracking-widest italic">No active directives.</div>}
        </motion.div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col bg-slate-950/20">
        {selectedEmail ? (
          <>
            <div className="p-10 border-b border-white/5 bg-white/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 rounded-md bg-primary/10 border border-primary/20 text-[9px] font-black text-primary uppercase tracking-widest">
                  Priority Directive
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Channel: {selectedEmail.type}
                </div>
              </div>
              <h2 className="text-3xl font-black text-display mb-4 uppercase italic tracking-tighter">{parseWikiLinks(selectedEmail.subject, wiki)}</h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-[10px] font-black text-primary">
                  {selectedEmail.sender.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-tight">{selectedEmail.sender}</p>
                  <p className="text-[9px] text-slate-500 uppercase">To: Executive Director</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-10 text-slate-300 leading-relaxed text-sm overflow-y-auto no-scrollbar whitespace-pre-wrap font-medium">
              {parseWikiLinks(selectedEmail.body, wiki)}
            </div>
            <div className="p-8 flex gap-4 bg-white/2 border-t border-white/5">
              {selectedEmail.options.map(opt => (
                <button
                  key={opt.action_id}
                  onClick={() => handleAction(opt.action_id)}
                  onMouseEnter={() => {
                    setHoverHistory(prev => [...prev, opt.action_id]);
                    telemetry.logEvent({
                      sessionId,
                      type: 'HOVER_ACTION',
                      turn,
                      metadata: { actionId: opt.action_id, label: opt.label }
                    }).catch(console.error);
                  }}
                  disabled={isProcessing}
                  className="flex-1 p-6 bg-primary hover:bg-primary-hover text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all shadow-xl shadow-primary/20 border border-white/10 flex flex-col items-center gap-2"
                >
                  <span>{opt.label}</span>
                  <span className="text-[9px] opacity-60 font-bold">{parseWikiLinks(opt.impact_hint, wiki)}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-600 gap-4">
            <InboxIcon className="w-12 h-12 opacity-10" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Select a directive to begin calibration</p>
          </div>
        )}
      </div>

      {showPredictionModal && pendingAction && (
        <PredictionModal
          actionLabel={pendingAction.label}
          onConfirm={(pred) => handleAction(pendingAction.id, pred)}
          onCancel={() => { setShowPredictionModal(false); setPendingAction(null); }}
        />
      )}

      {predictionResult && (
        <PredictionResultModal 
          result={predictionResult}
          onClose={handleResultClose}
        />
      )}
    </div>
  );
};