import { useState, useEffect } from "react";
import { Canvas } from "@/components/os/Canvas";
import { TopBar } from "@/components/os/TopBar";
import { Dock } from "@/components/os/Dock";
import { Window } from "@/components/os/Window";
import { MaxPanel } from "@/components/apps/MaxPanel";
import { Inbox } from "@/components/apps/Inbox";
import { WarRoom } from "@/components/apps/WarRoom";
import { Chat } from "@/components/apps/Chat";
import { Marketplace } from "@/components/apps/Marketplace";
import { Settings } from "@/components/apps/Settings";
import { Placeholder } from "@/components/apps/Placeholder";
import { ReportCard } from "@/components/meta/ReportCard";
import { QuarterlyReview } from "@/components/meta/QuarterlyReview";
import { TutorialOverlay } from "@/components/meta/TutorialOverlay";
import { StartScreen } from "@/components/meta/StartScreen";
import { CompetencyScorecard } from "@/components/reports/CompetencyScorecard";
import api, { GameState, InboxItem, AnalyticsData, Intervention } from "@/services/api";
import { toast } from "sonner";
import { telemetry } from "@/services/telemetry";

interface IndexProps {
  gameStatus: "IDLE" | "ACTIVE" | "REVIEW" | "GAME_OVER";
  setGameStatus: (status: "IDLE" | "ACTIVE" | "REVIEW" | "GAME_OVER") => void;
  initialData?: any;
}

