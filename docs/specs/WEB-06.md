# WEB-06: End Game Screens

## Requirements
- **Goal:** Provide a definitive visual conclusion to the simulation, blocking further interaction upon victory or failure.
- **Component:** `GameOver.jsx`.
- **Logic:** 
  - `App.jsx` monitors `gameState.status`.
  - If `status === 'VICTORY'` or `status === 'GAME_OVER'`, the `GameOver` modal is rendered as a full-screen overlay.
- **Visuals:**
  - **Victory:** Green aesthetic, celebratory message regarding "Series A Funding".
  - **Game Over:** Red aesthetic, stern message regarding "Termination".
- **Actions:**
  - A "Restart" button to reset the simulation.

## DoD
- UI automatically switches to the End Screen when backend status changes.
- Desktop is obscured and non-interactive behind the modal.
- Restart button successfully reloads the application.
