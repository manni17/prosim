# Changelog

All notable changes to this project will be documented in this file.

## [1.8.0] - 2026-02-02 (Strategic Archetypes)
### Added
- **Content:** Implemented "The Pivot Meeting" narrative event.
- **Mechanics:** Created 3 mutually exclusive strategic paths: Project Floodgate (Volume), Project Velvet (Premium), and Project Frictionless (Product-Led).
- **Physics:** Calibrated high-impact modifiers for AOV, Traffic, and Funnel Rates to support non-linear strategies.

## [2.2.0] - 2026-02-02 (Immersive Polish)
### Added
- **Feedback:** Integrated `sonner` for dynamic toast notifications.
- **Feedback:** Implemented state-change detection to fire context-aware alerts (Revenue, Health, Trust).
- **UI:** Added critical health visual warning (red border) to the Desktop shell.

## [2.9.0] - 2026-02-02 (Campaign Progression)
### Added
- **System:** Implemented multi-level campaign logic with `current_level` state.
- **Backend:** Added `POST /next-level` endpoint and `advance_level` logic to transition between scenarios.
- **Content:** Added Level 2 narrative placeholder (`emails_lvl2.json`) and logic to load content by level.
- **UI:** Updated `ReportCard.jsx` to show "Proceed to Next Level" upon victory, carrying forward the player's strategic archetype.

## [4.1.0] - 2026-02-08 (The Behavioral Scorecard)
### Added
- **Assessment:** Implemented the Competency Assessment Engine (BUS-01) to profile PM behavior.
- **Engine:** Created `AssessmentEngine.ts` to analyze telemetry across four pillars (Conviction, Consistency, Durability, Trade-offs).
- **UI:** Developed `CompetencyScorecard.tsx` high-fidelity overlay for post-game assessment.
- **Integration:** Hooked the assessment flow into the `ReportCard` component with a new "Behavioral Assessment" entry point.

## [4.0.0] - 2026-02-08 (The Behavioral Oracle)
### Added
- **Telemetry:** Implemented the Behavioral Telemetry Layer (DATA-01) using IndexedDB.
- **Data:** Created `telemetry.ts` service for high-fidelity event logging (Schema: `prosim_telemetry_v1`).
- **Tracking:** Added event hooks for `DECISION_START`, `DECISION_COMMIT`, `TAB_SWITCH`, `APP_OPEN`, and `HOVER_ACTION`.
- **Infrastructure:** Merged high-fidelity governance updates into PRD, Roadmap, and Backlog.

## [3.17.0] - 2026-02-07 (Earning the Tools)
### Added
- **UX:** Implemented Progressive Tab Unlock (UX-06) in MaxPanel.
- **UI:** Added Padlock icons and desaturated states for locked advanced analytics (Funnels, Retention).
- **Feedback:** Integrated `sonner` toast notifications to explain level requirements for locked features.
- **Logic:** Tied tab availability directly to `gameState.current_level`.

## [3.16.0] - 2026-02-06 (The High-Fidelity Transplant)
### Changed
- **Frontend:** Completed the WEB-15 "Surgical Transplant" of simulation logic into the new `stellar-glass-desk` shell.
- **UI:** Migrated to a high-fidelity "Dark Ethereal Glass" design system.
- **MaxPanel:** Rebuilt the dashboard using a 4-tab structure (Overview, Insights, Funnels, Retention).
- **Inbox:** Ported the split-pane email detail view into the new glass layout.
- **WarRoom:** Redesigned tactical interventions using the new high-fidelity grid system.
- **Build:** Successfully migrated build pipeline to support the new UI architecture.

## [3.15.0] - 2026-02-06 (The Reality Check)
### Added
- **UX:** Implemented the Prediction Feedback Loop (UX-08).
- **UI:** Created `PredictionResultModal.tsx` for immediate strategic post-mortems.
- **Backend:** Added dynamic qualitative feedback messages to prediction evaluations.
- **Content:** Specialized feedback for the Floodgate strategy to explain the KYC bottleneck.

