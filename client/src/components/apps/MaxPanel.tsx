import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  ReferenceLine
} from "recharts";
import { TrendingUp, Users, DollarSign, Brain } from "lucide-react";
import { GameState, AnalyticsData } from "@/services/api";
import { clsx } from "clsx";
import { useProgressiveValue } from "@/hooks/useProgressiveValue";

interface MaxPanelProps {
  gameState: GameState;
  analytics: AnalyticsData | null;
  sessionId: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const MaxPanel = ({ gameState, analytics, sessionId }: MaxPanelProps) => {
  const [activeMetric, setActiveMetric] = useState<string>("revenue");
  
  const storageKey = `maxpanel_viewed_turn_${sessionId}`;
  const [visualizedTurn, setVisualizedTurn] = useState<number>(() => {
    return parseInt(sessionStorage.getItem(storageKey) || "0");
  });
  
  const [interpolatedPoint, setInterpolatedPoint] = useState<any>(null);

  // Robust Previous Values Calculation
  const prevValues = useMemo(() => {
    if (visualizedTurn > 0 && gameState.history.length >= visualizedTurn) {
      const entry = gameState.history[visualizedTurn - 1];
      return {
        revenue: entry.revenue || 0,
        traffic: entry.traffic || 0,
        active_users: entry.active_users || 0,
        conversion_rate: entry.conversion_rate || 0,
        product_sense: gameState.product_sense_score || 0
      };
    }
    
    // Default fallback from history or static values
    const lastHistory = gameState.historical_data?.[gameState.historical_data.length - 1];
    return {
      revenue: lastHistory?.revenue || 10000,
      traffic: lastHistory?.traffic || 10000,
      active_users: lastHistory?.active_users || 1000,
      conversion_rate: 0.02,
      product_sense: 0
    };
  }, [visualizedTurn, gameState.history, gameState.historical_data]);

  // Animated KPI Vitals
  const progRevenue = useProgressiveValue(gameState.revenue, 10000, prevValues.revenue);
  const progTraffic = useProgressiveValue(gameState.traffic, 10000, prevValues.traffic);
  const progUsers = useProgressiveValue(gameState.active_users, 10000, prevValues.active_users);
  const progSense = useProgressiveValue(gameState.product_sense_score, 10000, prevValues.product_sense);

  // Replay Animation Loop
  useEffect(() => {
    const targetTurnCount = gameState.history.length;
    if (visualizedTurn < targetTurnCount) {
      const targetEntry = gameState.history[visualizedTurn];
      if (!targetEntry) return;

      const startTime = performance.now();
      const DURATION = 3000; // Speed up catch-up

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        
        setInterpolatedPoint({
          name: `Turn ${targetEntry.turn}`,
          revenue: prevValues.revenue + (targetEntry.revenue - prevValues.revenue) * progress,
          traffic: prevValues.traffic + (targetEntry.traffic - prevValues.traffic) * progress,
          active_users: prevValues.active_users + (targetEntry.active_users - prevValues.active_users) * progress,
          conversion_rate: prevValues.conversion_rate + (targetEntry.conversion_rate - prevValues.conversion_rate) * progress,
          isHistory: false
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          const nextTurn = visualizedTurn + 1;
          setVisualizedTurn(nextTurn);
          sessionStorage.setItem(storageKey, nextTurn.toString());
          setInterpolatedPoint(null);
        }
      };

      const rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }
  }, [visualizedTurn, gameState.history, prevValues, storageKey]);

  // Unified Data Construction (The Root of Trust)
  const chartData = useMemo(() => {
    const backstory = (gameState.historical_data || []).map(d => ({
      name: d.month || d.name,
      revenue: d.revenue,
      traffic: d.traffic,
      active_users: d.active_users,
      conversion_rate: d.conversion_rate || 0.02,
      isHistory: true
    }));

    const live = gameState.history.slice(0, visualizedTurn).map(d => ({
      name: `Turn ${d.turn}`,
      revenue: d.revenue,
      traffic: d.traffic,
      active_users: d.active_users,
      conversion_rate: d.conversion_rate,
      isHistory: false
    }));

    const combined = [...backstory, ...live];
    if (interpolatedPoint) combined.push(interpolatedPoint);

    return combined.length > 0 ? combined : [{ name: 'Init', revenue: 0 }];
  }, [gameState.historical_data, gameState.history, visualizedTurn, interpolatedPoint]);

  if (!analytics) return <div className="p-12 text-center text-caption animate-pulse">Initializing Telemetry...</div>;

  const metrics = [
    { id: "revenue", label: "Net Revenue", value: `$${Math.round(progRevenue).toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", theme: "emerald" },
    { id: "traffic", label: "Daily Traffic", value: Math.round(progTraffic).toLocaleString(), icon: Users, color: "text-blue-500", theme: "blue" },
    { id: "active_users", label: "Active Users", value: Math.round(progUsers).toLocaleString(), icon: Users, color: "text-blue-400", theme: "blue" },
    { id: "product_sense", label: "Product Sense", value: Math.round(progSense).toString(), icon: Brain, color: "text-purple-500", theme: "purple" },
  ];

  const activeTheme = metrics.find(m => m.id === activeMetric) || metrics[0];
  const activeHex = { emerald: "#10b981", blue: "#3b82f6", purple: "#a855f7" }[activeTheme.theme] || "#3b82f6";

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6 overflow-y-auto max-h-full no-scrollbar">
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <button
            key={m.id}
            onClick={() => setActiveMetric(m.id)}
            className={clsx(
              "glass-card rounded-xl p-4 text-left transition-all border",
              activeMetric === m.id ? "border-primary/50 bg-primary/5" : "border-white/5 hover:bg-white/5"
            )}
          >
            <m.icon className={clsx("w-5 h-5 mb-3", m.color)} />
            <p className="text-2xl font-bold text-display">{m.value}</p>
            <p className="text-[10px] text-caption uppercase tracking-widest">{m.label}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 glass-card rounded-xl p-6">
          <h3 className="text-[10px] font-black text-caption tracking-[0.2em] uppercase mb-6">Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                />
                <Area 
                  type="monotone" 
                  dataKey={activeMetric} 
                  stroke={activeHex} 
                  fillOpacity={1} 
                  fill={`url(#grad-${activeMetric})`} 
                  strokeWidth={3}
                  isAnimationActive={false}
                />
                <defs>
                  <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeHex} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={activeHex} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                {chartData.some(d => d.isHistory) && (
                  <ReferenceLine x={chartData.filter(d => d.isHistory).pop()?.name} stroke="#475569" strokeDasharray="3 3" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="text-[10px] font-black text-caption tracking-[0.2em] uppercase mb-6">User Base Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={Object.entries(analytics.funnel).map(([name, value]) => ({ name, value }))}>
                <XAxis dataKey="name" hide />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
