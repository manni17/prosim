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
  LabelList,
  ReferenceLine,
  PieChart,
  Pie
} from "recharts";
import { TrendingUp, Users, DollarSign, Brain, Target, Activity, Lock } from "lucide-react";
import { GameState, AnalyticsData } from "@/services/api";
import { clsx } from "clsx";
import { useProgressiveValue } from "@/hooks/useProgressiveValue";
import { parseWikiLinks } from "@/utils/textParser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface MaxPanelProps {
  gameState: GameState;
  analytics: AnalyticsData | null;
  sessionId: string;
  wiki: Record<string, any>;
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

export const MaxPanel = ({ gameState, analytics, sessionId, wiki }: MaxPanelProps) => {
  const [activeMetric, setActiveMetric] = useState<string>("revenue");
  const [currentTab, setCurrentTab] = useState("overview");
  
  const storageKey = `maxpanel_viewed_turn_${sessionId}`;
  const [visualizedTurn, setVisualizedTurn] = useState<number>(() => {
    return parseInt(sessionStorage.getItem(storageKey) || "0");
  });

  const isTabLocked = (tabId: string) => {
    const level = gameState.current_level;
    if (tabId === "funnels" || tabId === "retention") return level < 2;
    if (tabId === "flows") return level < 3;
    return false;
  };

  const handleTabClick = (tabId: string) => {
    if (isTabLocked(tabId)) {
      const required = (tabId === "funnels" || tabId === "retention") ? 2 : 3;
      toast.error("Security Clearance Required", {
        description: `Promote to Level ${required} to unlock advanced telemetry.`,
        icon: <Lock className="w-4 h-4" />
      });
      return;
    }
    setCurrentTab(tabId);
  };
  
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
      const DURATION = 3000;

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
  const activeHex = { emerald: "#10b981", blue: "#3b82f6", purple: "#a855f7" }[activeTheme?.theme || "blue"] || "#3b82f6";

  const sourceColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'];
  const sourceData = Object.entries(analytics.sources || {}).map(([name, value], idx) => ({
    name,
    value,
    color: sourceColors[idx % sourceColors.length]
  }));

  const funnelData = Object.entries(analytics.funnel).map(([name, value], idx) => ({
    name,
    value,
    color: sourceColors[idx % sourceColors.length]
  }));

  const retentionCurve = (analytics.retention || []).map((cohort, idx) => ({
    week: `Week ${idx}`,
    value: cohort[0] || 0
  }));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-6 space-y-6 overflow-y-auto max-h-full no-scrollbar">
      <Tabs value={currentTab} onValueChange={handleTabClick} className="w-full">
        <TabsList className="glass-card border-0 p-1 mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[hsl(var(--glass-hover))] data-[state=active]:text-[hsl(var(--text-primary))] text-[hsl(var(--text-muted))]">
            Overview
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-[hsl(var(--glass-hover))] data-[state=active]:text-[hsl(var(--text-primary))] text-[hsl(var(--text-muted))]">
            Insights
          </TabsTrigger>
          <TabsTrigger 
            value="funnels" 
            className={clsx(
              "data-[state=active]:bg-[hsl(var(--glass-hover))] data-[state=active]:text-[hsl(var(--text-primary))]",
              isTabLocked("funnels") ? "text-slate-600 cursor-not-allowed" : "text-[hsl(var(--text-muted))]"
            )}
          >
            <div className="flex items-center gap-2">
              {isTabLocked("funnels") && <Lock className="w-3 h-3" />}
              Funnels
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="retention" 
            className={clsx(
              "data-[state=active]:bg-[hsl(var(--glass-hover))] data-[state=active]:text-[hsl(var(--text-primary))]",
              isTabLocked("retention") ? "text-slate-600 cursor-not-allowed" : "text-[hsl(var(--text-muted))]"
            )}
          >
            <div className="flex items-center gap-2">
              {isTabLocked("retention") && <Lock className="w-3 h-3" />}
              Retention
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                {m.icon && <m.icon className={clsx("w-5 h-5 mb-3", m.color)} />}
                <p className="text-2xl font-bold text-display">{m.value}</p>
                <p className="text-[10px] text-caption uppercase tracking-widest">{parseWikiLinks(`[[${m.id}]]`, wiki) || m.label}</p>
              </button>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6">
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
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-display uppercase tracking-widest">Growth Velocity</h3>
                  <p className="text-[10px] text-caption">vs last turn</p>
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-400">+{((gameState.revenue / (prevValues.revenue || 1) - 1) * 100).toFixed(1)}%</p>
              <p className="text-xs text-body mt-2">Revenue is responding to your {gameState.strategy_archetype} strategy.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-display uppercase tracking-widest">Product Sense</h3>
                  <p className="text-[10px] text-caption">Accuracy Rating</p>
                </div>
              </div>
              <p className="text-3xl font-black text-purple-400">{Math.round(gameState.last_prediction_accuracy || 0)}%</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/5">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${gameState.last_prediction_accuracy || 0}%` }} />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-2 glass-card rounded-xl p-6">
              <h3 className="text-[10px] font-black text-caption tracking-widest uppercase mb-4">Active System Signals</h3>
              <div className="space-y-4">
                {gameState.active_risks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 animate-pulse" />
                    <div>
                      <p className="text-sm font-bold text-display uppercase tracking-tight text-rose-400">Warning: {risk.replace('_', ' ')}</p>
                      <p className="text-xs text-caption">System instability is impacting user trust and conversion.</p>
                    </div>
                  </div>
                ))}
                {gameState.active_upgrades.map((up, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                    <div>
                      <p className="text-sm font-bold text-display uppercase tracking-tight text-emerald-400">Resolved: {up.replace('_', ' ')}</p>
                      <p className="text-xs text-caption">Optimization active. System performance improved.</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
              <h3 className="text-[10px] font-black text-caption tracking-widest uppercase mb-6">Traffic Composition</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {sourceData.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] text-caption uppercase font-bold">{s.name}</span>
                    <span className="text-xs text-white ml-auto font-mono">{s.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
              <h3 className="text-[10px] font-black text-caption tracking-widest uppercase mb-6">Conversion Funnel</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {funnelData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      <LabelList dataKey="value" position="right" fill="#f8fafc" fontSize={10} offset={10} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-caption uppercase font-bold mb-1">Global Conversion</p>
                <p className="text-2xl font-black text-emerald-400">{(gameState.conversion_rate * 100).toFixed(2)}%</p>
              </div>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="retention" className="space-y-6">
          <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
            <h3 className="text-[10px] font-black text-caption tracking-widest uppercase mb-6 text-center">User Retention Curve</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={retentionCurve}>
                  <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 10 }} unit="%" />
                  <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Area type="monotone" dataKey="value" stroke="#10b981" fill="url(#grad-retention)" strokeWidth={3} />
                  <defs>
                    <linearGradient id="grad-retention" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-card rounded-xl p-6">
            <h3 className="text-[10px] font-black text-caption tracking-widest uppercase mb-6">Retention Cohorts</h3>
            <div className="grid grid-cols-4 gap-1">
              {['Cohort', 'Turn 0', 'Turn 1', 'Turn 2'].map(h => <div key={h} className="text-[9px] font-bold text-slate-500 uppercase pb-2 text-center">{h}</div>)}
              {analytics.retention.map((cohort, rowIdx) => (
                <div key={rowIdx} className="contents">
                  <div className="text-[9px] text-slate-500 flex items-center">Jan 202{rowIdx}</div>
                  {cohort.map((val, colIdx) => (
                    <div 
                      key={colIdx} 
                      className={`p-2 text-center text-[10px] font-mono rounded transition-all ${val > 50 ? 'text-white' : 'text-slate-400'}`}
                      style={{ backgroundColor: `rgba(59, 130, 246, ${val / 100})` }}
                    >
                      {val}%
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};