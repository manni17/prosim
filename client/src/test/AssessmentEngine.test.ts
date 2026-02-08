import { describe, it, expect, vi } from 'vitest';
import { generateCompetencyReport } from '../engine/AssessmentEngine';

// Mock Telemetry Service
vi.mock('@/services/telemetry', () => ({
  telemetry: {
    getAllEvents: vi.fn(),
  },
}));

import { telemetry } from '@/services/telemetry';

describe('AssessmentEngine Scoring Logic', () => {
  const mockGameState: any = {
    strategy_archetype: 'floodgate',
    revenue: 50000,
    trust: 0.8,
    health: 0.8,
    morale: 0.8,
    history: [
      { action_id: 'traffic_boost', health: 0.8, trust: 0.8, metrics: { health_delta: 0 } },
      { action_id: 'fix_kyc', health: 0.8, trust: 0.8, metrics: { health_delta: 0 }, phase: 2 }
    ],
  };

  it('calculates low Conviction for slow, indecisive behavior', async () => {
    const sessionId = 'test-session';
    (telemetry.getAllEvents as any).mockResolvedValue([
      { 
        sessionId, type: 'DECISION_START', turn: 1, timestamp: 1000 
      },
      { 
        sessionId, type: 'HOVER_ACTION', turn: 1, timestamp: 2000 
      },
      { 
        sessionId, type: 'HOVER_ACTION', turn: 1, timestamp: 3000 
      },
      { 
        sessionId, type: 'HOVER_ACTION', turn: 1, timestamp: 4000 
      },
      { 
        sessionId, type: 'HOVER_ACTION', turn: 1, timestamp: 5000 
      },
      { 
        sessionId, type: 'DECISION_COMMIT', turn: 1, timestamp: 20000, 
        metadata: { duration_ms: 19000, total_hovers: 4, is_reversal: true } 
      }
    ]);

    const report = await generateCompetencyReport(mockGameState, sessionId);
    
    // Expect low conviction score due to high duration (>15s), many hovers (>3), and reversal
    expect(report.conviction).toBeLessThan(40);
  });

  it('calculates high Resilience if no panic checks occur', async () => {
    const sessionId = 'resilience-session';
    (telemetry.getAllEvents as any).mockResolvedValue([
      { sessionId, type: 'DECISION_COMMIT', turn: 1, metadata: { duration_ms: 2000 } }
    ]);

    const report = await generateCompetencyReport(mockGameState, sessionId);
    // 80% health/trust avg = 80
    expect(report.cognitive_durability).toBe(80);
  });

  it('penalizes Resilience for PANIC_CHECK behavior', async () => {
    const sessionId = 'panic-session';
    (telemetry.getAllEvents as any).mockResolvedValue([
      { sessionId, type: 'DECISION_COMMIT', turn: 1, metadata: { duration_ms: 2000 } },
      { sessionId, type: 'TAB_SWITCH', metadata: { context: 'PANIC_CHECK' } },
      { sessionId, type: 'TAB_SWITCH', metadata: { context: 'PANIC_CHECK' } }
    ]);

    const report = await generateCompetencyReport(mockGameState, sessionId);
    // 80% baseline - (2 * 10) = 60
    expect(report.cognitive_durability).toBe(60);
  });

  it('calculates high Strategic Consistency for archetype-aligned actions', async () => {
    const sessionId = 'consistency-session';
    (telemetry.getAllEvents as any).mockResolvedValue([
      { sessionId, type: 'DECISION_COMMIT', turn: 1, metadata: { duration_ms: 2000 } }
    ]);

    const report = await generateCompetencyReport(mockGameState, sessionId);
    // Floodgate + 'traffic_boost' + 'fix_kyc' = 100% alignment
    expect(report.strategic_consistency).toBe(100);
  });
});
