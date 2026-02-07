# SYS-03: Iron Quadrant Logic Layer

## Requirements
- **Goal:** Implement the physics for the "Desktop Simulator" apps by tracking "Morale" and "Trust".
- **New State Variables:**
  - `morale` (float): 0.0 to 1.0. represents the Team Chat app state.
  - `trust` (float): 0.0 to 1.0. represents the Email/Inbox app state.
- **Refactoring:**
  - `engine/state.py`: Update `GameState` to include these variables with validators.
  - `engine/hydrator.py`: Update `ActionCost` and `ActionReward` to parse impacts on `morale` and `trust`.
  - `engine/controller.py`: Apply changes to these variables during turn execution based on scenario data.
  - `main.py`: Update the `status` command to display these new metrics, ideally verifying the "4-Quadrant" data availability.
- **DoD:**
  - `data/state.json` persists `morale` and `trust`.
  - Actions in `phase_1.json` affect these values correctly.
  - CLI displays the new values.
