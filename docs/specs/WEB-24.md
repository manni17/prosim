# WEB-24: Prediction Loop Modal

## Requirements
- **Goal:** Implement the "Prediction Loop" pedagogical mechanic. Users must forecast the impact of critical decisions before seeing the results.
- **Logic:**
  - Critical options in the Inbox/Chat will have a `requires_prediction: true` flag.
  - When such an option is clicked, the UI must intercept the action and display the `PredictionModal`.
  - The modal collects the user's qualitative forecast (e.g., Revenue: Increase, Trust: Decrease).
  - The prediction is sent to the backend along with the `action_id`.
- **Backend Scoring:**
  - The engine calculates the delta of the predicted metrics.
  - If the user's predicted direction matches the actual delta, `product_sense_score` increases.

## UI/UX
- **Component:** `PredictionModal.tsx`.
- **Style:** Glassmorphism overlay, high-contrast toggle buttons for Increase/Neutral/Decrease.
- **Trigger:** Strategic turns (Fork at Turn 3, Level transitions, etc.).

## DoD
- Clicking a "Strategic" option stops immediate execution.
- Prediction modal captures user intent.
- `product_sense_score` is updated on the backend.
- Completion of prediction executes the turn.
