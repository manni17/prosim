# SYS-10: Quarterly Business Review (QBR) System

## Requirements
- **Goal:** Insert a strategic planning phase between campaign levels to allow players to set new objectives and apply permanent physics modifiers.
- **State Update:**
  - `status` field now supports: `"REVIEW"`.
  - Add `quarterly_focus` (str) to `GameState`.
  - Add `physics_modifiers` (Dict[str, float]) to `GameState` to store cumulative multipliers.
- **Logic:**
  - When a level's turn limit is reached (or victory achieved), status transitions to `"REVIEW"`.
  - **Focus Options:**
    - **Blitzscale:** +30% Traffic, -10% Stability (Health/Trust cost multiplier).
    - **Fortify:** +20% Stability (Health/Trust cost reduction), -10% Traffic.
    - **Monetize:** +20% AOV, -5% Conversion Rate.
- **Level Transition:**
  - `POST /commit-strategy` applies the modifiers, resets the turn clock, increments the level, and returns the status to `"ACTIVE"`.

## DoD
- QBR screen appears at the end of a campaign level.
- Selecting a focus applies permanent changes to the underlying simulation math.
- The next level loads with the new strategic constraints.