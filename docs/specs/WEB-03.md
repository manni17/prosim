# WEB-03: Inbox Application

## Requirements
- **Goal:** Create an interactive "Inbox" window within the React Desktop to allow players to read narrative scenarios and make decisions.
- **Components:**
  - `Inbox.jsx`: The main container.
  - `EmailList`: Sidebar displaying list of emails.
  - `EmailDetail`: Main view displaying body and actions.
- **Data Source:** `GET /inbox` via `api.js`.
- **Interaction:**
  - Clicking an email in the list selects it.
  - Clicking an Action Button in `EmailDetail` triggers `POST /turn` via `api.makeDecision()`.
- **State Updates:**
  - After a decision, the app must refresh the global `GameState` (Health, Trust, etc.) by calling a parent callback `onTurnComplete()`.
  - The processed email should be removed from the local list (optimistic UI or re-fetch).

## DoD
- "Email" icon on Desktop toggles the window.
- Inbox displays "Cart Abandonment" scenario.
- Clicking "Hotfix Checkout" updates the Taskbar metrics immediately.
