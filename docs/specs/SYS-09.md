# SYS-09: Persistent Session Storage

## Requirements
- **Goal:** Ensure game sessions survive server restarts by persisting session state to the disk.
- **Mechanism:**
  - **Storage Directory:** `data/sessions/`.
  - **File Format:** `{session_id}.json`.
- **Logic:**
  - **Save:** Whenever a turn is executed or a new game is started, the `GameState` must be written to its corresponding file.
  - **Load (Cache Aside):** `get_controller` first checks the in-memory cache. If missing, it attempts to load from `data/sessions/`.
  - **Garbage Collection:** (Future Scope) Logic to delete old session files.
- **Constraints:**
  - Do not use the legacy `data/state.json` (reserved for CLI single-player).

## DoD
- Killing and restarting the FastAPI server does not lose active session data.
- Multiple sessions are stored as individual files in `data/sessions/`.
- Integration tests confirm disk-rehydration works.
