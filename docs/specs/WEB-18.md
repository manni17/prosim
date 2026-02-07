# WEB-18: Quarterly Review UI Migration

## Requirements
- **Goal:** Provide a high-fidelity interface for the "Quarterly Business Review" (QBR) strategic checkpoint between campaign levels.
- **UI Architecture:**
  - `QuarterlyReview.tsx`: Full-screen glass overlay appearing when game status is `REVIEW`.
  - **3-Column Selection:**
    - **Blitzscale:** Growth focus (+30% Traffic, -10% Stability).
    - **Fortify:** Stability focus (+20% Stability, -10% Traffic).
    - **Monetize:** Profit focus (+20% AOV, -5% Conversion).
- **Logic:**
  - Selecting a focus calls `api.commitStrategy`.
  - On success, the game transitions back to `ACTIVE` and increments the campaign level.

## DoD
- QBR interface appears automatically when the backend transitions to the `REVIEW` state.
- Selecting and confirming a strategy successfully advances the game to Level 2.
- Aesthetic matches the "Steller Glass" design system.
