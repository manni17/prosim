# WEB-08: Mission Briefing & Start Screen

## Requirements
- **Goal:** Establish a "Login Portal" that sets the context for the simulation before the user enters the Desktop environment.
- **Component:** `StartScreen.jsx`.
- **User Flow:**
  1. User arrives at the root URL.
  2. User is presented with the "Steller OS" login portal and mission briefing.
  3. User clicks "Login to Terminal".
  4. App initializes a new game session via the API and transitions to the Desktop.
- **Visuals:**
  - Professional B2B / OS Login aesthetic.
  - Clear mission objectives: "Hit $100k Revenue" and "Maintain Team Morale".
- **Logic:**
  - `App.jsx` state management for `gameStarted` transition.
  - Deferred API initialization.

## DoD
- Page loads to the Start Screen by default.
- Clicking Start correctly initializes the backend session.
- Smooth transition to the Desktop UI.