## [3.14.0] - 2026-02-06 (The Embedded Textbook)
### Added
- **Pedagogy:** Implemented the Wiki Knowledge Engine (WEB-25) for contextual PM training.
- **Content:** Created `data/content/wiki.json` with 8 core term definitions and trade-offs.
- **UI:** Added `WikiTooltip.tsx` using Radix HoverCard for high-fidelity interactive keywords.
- **Parser:** Developed `textParser.tsx` utility to dynamically inject wiki links into any narrative text.
- **API:** Added `GET /wiki` endpoint to serve knowledge graph data.

## [3.13.0] - 2026-02-06 (The Syllabus)
### Added
- **Governance:** Created `docs/CURRICULUM.md` mapping all game events to learning objectives.
- **Audit:** Identified gaps in "Just-in-Time Knowledge" and "Adaptive Friction" implementations.
- **Strategy:** Defined Level 3 (Scale) pedagogical pillars.

## [3.12.0] - 2026-02-06 (Story Beats Math)
### Added
- **Engine:** Implemented the Narrative Physics Override system (SYS-12).
- **Physics:** Added `physics_overrides` dictionary to `GameState` for dynamic math constraints.
- **Logic:** Formalized the "Vanity Trap" for Floodgate players via a persistent conversion cap.
- **Upgrades:** Integrated "Fix KYC" upgrade to dynamically remove conversion caps.

## [3.11.1] - 2026-02-06 (State & Dashboard Restoration)
### Fixed
- **Backend:** Restored `GameState` schema after accidental field deletion; resolved Pydantic validator crash.
- **Backend:** Updated `LogEntry` to include full snapshots of `traffic`, `conversion_rate`, and `average_order_value`.
- **UI:** Fixed `MaxPanel` data construction to correctly reference top-level log snapshots, restoring historical and live chart rendering.

## [3.11.0] - 2026-02-06 (Thinking Fast and Slow)
### Added
- **Mechanic:** Implemented the "Prediction Loop" (Hypothesis Lock) for strategic decisions.
- **UI:** Created `PredictionModal.tsx` to intercept high-stakes turns.
- **Physics:** Added `product_sense_score` to track qualitative forecasting accuracy.
- **TopBar:** Integrated Brain icon and real-time Product Sense telemetry.
- **Feedback:** Contextual toast notifications for prediction accuracy and score gains.

## [3.10.0] - 2026-02-06 (The Churn Crisis)
### Added
- **Campaign:** Implemented Level 2 Narrative Arc ("The Leaky Bucket").
- **Content:** Added 3 major retention-focused scenarios (Outage, Support Crisis, Feature Freeze).
- **Physics:** Integrated "Band-aid" vs "Root Cause" decision branching to the Churn engine.
- **Backend:** Expanded `phase_1.json` with technical debt and stability actions.

## [3.9.2] - 2026-02-06 (Retention Engine)
### Added
- **Physics:** Implemented dynamic User Churn logic based on Trust and Health (SYS-11).
- **Physics:** Updated Revenue model to include Recurring Revenue from active user base.
- **UI:** Added "Active Users" metric card to MaxPanel with full interpolation support.
- **UI:** Added detailed Revenue tooltips (Internal split: Recurring vs. Transactional).

## [3.9.1] - 2026-02-06 (Tutorial Restoration)
### Fixed
- **UI:** Uncommented `TutorialOverlay` in `Index.tsx` to restore the onboarding tour for new sessions.

## [3.9.0] - 2026-02-04 (Seamless Progress Logic)
### Added
- **UX:** Implemented sequential chart animation. MaxPanel now "replays" missed turns one by one (5s per turn) instead of jumping to the latest state.
- **Persistence:** Added `sessionStorage` tracking for `visualizedTurn` to ensure progress is remembered across app switches.
- **Visualization:** Dynamic interpolation loop now handles multi-turn catch-up scenarios smoothly.

## [3.8.0] - 2026-02-04 (MaxPanel Metric Explorer)
### Added
- **UI:** Transformed static KPI cards into interactive controllers for the main AreaChart.
- **Visualization:** Implemented dynamic gradients (Emerald, Blue, Purple, Pink) that transition based on the active metric.
- **Data:** Normalized historical and live datasets to support switching between Revenue, Traffic, Conversion, and AOV views.

## [3.7.0] - 2026-02-04 (Historical Data Backfill)
### Added
- **Data:** Injected 12-month historical backstory for all 3 strategic archetypes.
- **UI:** Updated MaxPanel to merge "Past" (Static) and "Present" (Live) data into a single seamless chart.
- **Visualization:** Added visual delimiters to separate pre-game history from active simulation turns.

