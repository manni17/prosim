# Product Requirements Document (PRD): ProSim
**Version:** 4.0 (Behavioral Oracle)
**Status:** Active Governance

## 1. Product Vision
To build the industry's first **Behavioral Assessment Engine** for Product Management. Unlike traditional simulators that focus on "winning," ProSim focuses on **profiling**. We capture high-fidelity "flight data" (hesitation, consistency, trade-off logic) to generate a Competency Scorecard that predicts job performance better than an interview.

## 2. Strategic Pillars

### Pillar A: The Iron Quadrant (Physics)
* **Requirement:** The engine must enforce zero-sum trade-offs. No decision can improve Health, Trust, Morale, and Score simultaneously.

### Pillar B: Behavioral Telemetry (The Data Moat)
* **Requirement:** `ISimulationLogger` must capture not just *what* was decided, but *how* (Time-to-Decide, Reversal Rates, Hover-Abandon patterns).
* **Goal:** Differentiate between "Thoughtful Risk" and "Reckless Gambling."

### Pillar C: Assessment Over Gameplay (The Customer)
* **Requirement:** The primary artifact is not the "Victory Screen" but the **Competency Scorecard (PDF)** generated at the end.
* **Constraint:** "Assessment Mode" must disable debug tools, seeds, and retry mechanisms to ensure standardized testing conditions.

## 3. Functional Requirements Map

| Feature | Pedagogical Goal | Technical Spec |
| :--- | :--- | :--- |
| **DATA-01** | Behavioral Telemetry | `docs/specs/DATA-01.md` |
| **BUS-01** | Scorecard Generation | `docs/specs/BUS-01.md` |
| MaxPanel 3.0 | Data Literacy | docs/specs/WEB-10.md |
| War Room | Crisis Management | docs/specs/WEB-12.md |
| Prediction Modal | Metacognition | docs/specs/WEB-23.md |
| Smart Inbox | Prioritization | docs/specs/SYS-08.md |

## 4. Success Metrics
* **Signal Quality:** Scorecards accurately identify the difference between "Growth-at-all-costs" and "Balanced" PM archetypes.
* **Completion Rate:** 100% of finished sessions result in an exported PDF Artifact.
