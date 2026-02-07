# LOG-01: Structured Telemetry

## Requirements
- **Goal:** Convert `state.history` from a list of strings to a list of structured dictionaries.
- **Component:** Create `engine/logger.py` with a `TelemetryLogger` class.
- **Data Model (LogEntry):**
  - `timestamp`: ISO 8601 string (e.g., "2023-10-27T10:00:00")
  - `turn_index`: int (sequence number of the turn)
  - `phase`: int (current game phase)
  - `action_id`: str (id of the action taken)
  - `metrics`: Dict[str, float] (e.g., `{'health_delta': -0.1, 'score_delta': 20}`)
  - `seed`: int (RNG seed state for reproducibility)
- **Refactoring:**
  - `engine/state.py`: Update `history` type to store `LogEntry` objects (or Dicts).
  - `engine/controller.py`: Use `TelemetryLogger.log_turn()` instead of `state.history.append()`.
  - `main.py`: Update `status` command to format the structured logs into a readable table.
- **DoD:**
  - `data/state.json` persistence file contains full telemetry objects in the `history` list.
  - `prosim status` displays a clean, readable history log to the user (hiding raw JSON).