## [3.6.0] - 2026-02-04 (Production Build Integration)
### Added
- **DevOps:** Configured FastAPI to serve React static assets (`client/dist`).
- **Routing:** Implemented a SPA catch-all route to support client-side routing.
- **Architecture:** Merged Frontend and Backend into a single deployable unit running on Port 8000.

## [3.5.0] - 2026-02-04 (Credential Export)
### Added
- **Feature:** Implemented client-side image generation via `html2canvas`.
- **UI:** Added "Export Record" button to the Report Card interface.
- **Artifact:** Users can now download high-resolution PNGs of their simulation performance, preserving their "Notice of Termination" or "Victory" status.

## [3.4.0] - 2026-02-04 (Glass Onboarding)
### Added
- **UI:** Migrated `TutorialOverlay.tsx` with dynamic spotlight cutout effect.
- **UX:** Implemented glassmorphism-themed onboarding steps targeting the new Dock and TopBar regions.
- **Integration:** Wired tutorial completion to the backend persistence layer.

## [3.3.0] - 2026-02-04 (Quarterly Strategic Planning)
### Added
- **UI:** Migrated `QuarterlyReview.tsx` high-fidelity strategic planning interface.
- **System:** Integrated QBR state into `App.tsx` and `Index.tsx` lifecycle.
- **Integration:** Wired strategic commitment buttons to `api.commitStrategy` backend endpoint.

## [3.2.0] - 2026-02-04 (Lifecycle & Meta-Game)
### Added
- **UI:** Migrated `StartScreen.tsx` with mission briefing and initialization logic.
- **UI:** Implemented `ReportCard.tsx` high-res overlay for performance post-mortems.
- **UI:** Refactored `Settings.tsx` with voluntary resignation flow.
- **System:** Wired `gameStatus` lifecycle ("IDLE" -> "ACTIVE" -> "GAME_OVER") in `App.tsx`.

## [3.1.0] - 2026-02-04 (Full Ecosystem Integration)
### Added
- **UI:** Implemented `Chat.tsx`, `WarRoom.tsx`, and `Marketplace.tsx` with high-fidelity glass design.
- **Integration:** Wired all 5 core applications to the FastAPI backend.
- **System:** Synchronized global state across all windows, including tactical interventions and chats.
- **Dock:** Updated OS Dock with new icons for unified navigation.

## [3.2.0] - 2026-02-04 (Decision-Linked Reference Lines and Deferred Interpolation)
### Added
- **UX:** Implemented "Deferred Animation" logic. Charts now animate from the *previous* turn's value to the current value upon panel open, replaying the impact of the latest decision.
- **Visualization:** Added persistent `ReferenceLine` markers for every historical decision (T1, T2, etc.), creating a cumulative timeline of actions.
- **Hook:** Enhanced `useProgressiveValue` to support explicit `initialValue` for controlled animation start points.

## [3.1.0] - 2026-02-04 (Progressive Data Visualization)
### Added
- **UX:** Implemented `useProgressiveValue` hook for smooth 15s data interpolation.
- **UI:** MaxPanel charts and KPI cards now animate value changes over time, decoupling simulation turns from visual feedback.
- **TopBar:** Added real-time "Iron Quadrant" (Health, Morale, Trust) metrics to the OS status bar with progressive counting.

## [3.0.2] - 2026-02-04 (Latency Engine)
### Added
- **UX:** Implemented artificial processing delay (1.5s) to turn execution.
- **UI:** Added glassmorphism overlay with loading spinner during order transmission.
- **Feedback:** Integrated toast notifications for "Transmitting" and "Confirmed" states.

## [3.0.0] - 2026-02-04 (The Steller Glass Update)
### Changed
- **Frontend:** Completely replaced legacy `client/` with `stellar-glass-desk-main/` (Vite + React + TSX).
- **UI/UX:** Implemented the high-fidelity "Glass" OS aesthetic with framer-motion and Tailwind CSS.
- **Integration:** Bridged the React/TSX frontend with the FastAPI/Python backend via `api.ts` service layer.
- **Apps:** Refactored `MaxPanel` and `Inbox` to consume real-time backend state and telemetry.

