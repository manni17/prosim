# API-02: Session Management

## Requirements
- **Goal:** Enable multiple concurrent game sessions managed by the single API server.
- **Mechanism:**
  - **Memory Store:** The server maintains a dictionary `sessions: Dict[str, SimulationController]`.
  - **New Game:** `POST /new-game` generates a UUID, initializes a `SimulationController` with a fresh `GameState`, stores it in `sessions`, and returns the `session_id`.
  - **Context Switching:** All other endpoints (`/state`, `/turn`) MUST require a `X-Session-ID` header.
  - **Validation:** If the `session_id` is missing or invalid (not found in `sessions`), return 404 Not Found (or 401 Unauthorized).
- **Persistence:** For now, sessions are in-memory. (Future: Redis/Database).
- **DoD:**
  - Two distinct session IDs maintain independent game states.
  - Executing a turn in Session A does not affect the health/score of Session B.
