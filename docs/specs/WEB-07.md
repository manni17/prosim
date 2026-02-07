# WEB-07: After-Action Report (AAR) Dashboard

## Requirements
- **Goal:** Visualize the player's journey and performance metrics over time upon completion of the simulation.
- **Backend Changes:**
  - Update `LogEntry` to include absolute snapshots of core metrics (`health`, `revenue`, `morale`, `trust`) at the time of the turn.
- **Frontend Changes:**
  - Create `ReportCard.jsx` to replace/augment the `GameOver` modal.
  - **Visualizations (using Recharts):**
    - **Line Chart (Health):** "The Road to Burnout" showing health trends.
    - **Area Chart (Revenue):** "Market Growth" showing revenue progress toward the $100k target.
  - **Performance Grading:**
    - Calculate a letter grade (A+ through F) based on final revenue and remaining health/morale.
  - **Decision Summary:** List the pivotal decisions made during the session.

## DoD
- Upon `GAME_OVER` or `VICTORY`, the `ReportCard` renders with accurate data.
- Charts correctly visualize the state transitions recorded in `history`.
- "Restart" functionality remains accessible.