## [2.14.0] - 2026-02-04 (Build System Optimization)
### Fixed
- **Build:** Resolved Tailwind/PostCSS dependency conflict by migrating to `@tailwindcss/postcss`.
- **Styles:** Updated `index.css` to Tailwind v4 syntax using `@import "tailwindcss";`.
- **Config:** Standardized `postcss.config.js` for standalone plugin usage.

## [2.13.0] - 2026-02-04 (Interactive Onboarding)
### Added
- **UI:** Created `Tutorial.jsx` with a guided spotlight tour for new users.
- **Backend:** Added `tutorial_complete` flag to `GameState` and `POST /tutorial-complete` endpoint.
- **UX:** Implemented glassmorphism spotlight effect to highlight critical UI regions (Taskbar, Icons).

## [2.12.0] - 2026-02-02 (System Settings & User Agency)
### Added
- **UI:** Created `Settings.jsx` application for profile management and system controls.
- **Backend:** Added `player_name` and `job_title` to `GameState` for identity tracking.
- **Backend:** Implemented `POST /resign` endpoint to allow manual simulation termination.
- **UX:** Integrated a "Resign" flow that provides a narrative closure to voluntary termination.

## [2.11.0] - 2026-02-02 (Atomic Design System)
### Added
- **UI:** Established `docs/design/TOKENS.md` as the visual constitution.
- **UI:** Integrated Tailwind CSS for unified utility-based styling.
- **UI:** Created a generic `Window.jsx` wrapper to standardize the OS window aesthetic.
- **Refactor:** Migrated `Inbox`, `Chat`, `MaxPanel`, `WarRoom`, `Desktop`, and `Taskbar` to the new token system.
- **UX:** Implemented glassmorphism, responsive borders, and consistent typography across all apps.

## [2.10.0] - 2026-02-02 (Adaptive Narrative Engine)
### Added
- **Engine:** Extended trigger system to support `required_focus` validation.
- **Content:** Designed strategy-specific narrative paths for Quarter 2 (Blitzscale, Fortify, Monetize).
- **QA:** Added integration tests for conditional content visibility (`test_adaptive_content.py`).
- **Refactor:** Updated `ContentManager` to handle level-specific JSON merging.

## [2.9.0] - 2026-02-02 (Quarterly Strategic Planning)
### Added
- **System:** Implemented the "Quarterly Business Review" (QBR) strategic checkpoint between levels.
- **UI:** Created `QuarterlyReview.jsx` component for strategy selection (Blitzscale, Fortify, Monetize).
- **Physics:** Implemented persistent `physics_modifiers` that scale simulation math across quarters.
- **Backend:** Added `POST /commit-strategy` endpoint to apply strategic focuses and advance the campaign.

## [2.8.0] - 2026-02-02 (The Intervention Matrix)
### Added
- **UI:** Created `WarRoom.jsx` grid interface for categorized PM interventions (Engineering, Product, Comms).
- **Backend:** Implemented `execute_intervention` logic with hidden risk matching and efficacy calculation.
- **Content:** Designed `interventions.json` with 12 tactical actions and their respective costs/rewards.
- **UX:** Integrated efficacy-based toast notifications to provide immediate feedback on tactical maneuvers.

## [2.7.0] - 2026-02-02 (Leading Indicators & Time-Series)
### Added
- **Data:** Created `series_leak.json` with 24 hourly data points for Traffic and Latency.
- **Engine:** Implemented `load_time_series` in `ContentManager` to support sub-turn resolution.
- **API:** Updated `/analytics` to serve time-series data for active scenarios.
- **UI:** Added "Real-Time" tab to MaxPanel with dual-axis line charts for correlation analysis.

## [2.5.0] - 2026-02-02 (Immortal Sessions)
### Added
- **Storage:** Implemented disk-based session persistence in `data/sessions/`.
- **API:** Updated `get_controller` to support "Cache Aside" loading (RAM -> Disk).
- **QA:** Added integration tests for disk-rehydration (`test_persistence.py`).

## [2.4.0] - 2026-02-02 (Benchmarking & Records)
### Added
- **System:** Implemented a Benchmarking system against an S-Rank $150k Revenue target.
- **System:** Added `localStorage` persistence for Personal Best tracking.
- **UI:** Upgraded `ReportCard.jsx` with a visual performance progress bar and efficiency metrics (Revenue per Turn).
- **UI:** Added "NEW PERSONAL BEST" celebration logic.

