# DATA-01: Scenario Hydration

## Requirements
- **Goal:** Implement data-driven game logic to replace hard-coded actions.
- **Components:**
  - `engine/hydrator.py`: Responsible for loading and parsing scenario files.
  - `engine/controller.py`: Must be refactored to use hydrated data for turn execution.
  - `main.py`: Must dynamically display available actions based on the loaded scenario.
- **Data Source:** `data/scenarios/phase_{n}.json` where `{n}` is the current game phase.
- **Logic:**
  - Upon initialization or phase change, the system loads the corresponding scenario JSON.
  - Turn logic ("work", "rest", etc.) is no longer hard-coded in Python. It is defined in the JSON under an "actions" key.
  - Each action defines its costs (health) and rewards (points) as ranges (min/max) for the RNG.
- **DoD:**
  - `main.py` dynamically lists actions from `phase_1.json`.
  - Executing an action applies the math defined in the JSON.
