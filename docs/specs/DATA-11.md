# DATA-11: Level 2 "The Churn Crisis"

## Requirements
- **Goal:** Shift the player's focus from acquisition to retention by introducing systemic churn penalties.
- **Narrative Arc:**
  - **Turn 0 (Q2):** Kickoff focusing on retention.
  - **Turn 2:** Major Outage forcing a choice between a quick fix (high churn) or root cause analysis (stability).
  - **Turn 5:** Feature Freeze decision.
- **Impacts:**
  - New action outcomes (e.g., `band_aid_fix`, `root_cause_analysis`).
  - `active_users` and `churn_rate` must be the primary feedback metrics in MaxPanel.

## Scenario Design
- **Event: Support Ticket Explosion**
  - Context: Users are frustrated with stability.
  - Impact: Trust --, Churn ++.
- **Event: Major Outage**
  - Choice A (Band-aid): Fast recovery, -5% Active Users (Immediate Churn).
  - Choice B (RCA): Slow recovery, +Trust, -2% Churn (Long-term).

## DoD
- Level 2 content loads when `current_level == 2`.
- "Active Users" decreases significantly if "Band-aid" is chosen.
- "Feature Freeze" impacts score but stabilizes trust.