## [2.3.0] - 2026-02-02 (Dynamic Pacing Engine)
### Added
- **Engine:** Implemented `_process_triggers` logic to filter narrative content based on game state (Turn, Revenue, Health).
- **Content:** Added `trigger` metadata to `emails.json` for sequential and conditional delivery.
- **QA:** Created integration tests for pacing and conditional triggers (`test_pacing.py`).
- **Logic:** Refactored `SimulationController` to handle story progression dynamically.

## [2.1.0] - 2026-02-02 (Unified State Management)
### Added
- **Architecture:** Hoisted all simulation state (Physics, Inbox, Chats, Analytics) to `App.jsx`.
- **Sync:** Implemented `refreshGame()` with `Promise.all` for atomic UI updates.
- **Components:** Refactored `Inbox`, `Chat`, and `MaxPanel` to be stateless presentation components receiving data via props.

## [2.0.0] - 2026-02-02 (Dataset-Driven Analytics)
### Added
- **Architecture:** Implemented "Illusion of Math" system using pre-calculated strategy datasets.
- **Backend:** Added `strategy_archetype` to state and `GET /analytics` endpoint.
- **Data:** Created strategy-specific analytics JSONs (Floodgate, Velvet, Default).
- **UI:** Rebuilt MaxPanel with 4 tabs (Overview, Insights, Funnels, Retention) using dynamic datasets.

## [1.8.0] - 2026-02-02 (The 12-Turn Campaign)
### Added
- **Content:** Designed a cohesive 12-turn narrative arc covering Onboarding, Strategic Fork, Alignment Tests, and Scale Phase.
- **Narrative:** Injected 12 sequential email scenarios with branching strategic implications.
- **Physics:** Mapped 24 unique action outcomes to support the 12-turn journey.
- **QA:** Verified state stability over an extended session length.

## [1.7.0] - 2026-02-02 (Funnel Optimization Layer)
### Added
- **Engine:** Implemented Dynamic Funnel Physics (`cart_rate`, `checkout_rate`, `payment_rate`).
- **Logic:** Refactored Revenue calculation to derive from sequential funnel stages.
- **Content:** Injected high-quality PM scenarios ("Login Wall", "Payment Options") targeting specific funnel bottlenecks.
- **UI:** Updated MaxPanel to visualize the full 4-stage conversion funnel.

## [1.4.0] - 2026-02-02 (Unified Development Environment)
### Added
- **Orchestration:** Implemented `npm start` using `concurrently` to launch both Backend and Frontend in a single terminal.
- **Automation:** Created a root `package.json` with unified lifecycle scripts.
- **Documentation:** Created `README.md` with simplified startup instructions.

## [1.3.0] - 2026-02-02 (The Magic Circle)
### Added
- **UI:** Created `StartScreen.jsx` acting as a mission briefing and login portal.
- **Logic:** Deferred API session initialization until the player explicitly clicks "Login".
- **UX:** Improved error handling for backend connection failures at startup.

## [1.2.0] - 2026-02-02 (The After-Action Report)
### Added
- **UI:** Created `ReportCard.jsx` to replace the simple end-game modal.
- **UI:** Implemented "Revenue Growth" area chart and "System Stability" line chart for session post-mortems.
- **Logic:** Implemented a performance grading system (A-F) based on revenue and health.
- **Backend:** Updated `LogEntry` to store absolute metric snapshots for historical visualization.

## [1.1.0] - 2026-02-02 (Level 1: The Launch Crunch)
### Added
- **Content:** Designed and injected Campaign Level 1 ("Launch Day").
- **Narrative:** Created 4 sequential high-stakes email events and dev team chatter.
- **Physics:** Balanced metrics for aggressive trade-offs (Traffic vs. Stability vs. Morale).
- **QA:** Updated integration tests to validate Level 1 narrative delivery.

## [1.0.0] - 2026-02-02 (Project proSIM V1.0)
### Added
- **UI:** Created `GameOver.jsx` component for victory and failure states.
- **UI:** Implemented full-screen overlay to block interaction upon termination.
- **Integration:** Automated end-game screen triggers based on backend state.
- **Documentation:** Established V1.0 milestone in Changelog and Journal.

