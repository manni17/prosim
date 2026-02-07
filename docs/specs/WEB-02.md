# WEB-02: Frontend-Backend Integration

## Requirements
- **Goal:** Connect the React Frontend (`client`) to the FastAPI Backend (`server`) to drive the UI with real simulation data.
- **Architecture:**
  - **Service Layer:** `client/src/services/api.js` acts as the centralized Axios wrapper for all HTTP requests.
  - **State Management:** `App.jsx` "hoists" the global state:
    - `sessionId` (String): The UUID token for the current game.
    - `gameState` (Object): The full Pydantic model returned by the engine (health, morale, trust, score).
  - **Lifecycle:**
    1. On App Mount: Call `api.startNewGame()`.
    2. Save returned `session_id`.
    3. Call `api.getState(session_id)` to hydrate the UI.
- **UI Updates:**
  - `Taskbar.jsx`: Must accept `gameState` as a prop and display formatted metrics (e.g., "Health: 80%").
  - `Desktop.jsx`: Must handle loading states (e.g., "Initializing OS...").

## DoD
- Frontend successfully requests a new session from `localhost:8000`.
- Taskbar displays live data from the backend (not hardcoded).
- No CORS errors in the browser console.
