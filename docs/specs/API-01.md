# API-01: FastAPI Server Integration

## Requirements
- **Goal:** Expose the simulation engine via a RESTful API to allow frontend clients (like React) to interact with the headless backend.
- **Tech Stack:** FastAPI, Uvicorn.
- **Architecture:** The API layer sits on top of the existing `engine/` modules (`SimulationController`, `GameState`).
- **Endpoints:**
  - `POST /new-game`: Resets the game state to defaults (Phase 1).
  - `GET /state`: Returns the current full `GameState`.
  - `POST /turn`: Accepts `{"action_id": "string"}` and executes a turn. Returns the updated state.
- **Constraints:**
  - Must not duplicate game logic; strictly call `SimulationController`.
  - Must handle `GameStatus` checks (return 400 if game over).
- **DoD:**
  - Server starts without errors.
  - `curl` commands can reset game, get state, and execute turns.
