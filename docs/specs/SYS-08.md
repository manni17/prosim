# SYS-08: Narrative Pacing & Triggers

## Requirements
- **Goal:** Control the flow of narrative content (emails/chats) based on the current game state to prevent information overload and create a reactive story.
- **Trigger Schema:**
  - `min_turn` (int): Event appears on or after this turn.
  - `max_turn` (int): Event disappears after this turn.
  - `min_revenue` (float): Event appears when revenue exceeds this value.
  - `max_health` (float): Event appears when health drops below this value.
- **Logic:**
  - `SimulationController` will filter the raw content list against the current `GameState`.
  - An event is considered "Active" if its triggers are met AND it has not been acted upon (its action ID is not in `state.history`).
- **Persistence:**
  - The `GameState` will track which events have been "seen" to ensure sequential delivery if necessary.

## DoD
- The Inbox only shows "Turn 1" content at start.
- "Burnout" warning only appears when health is low.
- Sequential events appear only after previous turns are completed.
