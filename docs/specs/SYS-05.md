# SYS-05: Win/Loss Logic & End State

## Requirements
- **Goal:** Implement definitive end-game states to transition the simulation from "Active" to "Closed".
- **State Update:**
  - `status` field must support: `"ACTIVE"`, `"VICTORY"`, `"GAME_OVER"`.
- **Logic (`SimulationController`):**
  - Check Win/Loss conditions at the end of every `apply_turn`.
  - **Loss Condition:** If `health <= 0` OR `trust <= 0` -> Set status to `"GAME_OVER"`.
  - **Win Condition:** If `revenue >= 100000` -> Set status to `"VICTORY"`.
- **Feedback:**
  - Upon state change, append a "System Message" email to the session's inbox notifying the player of the result.
- **Verification:**
  - Specific unit tests must prove that decreasing health to 0 triggers "GAME_OVER" and increasing revenue to 100k triggers "VICTORY".

## DoD
- `tests/unit/test_game_over.py` passes.
- Final status is persisted in the state.
- Inbox contains the termination message.
