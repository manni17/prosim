# LOG-02: Win/Loss States & Advanced Telemetry

## Requirements
- **Goal:** Implement Win/Loss detection logic and state enforcement.
- **State Update:**
  - Add `status` field to `GameState` with values: `'ACTIVE'`, `'WON'`, `'LOST_BURNOUT'`, `'LOST_FIRED'`, `'LOST_MUTINY'`.
- **Logic (`engine/controller.py`):**
  - After every turn, `check_game_over()` must be called.
  - **Win Condition:** Score >= 1000 -> `WON`
  - **Fail Conditions:**
    - Health <= 0 -> `LOST_BURNOUT`
    - Trust <= 0 -> `LOST_FIRED`
    - Morale <= 0 -> `LOST_MUTINY`
- **Telemetry (`engine/logger.py`):**
  - Log a final event when the game status changes from `ACTIVE`.
- **UI (`main.py`):**
  - The `turn` command must be blocked if `status != 'ACTIVE'`.
  - The `status` command should display a prominent "GAME OVER" panel if not `ACTIVE`.

## DoD
- Running `turn` when health is 0 results in a blocked command.
- `data/state.json` persists the final `status`.
- CLI explicitly states the cause of failure/victory.
