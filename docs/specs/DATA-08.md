# DATA-08: Adaptive Q2 Campaign

## Requirements
- **Goal:** Provide a tailored narrative experience for Quarter 2 based on the strategic focus chosen during the QBR.
- **Logic:**
  - Extend the `EventTrigger` model to include `required_focus` (Optional[str]).
  - The `SimulationController._process_triggers` must verify that the event's `required_focus` matches the `state.quarterly_focus`.
- **Content Arc:**
  - **Blitzscale:** Focus on scaling pains (Traffic spikes, infrastructure costs, burnout).
  - **Fortify:** Focus on stability and debt (Refactoring, system reliability, ops efficiency).
  - **Monetize:** Focus on revenue extraction (Pricing updates, churn risks, enterprise deals).
- **Structure:**
  - Content stored in `data/content/emails_lvl2.json`.

## DoD
- Q2 starts with a strategy-specific kickoff email.
- Players only see content relevant to their chosen focus.
- Integration tests confirm the conditional visibility.