const Index = ({ gameStatus, setGameStatus, initialData }: IndexProps) => {
  const [sessionId, setSessionId] = useState<string | null>(initialData?.session_id || null);
  const [gameState, setGameState] = useState<GameState | null>(initialData?.state || null);
  const [inbox, setInbox] = useState<InboxItem[]>([]);
  const [chats, setChats] = useState<InboxItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [wiki, setWiki] = useState<Record<string, any>>({});
  const [activeApp, setActiveApp] = useState("inbox");
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (sessionId && gameState) {
      telemetry.logEvent({
        sessionId,
        type: 'TAB_SWITCH',
        turn: gameState.history.length,
        metadata: { 
          app: activeApp,
          context: activeApp === 'maxpanel' && inbox.length > 0 ? 'PANIC_CHECK' : 'NAVIGATION'
        }
      }).catch(console.error);
    }
  }, [activeApp, sessionId, gameState?.history.length]);

  const refreshData = async (sid: string) => {
    try {
      // 1. Fetch wiki first or in parallel with fallback
      const wikiPromise = api.getWiki(sid).catch(err => {
        console.warn("Wiki hydration failed, falling back to empty knowledge graph:", err);
        return {};
      });

      const [state, inboxData, chatsData, analyticsData, interventionsData, wikiData] = await Promise.all([
        api.getState(sid),
        api.getInbox(sid),
        api.getChats(sid),
        api.getAnalytics(sid),
        api.getInterventions(sid),
        wikiPromise
      ]);
      
      setGameState(state);
      setInbox(inboxData);
      setChats(chatsData);
      setAnalytics(analyticsData);
      setInterventions(interventionsData);
      setWiki(wikiData);

      // Sync status with backend
      if (state.status === 'REVIEW' && gameStatus !== 'REVIEW') {
        setGameStatus('REVIEW');
      } else if (state.status === 'GAME_OVER' && gameStatus !== 'GAME_OVER') {
        setGameStatus('GAME_OVER');
      } else if (state.status === 'ACTIVE' && gameStatus !== 'ACTIVE') {
        setGameStatus('ACTIVE');
      }
    } catch (err) {
      console.error("Failed to refresh data:", err);
    }
  };

  useEffect(() => {
    if (sessionId) {
      refreshData(sessionId).finally(() => setLoading(false));
    }
  }, [sessionId]);

  const handleGameStart = async () => {
    console.log("Start button clicked.");
    try {
      // 1. Call API
      const data = await api.startNewGame();
      console.log("Game initialized:", data);

      // 2. Set Local State (Visual Transition)
      setSessionId(data.session_id);
      setGameState(data.state);
      setGameStatus('ACTIVE');

      telemetry.logEvent({
        sessionId: data.session_id,
        type: 'APP_OPEN',
        turn: 0,
        metadata: { player: data.state.player_name }
      }).catch(console.error);
    } catch (error) {
      console.error("CRITICAL FAILURE:", error);
      alert("Failed to connect to Simulation Engine (Port 8000). Is the backend running?");
    }
  };

  if (gameStatus === "IDLE") {
    return <StartScreen onStart={handleGameStart} />;
  }

  if (loading || !gameState) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center text-blue-500 font-mono text-[10px] tracking-[0.3em]">
        BOOTING STELLER OS...
      </div>
    );
  }

  const handleDecision = async (actionId: string, prediction?: Record<string, any>) => {
    if (!sessionId) return null;
    try {
      const newState = await api.makeDecision(sessionId, actionId, prediction);
      setGameState(newState);
      // We don't refreshData immediately if there is a prediction, 
      // but returning newState allows the Inbox to handle the Result Modal.
      return newState;
    } catch (err) {
      console.error("Decision failed:", err);
      toast.error("Packet loss detected.");
      throw err;
    }
  };

  const handleIntervention = async (actionId: string) => {
    if (!sessionId) return;
    try {
      const result = await api.executeIntervention(sessionId, actionId);
      await refreshData(sessionId);
      toast(result.result.label, {
        description: `Effectiveness: ${result.result.effectiveness}`
      });
    } catch (err) {
      console.error("Intervention failed:", err);
      toast.error("Resource unavailable.");
    }
  };

  const handleStrategyCommit = async (focusId: string) => {
    if (!sessionId) return;
    try {
      const data = await api.commitStrategy(sessionId, focusId);
      setGameState(data.state);
      setGameStatus('ACTIVE');
      await refreshData(sessionId);
      toast.success(`Strategic Directive Committed: ${focusId.toUpperCase()}`);
    } catch (err) {
      console.error("Strategy commitment failed:", err);
      toast.error("Board rejected the proposal.");
    }
  };

  const handleTutorialComplete = async () => {
    if (!sessionId) return;
    try {
      const data = await api.completeTutorial(sessionId);
      setGameState(data.state);
      toast.success("Systems calibration complete.");
    } catch (err) {
      console.error("Tutorial completion failed:", err);
    }
  };

  const handleResign = async () => {
    if (!sessionId) return;
    try {
      const data = await api.resignGame(sessionId);
      setGameState(data.state);
      setGameStatus('GAME_OVER');
      toast.error("Connection terminated.");
    } catch (err) {
      console.error("Resignation failed:", err);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const apps: Record<string, { title: string; component: React.ReactNode }> = {
    maxpanel: { 
      title: "MaxPanel 3.0 — Analytics", 
      component: <MaxPanel gameState={gameState} analytics={analytics} sessionId={sessionId || ""} wiki={wiki} /> 
    },
    inbox: { 
      title: "Inbox", 
      component: <Inbox 
        emails={inbox} 
        onDecision={handleDecision} 
        onRefresh={() => refreshData(sessionId!)} 
        wiki={wiki} 
        sessionId={sessionId || ""} 
        turn={gameState.history.length}
      /> 
    },
    warroom: { 
      title: "Strategic War Room", 
      component: <WarRoom interventions={interventions} onIntervention={handleIntervention} wiki={wiki} /> 
    },
    chat: { 
      title: "Team Chat", 
      component: <Chat messages={chats} onDecision={handleDecision} /> 
    },
    marketplace: { 
      title: "Growth Marketplace", 
      component: <Marketplace revenue={gameState.revenue} onBuy={() => {}} /> 
    },
    settings: { 
      title: "Settings", 
      component: <Settings gameState={gameState} onResign={handleResign} /> 
    },
  };

  const currentApp = apps[activeApp];
  const isWarRoom = activeApp === "warroom";
  const showTutorial = gameState && !gameState.tutorial_complete && gameStatus === "ACTIVE";

  return (
    <Canvas variant={isWarRoom ? "critical" : "default"}>
      <TopBar gameState={gameState} />

      <main className="h-full w-full flex items-center justify-center pt-7 pb-24 px-8 relative">
        <Window
          title={currentApp.title}
          variant={isWarRoom ? "critical" : "default"}
          isVisible={true}
        >
          {currentApp.component}
        </Window>

        {/* Tutorial Overlay disabled per Lead Debugger instruction */}
        {/* {showTutorial && (
          <TutorialOverlay onComplete={handleTutorialComplete} />
        )} */}

        {gameStatus === "REVIEW" && gameState && (
          <QuarterlyReview currentLevel={gameState.current_level} onCommit={handleStrategyCommit} />
        )}

        {gameStatus === "GAME_OVER" && gameState && (
          <>
            <ReportCard gameState={gameState} sessionId={sessionId || ""} onRetry={handleRetry} />
            <CompetencyScorecard 
              simulationId={sessionId || "unknown"} 
              onClose={() => window.location.reload()} 
            />
          </>
        )}
      </main>

      <Dock activeApp={activeApp} onAppChange={setActiveApp} />
    </Canvas>
  );
};

export default Index;