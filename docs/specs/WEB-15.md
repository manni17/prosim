# WEB-15: Frontend Migration & API Integration

## Requirements
- **Goal:** Replace the legacy React frontend with the high-fidelity "Steller Glass" UI and connect it to the existing FastAPI backend.
- **Migration Path:** 
  - Legacy: `client/`
  - Target: `stellar-glass-desk-main/`
- **Key Deliverables:**
  - `src/services/api.ts`: TypeScript port of the legacy API service.
  - `src/pages/Index.tsx`: Refactor to manage live state instead of mock data.
  - App Refactors: `MaxPanel.tsx` and `Inbox.tsx` updated to receive and display live backend data.
- **Infrastructure:**
  - Install `axios`.
  - Configure Vite proxy or CORS for communication with `localhost:8000`.

## DoD
- The Glass UI loads and displays real data from the Python engine (Health, Revenue, Emails).
- Actions taken in the Inbox (Decision Buttons) correctly update the global state.
- All frontend code is fully typed using TypeScript interfaces.
