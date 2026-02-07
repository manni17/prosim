# OPS-01: Dev Environment Automation

## Requirements
- **Goal:** Simplify the development workflow by allowing the entire proSIM stack (FastAPI + React) to be launched with a single terminal command.
- **Tooling:** Use `concurrently` (Node.js) to manage multiple processes in one terminal window.
- **Commands:**
  - `npm start`: The primary entry point. Launches the backend (BRAIN) and frontend (FACE).
  - `npm run install:all`: Unified dependency installation for both Python and Node environments.
- **Visuals:**
  - Prefix logs with names and colors (BRAIN=Green, FACE=Blue) for easier debugging.

## DoD
- Running `npm start` from the project root successfully loads both the API and the UI.
- Log output from both processes is visible and correctly labeled.
- `README.md` updated with simplified instructions.
