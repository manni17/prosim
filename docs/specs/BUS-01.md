# BUS-01: Competency Assessment Engine

## Objective
Transform raw behavioral telemetry (IndexedDB) and simulation outcomes (GameState) into a standardized **Competency Scorecard** (0-100) for professional profiling.

## Scoring Logic
1.  **Conviction (25%):** Measured by decision speed, penalized by excessive hovering and mind-changing (`is_reversal`).
2.  **Strategic Consistency (25%):** Alignment between chosen archetype and subsequent actions (e.g., Floodgate vs Growth-heavy actions).
3.  **Cognitive Durability (25%):** Performance stability in Level 2+, penalized by `PANIC_CHECK` tab switches.
4.  **Trade-Off Intelligence (25%):** ROI of revenue generation vs. vital metric preservation.

## Technical Components
- **Engine:** `client/src/engine/AssessmentEngine.ts` (The Analyzer).
- **UI:** `client/src/components/meta/CompetencyScorecard.tsx` (The Visualization).
- **Integration:** Hooked into the `ReportCard.tsx` flow.

## DoD
- Scorecard generates a unique profile based on IndexedDB events.
- UI adheres to the "Dark Ethereal Glass" design system.
- Users can view their PM Quotient at the end of a session.
