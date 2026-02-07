# WEB-13: System Settings & Profile App

## Requirements
- **Goal:** Implement a centralized settings and profile management application.
- **Backend Changes:**
  - `GameState` must track `player_name` and `job_title`.
  - Add `/resign` endpoint to manually end the simulation.
- **UI Architecture:**
  - Use the `Window` component.
  - **Left Column:** Profile details (Avatar, Name, Title, Level).
  - **Right Column:** System controls (Strategy view, Personal Best, Dark Mode toggle, Resign button).
- **Integration:**
  - Settings app accessible via a Gear Icon on the Desktop or Taskbar.
  - "Resign" action triggers the `GAME_OVER` state and shows the `ReportCard`.

## DoD
- Settings window displays correct player data.
- "Resign" button successfully transitions game status to `GAME_OVER`.
- Window aesthetic matches the proSIM OS design system.
