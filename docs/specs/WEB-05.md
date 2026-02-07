# WEB-05: Team Chat Application

## Requirements
- **Goal:** Create an interactive "Team Chat" (Slack-style) window to manage team relationships and technical debt.
- **Components:**
  - `Chat.jsx`: Main container with sidebar and message area.
  - `MessageStream`: Chronological list of messages from the team.
  - `ChatOptions`: Inline response buttons for actionable messages.
- **Data Source:** `GET /chats` via `api.js`.
- **Interaction:**
  - Inline buttons trigger `POST /turn` via `api.makeDecision()`.
  - Upon decision, trigger `onTurnComplete()` to refresh global state.
- **UI:**
  - Sidebar with channel list (e.g., `#general`, `#dev-team`).
  - Message bubbles with sender names.
  - Distinct aesthetic from the "Official" Inbox.

## DoD
- "Chat" icon on Desktop toggles the window.
- Chat displays the "Pixel Performance" message from `Dave (Lead Dev)`.
- Clicking a response update the Taskbar Morale metric.
