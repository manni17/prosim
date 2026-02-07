# PROJECT MANIFEST (Root of Trust)

## 1. DNA & Tech Stack
- **Core Language:** Python 3.12+
- **Type System:** Strict Static Typing (Mypy/Pydantic).
- **Validation:** Pydantic Models for all data structures.
- **UI/UX:** Rich (Text-based UI) for terminal output.
- **Persistence:** JSON (Human-readable, portable).
- **Environment:** Windows (win32) native compatibility required.

## 2. Architecture Rules
- **Headless State-Machine:** The `engine/` directory contains ONLY logic and state management. It must run without a UI.
- **Zero Hard-Coding:** 
  - No magic numbers or strings in `engine/` logic. 
  - All game parameters (start health, max phase, scoring multipliers) must be loaded from external configuration (JSON/YAML) or defined in a dedicated `config` module, not buried in logic.
- **Data-Driven:** Behavior is dictated by data files in `data/`, not if/else chains in code.
- **Fail-Fast:** Validation errors (Pydantic) should stop execution immediately to prevent corrupt state.

## 3. Development Workflow
- **Protocol:** Read -> Plan -> Execute -> Verify -> Document.
- **Definition of Done (DoD):**
  - Code compiles/runs.
  - Unit tests pass.
  - `docs/BACKLOG.md` updated.
  - No regressions in existing features.

## 4. System References
- **Technical Governance:** /docs/CONTEXT.md
- **Task Sequencing:** /docs/BACKLOG.md
- **Feature Blueprints:** /docs/specs/