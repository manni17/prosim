import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react";
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
  
  // -- Seamless Progress Logic (UX-05) --
  const storageKey = `maxpanel_viewed_turn_${sessionId}`;
  const [visualizedTurn, setVisualizedTurn] = useState<number>(() => {
    return parseInt(sessionStorage.getItem(storageKey) || "0");
  });
  
  // We maintain a local display state for the chart to handle smooth interpolation
  const [interpolatedPoint, setInterpolatedPoint] = useState<any>(null);

  // Calculate Previous Values for Metrics Card Animation (Hoisted logic)
  const prevValues = useMemo(() => {
    if (visualizedTurn > 0) {
      if (gameState.history.length >= visualizedTurn) {
         const entry = gameState.history[visualizedTurn - 1];
         return {
           revenue: entry.revenue,
           traffic: entry.traffic,
           active_users: entry.active_users,
           conversion_rate: entry.conversion_rate,
           average_order_value: entry.average_order_value
         };
      }
    }
    
    if (analytics?.history?.length) {
      const last = analytics.history[analytics.history.length - 1];
      return {
        revenue: last.revenue,
        traffic: last.traffic || 0,
        active_users: 1000,
        conversion_rate: last.traffic ? (last.revenue / (last.traffic * 50)) : 0.02,
        average_order_value: 50
      };
    }
    
    return { revenue: 0, traffic: 0, active_users: 0, conversion_rate: 0, average_order_value: 0 };
  }, [visualizedTurn, gameState.history, analytics]);

  // Metrics Cards Hooks (Now with Initial Value!)
  const progRevenue = useProgressiveValue(gameState.revenue, 15000, prevValues.revenue);
  const progTraffic = useProgressiveValue(gameState.traffic, 15000, prevValues.traffic);
  const progActiveUsers = useProgressiveValue(gameState.active_users, 15000, prevValues.active_users);
  const progConversion = useProgressiveValue(gameState.conversion_rate, 15000, prevValues.conversion_rate);
  const progAOV = useProgressiveValue(gameState.average_order_value, 15000, prevValues.average_order_value);

  // Animation Loop for Chart
  useEffect(() => {
    const targetTurnCount = gameState.history.length;
    
    if (visualizedTurn < targetTurnCount) {
      const nextTurnIndex = visualizedTurn;
      const targetEntry = gameState.history[nextTurnIndex];
      
      if (!targetEntry) return;

      const startValues = prevValues;

      const startTime = performance.now();
      const DURATION = 5000;

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / DURATION, 1);
        
        const currentRevenue = startValues.revenue + (targetEntry.revenue - startValues.revenue) * progress;
        const currentTraffic = startValues.traffic + ((targetEntry.traffic || 0) - startValues.traffic) * progress;
        const currentActiveUsers = (startValues.active_users || 0) + ((targetEntry.metrics?.active_users || 0) - (startValues.active_users || 0)) * progress;
        const currentConversion = (startValues.conversion_rate || 0) + ((targetEntry.metrics?.conversion_rate || 0) - (startValues.conversion_rate || 0)) * progress;
        const currentAOV = (startValues.average_order_value || 0) + ((targetEntry.metrics?.average_order_value || 0) - (startValues.average_order_value || 0)) * progress;

        setInterpolatedPoint({
          name: `T${targetEntry.turn_index}`,
          revenue: currentRevenue,
          traffic: currentTraffic,
          active_users: currentActiveUsers,
          conversion_rate: currentConversion,
          average_order_value: currentAOV,
          type: "live"
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
  }, [visualizedTurn, gameState.history.length, analytics, storageKey, prevValues]);


  if (!analytics) return <div className="p-12 text-center text-caption animate-pulse">Hydrating analytics engine...</div>;

  const funnelData = Object.entries(analytics.funnel).map(([name, value]) => ({ name, value }));
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];

  const metrics = [
    { id: "revenue", label: "Net Revenue", value: `$${progRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: DollarSign, color: "text-emerald-500", theme: "emerald" },
    { id: "traffic", label: "Daily Traffic", value: Math.round(progTraffic).toLocaleString(), icon: Users, color: "text-blue-500", theme: "blue" },
    { id: "active_users", label: "Active Users", value: Math.round(progActiveUsers).toLocaleString(), icon: Users, color: "text-blue-400", theme: "blue" },
    { id: "conversion_rate", label: "Conversion", value: `${(progConversion * 100).toFixed(2)}%`, icon: TrendingUp, color: "text-purple-500", theme: "purple" },
  ];

  // -- Data Construction (Lead Frontend Debugger Fix) --
  const chartData = useMemo(() => {
    // 1. Always load 12-month history from state
    const historyRaw = gameState.historical_data || [];
    const backstory = historyRaw.map(d => ({
      name: d.month || d.name,
      revenue: d.revenue,
      traffic: d.traffic || 0,
      active_users: d.active_users,
      conversion_rate: d.conversion_rate || 0.02,
      average_order_value: d.average_order_value || 50,
      isHistory: true
    }));

    // 2. Add Live Turns (up to visualized point)
    const liveRaw = gameState.history || [];
    const confirmed = liveRaw.slice(0, visualizedTurn).map(d => ({
      name: `Turn ${d.turn_index}`,
      revenue: d.revenue,
      traffic: d.traffic,
      active_users: d.active_users,
      conversion_rate: d.conversion_rate,
      average_order_value: d.average_order_value,
      isHistory: false
    }));

    // 3. Merge
    let combined = [...backstory, ...confirmed];

    // 4. Add Active Interpolation Point (if animating)
    if (interpolatedPoint) {
      combined.push({
        ...interpolatedPoint,
        name: `Turn ${interpolatedPoint.name.replace(/\D/g, '')}`,
        isHistory: false
      });
    }

    // 5. Safety: Prevent empty chart crash
    if (combined.length === 0) return [{name: 'Init', revenue: 0, traffic: 0, active_users: 0, conversion_rate: 0, average_order_value: 0, isHistory: false}];
    return combined;
  }, [gameState.historical_data, gameState.history, visualizedTurn, interpolatedPoint]);

  const activeHex = {
    emerald: "#10b981",
    blue: "#3b82f6",
    purple: "#a855f7",
    pink: "#ec4899"
  }[metrics.find(m => m.id === activeMetric)?.theme || "blue"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6 overflow-y-auto max-h-full no-scrollbar"
    >
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <motion.button
            key={metric.id}
            variants={itemVariants}
            onClick={() => setActiveMetric(metric.id)}
            className={clsx(
              "glass-card rounded-xl p-4 text-left transition-all duration-200 border",
              activeMetric === metric.id 
                ? `border-${metric.theme}-500/50 bg-${metric.theme}-500/10 shadow-[0_0_20px_rgba(0,0,0,0.1)]` 
                : "border-glass-border-subtle hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <p className="text-2xl font-semibold text-display">{metric.value}</p>
            <p className="text-xs text-caption mt-1 uppercase tracking-widest">{metric.label}</p>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <motion.div variants={itemVariants} className="col-span-2 glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase mb-4 text-center">
            {metrics.find(m => m.id === activeMetric)?.label} Trend (Year over Year)
          </h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gradientActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeHex} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={activeHex} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 9 }} interval={2} />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "hsl(215, 16%, 47%)", fontSize: 10 }}
                  tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val.toFixed(2)} 
                />
                <Tooltip 
                  contentStyle={{ background: "hsl(var(--glass-card))", border: "1px solid hsl(var(--glass-border-subtle))", borderRadius: "8px", backdropFilter: "blur(12px)" }}
                  labelStyle={{ color: "hsl(var(--text-muted))", fontSize: 12, fontWeight: "bold" }}
                />
                
                {chartData.some(d => d.isHistory) && (
                  <ReferenceLine 
                    x={chartData.filter(d => d.isHistory).pop()?.name} 
                    stroke="hsl(var(--text-muted))" 
                    strokeDasharray="3 3" 
                    label={{ value: "Backstory", position: "insideTopRight", fill: "hsl(var(--text-muted))", fontSize: 10 }} 
                  />
                )}

                {gameState.history.slice(0, visualizedTurn).map((h) => (
                  <ReferenceLine 
                    key={h.turn_index} 
                    x={`Turn ${h.turn_index}`} 
                    stroke="hsl(var(--primary))" 
                    strokeDasharray="3 3" 
                    label={{ value: `T${h.turn_index}`, position: "insideTopLeft", fill: "hsl(var(--primary))", fontSize: 10, fontWeight: "bold" }} 
                  />
                ))}

                <Area 
                  type="monotone" 
                  dataKey={activeMetric} 
                  stroke={activeHex} 
                  strokeWidth={2} 
                  fill="url(#gradientActive)" 
                  animationDuration={0}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card rounded-xl p-4">
          <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase mb-4 text-center">Conversion Funnel</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={9} width={60} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: "hsl(var(--glass-card))", border: "1px solid hsl(var(--glass-border-subtle))", backdropFilter: "blur(12px)" }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
        <h3 className="text-[10px] font-bold text-caption tracking-widest uppercase mb-6">User Retention Cohorts</h3>
        <div className="grid grid-cols-4 gap-1">
          {['Cohort', 'Week 0', 'Week 1', 'Week 2'].map(h => <div key={h} className="text-[9px] font-bold text-[hsl(var(--text-secondary))] uppercase pb-2 text-center">{h}</div>)}
          {analytics.retention.map((cohort, rowIdx) => (
            <div key={rowIdx} className="contents">
              <div className="text-[9px] text-[hsl(var(--text-muted))] flex items-center">Jan 202{rowIdx}</div>
              {cohort.map((val, colIdx) => (
                <div 
                  key={colIdx} 
                  className={`p-2 text-center text-xs rounded transition-all ${val > 50 ? 'text-white' : 'text-[hsl(var(--text-muted))]'}`}
                  style={{ backgroundColor: `rgba(59, 130, 246, ${val / 100})` }}
                >
                  {val}%
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};