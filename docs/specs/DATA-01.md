# DATA-01: Behavioral Telemetry Layer (IndexedDB)

## Requirements
- **Goal:** Capture high-fidelity behavioral data to profile user competence (Conviction, Consistency, Resilience).
- **Storage:** Use Browser **IndexedDB** instead of `localStorage` to handle high-frequency events without blocking the main thread.
- **Database Schema:**
  - **DB Name:** `prosim_telemetry_v1`
  - **Store:** `events`
  - **Fields:**
    - `id` (Auto-increment)
    - `sessionId` (String)
    - `type` (String: 'DECISION_START', 'DECISION_COMMIT', 'TAB_SWITCH', 'HOVER_ACTION')
    - `timestamp` (Int64)
    - `turn` (Int)
    - `metadata` (JSON: { actionId, duration, prevValue })

## Core Mechanics
1. **Decision Timer:** 
   - Log `DECISION_START` when an email is selected.
   - Log `DECISION_COMMIT` when an option is confirmed.
   - Track `duration_ms` in `DECISION_COMMIT` metadata.
2. **Hesitation Tracking:**
   - Log `HOVER_ACTION` to track total hovers per turn.
   - Calculate `hover_diversity` (unique options viewed).
   - Detect `is_reversal` (changing mind after hovering over another option).
3. **Panic Check Detection:**
   - Tag `TAB_SWITCH` events as `PANIC_CHECK` if they occur while a decision is pending.

## Implementation Plan
1. Create `client/src/services/telemetry.ts` using the native `IDB` API.
2. Integrate a `TelemetryProvider` in `App.tsx`.
3. Hook into `Inbox.tsx` and `Dock.tsx` to fire events.

## DoD
- Database initializes on app load.
- Clicking an email generates a `DECISION_START` entry in IndexedDB.
- Executing an action generates a `DECISION_COMMIT` entry with a valid `sessionId`.