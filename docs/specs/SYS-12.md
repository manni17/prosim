# SYS-12: Narrative Physics Overrides

## Requirements
- **Goal:** Allow the narrative context (e.g., chosen Strategic Archetype) to dynamically override or constrain the underlying simulation math.
- **Mechanism:** 
  - Add `physics_overrides: Dict[str, float]` to `GameState`.
  - The `SimulationController` checks this dictionary during revenue and metric calculations.
- **Floodgate Logic:** 
  - Choosing 'Floodgate' sets a `conversion_cap` of 0.004 (0.4%).
  - This cap persists until the `fix_kyc` upgrade is acquired.
- **Velvet Logic:** 
  - Choosing 'Velvet' sets a `traffic_cap` and an `aov_floor`.

## Data Schema Changes
- `GameState`:
  - `physics_overrides: Dict[str, float]` (default: empty).

## Logic Changes
- **Controller:**
  - `commit_strategy`: Initializes the overrides based on the strategy.
  - `_recalculate_revenue`: Applies caps/floors defined in `physics_overrides`.
  - `execute_turn`: Checks for upgrades (like `fix_kyc`) to remove relevant overrides.

## DoD
- Floodgate players are capped at 0.4% conversion regardless of traffic.
- Buying "Fix KYC" removes the cap.
- Overrides are persisted in the session state.
