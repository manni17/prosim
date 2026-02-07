# WEB-14: Interactive Onboarding Tour

## Requirements
- **Goal:** Introduce new users to the proSIM OS interface via a guided "Spotlight" tour.
- **Backend Changes:**
  - Add `tutorial_complete` (bool) to `GameState`.
  - Add `/tutorial-complete` endpoint to persist the flag.
- **Frontend Architecture:**
  - `Tutorial.jsx`: A high-z-index overlay component.
  - **Mechanic:** A "Spotlight" effect created using CSS masking or absolute positioning with inset shadows.
  - **Steps:**
    1. **Welcome:** Center modal introducing the role.
    2. **Status:** Highlight Taskbar (Health, Morale, Trust, Revenue).
    3. **Analytics:** Highlight MaxPanel icon (Data-driven decisions).
    4. **Narrative:** Highlight Inbox icon (Consequence management).
- **Trigger Logic:** Launch automatically if `gameState.tutorial_complete` is false.

## DoD
- Tour launches on first initialization.
- Spotlight correctly aligns with UI elements across steps.
- Finishing the tour calls the backend and prevents re-launch on page reload.
