import { telemetry, TelemetryEvent } from '@/services/telemetry';
import { GameState } from '@/services/api';

export interface CompetencyScores {
  conviction: number;
  strategic_consistency: number;
  cognitive_durability: number;
  trade_off_intelligence: number;
  overall: number;
}

const BASELINE = {
  DECISION_MS: 8000,
  MAX_HOVERS: 3,
  MAX_REVERSALS: 1,
};

export async function generateCompetencyReport(gameState: GameState, sessionId: string): Promise<CompetencyScores> {
  const allEvents = await telemetry.getAllEvents();
  const sessionEvents = allEvents.filter(e => e.sessionId === sessionId);

  if (sessionEvents.length === 0) return createZeroScore();

  const scores = {
    conviction: calculateConviction(sessionEvents),
    strategic_consistency: calculateConsistency(gameState, sessionEvents),
    cognitive_durability: calculateResilience(gameState, sessionEvents),
    trade_off_intelligence: calculateTradeOffIntelligence(gameState),
    overall: 0
  };

  scores.overall = Math.round(
    (scores.conviction * 0.25) +
    (scores.strategic_consistency * 0.25) +
    (scores.cognitive_durability * 0.25) +
    (scores.trade_off_intelligence * 0.25)
  );

  return scores;
}

function calculateConviction(events: TelemetryEvent[]): number {
  const commits = events.filter(e => e.type === 'DECISION_COMMIT');
  if (commits.length === 0) return 0;

  let scoreSum = 0;

  commits.forEach(commit => {
    const meta = commit.metadata;
    
    // 1. Duration Score (100% if under 8s, decays)
    const duration = meta.duration_ms || BASELINE.DECISION_MS;
    const speedScore = Math.max(0, 1.0 - (duration / 20000));
    
    // 2. Hesitation Penalty (Based on total hovers)
    const hovers = meta.total_hovers || 0;
    const hesitationPenalty = Math.max(0, (hovers - BASELINE.MAX_HOVERS) * 0.1);
    
    // 3. Reversal Penalty (Heavy -15%)
    const reversalPenalty = meta.is_reversal ? 0.15 : 0;
    
    scoreSum += (speedScore - hesitationPenalty - reversalPenalty);
  });

  return normalize(scoreSum / commits.length);
}

function calculateConsistency(gameState: GameState, events: TelemetryEvent[]): number {
  if (gameState.history.length === 0) return 0;

  const archetype = gameState.strategy_archetype;
  let consistencySum = 0;

  gameState.history.forEach(turn => {
    const actionId = turn.action_id;
    let aligned = false;

    // Check for logical alignment with chosen archetype
    if (archetype === 'floodgate' && (actionId.includes('traffic') || actionId.includes('influencer') || actionId.includes('intl_launch') || actionId.includes('fix_kyc'))) aligned = true;
    if (archetype === 'velvet' && (actionId.includes('aov') || actionId.includes('bundle') || actionId.includes('premium'))) aligned = true;
    if (archetype === 'frictionless' && (actionId.includes('rate') || actionId.includes('checkout') || actionId.includes('refactor'))) aligned = true;

    // Penalty for "Wait & See" (status_quo) in a growth archetype
    if (actionId === 'status_quo') consistencySum += 50;
    else aligned ? consistencySum += 100 : consistencySum += 20;
  });

  return clamp(consistencySum / gameState.history.length);
}

function calculateResilience(gameState: GameState, events: TelemetryEvent[]): number {
  const panicChecks = events.filter(e => e.type === 'TAB_SWITCH' && e.metadata.context === 'PANIC_CHECK').length;
  
  // Base resilience from metrics stability
  const history = gameState.history;
  if (history.length === 0) return clamp(100 - (panicChecks * 10));

  let stabilitySum = 0;
  history.forEach(turn => {
    const health = turn.health || 0;
    const trust = turn.trust || 0;
    stabilitySum += (health + trust) / 2;
  });

  const baseStability = (stabilitySum / history.length) * 100;
  const panicPenalty = panicChecks * 10;

  return clamp(baseStability - panicPenalty);
}

function calculateTradeOffIntelligence(gameState: GameState): number {
  if (gameState.history.length === 0) return 50;

  // Efficiency: ROI of Trust/Health spend
  const totalGain = gameState.revenue / 100000; // Target 100k
  const vitals = (gameState.health + gameState.trust + gameState.morale) / 3;
  
  // High score while maintaining high vitals = High Intelligence
  const roi = (totalGain * 60) + (vitals * 40);
  return clamp(roi);
}

function normalize(val: number): number {
  return clamp(val * 100);
}

function clamp(val: number): number {
  return Math.max(0, Math.min(100, Math.round(val)));
}

function createZeroScore(): CompetencyScores {
  return { conviction: 0, strategic_consistency: 0, cognitive_durability: 0, trade_off_intelligence: 0, overall: 0 };
}