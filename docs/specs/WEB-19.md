# WEB-19: Glassmorphism Onboarding Tour

## Requirements
- **Goal:** Port and enhance the onboarding experience for the high-fidelity Steller Glass UI.
- **UI Architecture:**
  - `TutorialOverlay.tsx`: A high-z-index overlay with a dynamic "Spotlight" cutout effect.
  - **Visual Style:** Consistent with the ethereal glass aesthetic (`backdrop-blur`, semi-transparent backgrounds).
  - **Steps:**
    1. **Welcome:** Center glass card introducing proSIM OS.
    2. **The Dock:** Highlight the bottom navigation bar (App switching).
    3. **The System Bar:** Highlight the top metrics (Health, Trust, Morale, Revenue).
    4. **The Mission:** Highlight the Inbox icon (Decision driving).
- **Persistence:** Call `api.completeTutorial` on finish to ensure the tour only runs once.

## DoD
- Tour launches automatically for new sessions.
- Spotlight effect correctly frames the new UI components (Dock, TopBar).
- Completion state is persisted to the backend.
