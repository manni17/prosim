# API-03: Narrative Delivery Endpoints

## Requirements
- **Goal:** Expose the loaded narrative content (emails, chats) to the client via REST endpoints, enabling the frontend to render the "Inbox" and "Chat" apps.
- **Endpoints:**
  - `GET /inbox`: Returns the list of active email objects.
  - `GET /chats`: Returns the list of active chat message objects.
- **Headers:**
  - Both endpoints require `X-Session-ID` to retrieve the correct simulation session.
- **Logic:**
  - The `SimulationController` must integrate `ContentManager` to load and hold this content state.
  - Endpoints delegate to the session's controller to fetch the data.
  - (Future Scope: Filtering "active" vs "archived" messages. For now, return all loaded content).

## DoD
- Test client can retrieve the "Cart Abandonment" email via `GET /inbox`.
- Response follows the JSON schema defined in `DATA-02`.
