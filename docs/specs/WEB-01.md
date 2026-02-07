# WEB-01: React Desktop Shell

## Requirements
- **Goal:** Initialize the frontend application acting as the "Desktop Simulator".
- **Tech Stack:** React 18+, Vite.
- **Components:**
  - `Desktop`: Main container, handles the background wallpaper and window management.
  - `Taskbar`: Fixed footer containing app launch icons (Email, Chat, Terminal).
- **State Management:**
  - `activeApp`: String or Enum tracking the currently focused/open window.
- **API Integration:**
  - Must be configured to communicate with `http://localhost:8000`.
- **Styling:**
  - CSS Modules or standard CSS.
  - Dark mode aesthetic ("Cyber/Professional").

## DoD
- Frontend project initialized in `/client`.
- Application runs on `http://localhost:5173`.
- Taskbar is visible at the bottom of the screen.
- CORS enabled on backend.
