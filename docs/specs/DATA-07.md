# DATA-07: Analytics Dataset Loader

## Requirements
- **Goal:** Serve strategy-specific analytics datasets to the frontend to simulate deep data insights without complex real-time computation.
- **Logic:**
  - The backend tracks the current `strategy_archetype` in the `GameState`.
  - Upon request to `/analytics`, the server loads the corresponding JSON from `data/analytics/`.
- **Data Schema:**
  - `funnel`: Object mapping steps to counts (Visitors, Cart, Checkout, Purchase).
  - `sources`: Object mapping traffic sources to percentages.
  - `retention`: 2D array representing cohort retention.
- **Physics Link:**
  - Choosing "Floodgate", "Velvet", or "Frictionless" updates the `strategy_archetype`.

## DoD
- /analytics endpoint returns the correct dataset for the active strategy.
- MaxPanel displays different charts depending on whether the player is in "Floodgate" or "Velvet" mode.