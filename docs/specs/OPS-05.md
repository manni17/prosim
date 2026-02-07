# OPS-05: Single-Port Production Build

## Goal
Configure FastAPI to serve the built React frontend, allowing the entire application to run from a single process/port (8000).

## Architecture
- **Frontend**: Built to static artifacts (`html`, `js`, `css`) in `client/dist`.
- **Backend**: FastAPI acts as both the API server and the Static File server.
- **Routing**:
    1.  **API Routes**: `/new-game`, `/state`, etc. (Priority 1).
    2.  **Static Assets**: `/assets` maps to `client/dist/assets`.
    3.  **SPA Catch-All**: Any other route returns `client/dist/index.html`, enabling client-side routing (React Router) to handle the URL.

## Benefits
- **Deployment**: Simplifies deployment to a single container/service (e.g., Render, Railway).
- **Simplicity**: Users only need to run one command (`uvicorn ...`) to start the full app.
- **CORS**: Eliminates Cross-Origin issues since origin is same.