## [0.9.8] - 2026-02-02 (The Win/Loss Reaper)
### Added
- **Engine:** Definitive `VICTORY` and `GAME_OVER` states.
- **Logic:** Implemented Win condition ($100k Revenue) and Fail conditions (Health/Trust/Morale exhaustion).
- **Narrative:** Added "SYSTEM" messages delivered to the Inbox upon termination.
- **QA:** Created unit tests for state transitions (`test_game_over.py`).

## [0.9.5] - 2026-02-02 (Team Chat Application)
### Added
- **UI:** Created `Chat.jsx` Slack-style interface for team communication.
- **UI:** Implemented message bubbles and interactive response buttons.
- **Integration:** Connected Chat responses to the Physics Engine via `api.makeDecision`.

## [0.9.0] - 2026-02-02 (MaxPanel Analytics)
### Added
- **UI:** Created `MaxPanel.jsx` analytics dashboard using `recharts`.
- **UI:** Implemented KPI summary cards for Ecommerce metrics.
- **UI:** Added visual "Conversion Funnel" bar chart.
- **Integration:** Dynamic data binding to the `gameState` physics engine.

## [0.8.0] - 2026-02-02 (The Interactive Inbox)
### Added
- **UI:** Created `Inbox.jsx` with split-pane layout for reading and acting on emails.
- **UI:** Added draggable-style window simulation (static positioning) and Desktop Icon toggle.
- **Integration:** Implemented `onTurnComplete` callback to propagate state changes from apps back to the global Taskbar.
- **Logic:** Connected "Hotfix Checkout" and other narrative options to the Physics Engine.

## [0.7.0] - 2026-02-02 (Narrative API)
### Added
- **API:** Added `GET /inbox` endpoint to serve emails.
- **API:** Added `GET /chats` endpoint to serve chat messages.
- **Controller:** Integrated `ContentManager` to persist narrative state per session.

## [0.6.5] - 2026-02-02 (Pytest Infrastructure)
### Added
- **QA:** Added `pytest`, `pytest-cov`, `httpx` dependencies.
- **QA:** Configured `pytest.ini` and `tests/conftest.py` with global fixtures.
- **QA:** Added integration tests for health check and game creation.
- **Refactor:** Updated legacy unit tests to match new state schema.

## [0.6.0] - 2026-02-02 (Ecommerce Physics)
### Added
- **Engine:** Added `traffic`, `conversion_rate`, `average_order_value`, `revenue` to `GameState`.
- **Logic:** `SimulationController` now calculates revenue dynamically (`T * CR * AOV`).
- **Logic:** `execute_turn` now accepts impacts on ecommerce metrics.

## [0.5.0] - 2026-02-02 (Ecommerce Narrative Layer)
### Added
- **Content:** Added `data/content/emails.json` with Crisis, Growth, and Noise scenarios.
- **Content:** Added `data/content/chats.json` with Tech Debt scenarios.
- **Engine:** Created `ContentManager` to load and serve narrative JSONs.

## [0.4.0] - 2026-02-02 (The First Handshake)
### Added
- **Integration:** Connected React Frontend to FastAPI Backend via Axios.
- **Service:** Created `api.js` wrapper for centralized HTTP requests.
- **UI:** Taskbar now displays live Health, Morale, Trust, and Score from the backend.
- **Architecture:** Hoisted state to `App.jsx` to manage `sessionId` and `gameState`.

## [0.3.0] - 2026-02-02 (The Visual Shell)
### Added
- **Frontend:** Initialized React/Vite project in `client/`.
- **UI:** Added "Desktop" component with Taskbar layout.
- **Backend:** Added Session Management (In-Memory UUIDs).
- **Backend:** Configured CORS to allow requests from `localhost:5173`.

### Changed
- Refactored `SimulationController` to be instance-based per session.
- Moved strict verify scripts to `fastapi.testclient` for robustness.

## [0.2.0] - 2026-02-02 (The API Bridge)
### Added
- **Backend:** FastAPI server integration in `server/api.py`.
- **Logic:** Iron Quadrant logic (Morale, Trust, Health, Score).
- **Persistence:** Structured telemetry (JSON history logs).

## [0.1.0] - 2026-02-02 (Foundation)
### Added
- **Engine:** Pydantic-based GameState and deterministic controller.
- **CLI:** Basic command parser and state display.