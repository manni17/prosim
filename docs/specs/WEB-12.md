# WEB-12: The Intervention Matrix

## Requirements
- **Goal:** Provide players with a persistent "War Room" menu of tactical interventions to respond to crises or optimize performance.
- **UI:** A grid-based "War Room" app categorized into Engineering, Product, and Communications.
- **Backend Logic:**
  - Interventions have an `efficacy` map against specific hidden risks (e.g., `memory_leak`).
  - Applying an intervention always incurs a cost (Morale, Trust, or Revenue).
  - If the intervention doesn't match the active risk, its effectiveness is `NONE`.
- **Data Source:** `data/content/interventions.json`.
- **Feedback:** Toast notifications must communicate the effectiveness of the action taken.

## DoD
- War Room icon exists on Desktop.
- 12+ interventions are available and categorized.
- Correctly matching an intervention to a risk (e.g., Memory Leak -> Patch Leak) results in high effectiveness.
