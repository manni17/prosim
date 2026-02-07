# DATA-02: Ecommerce Narrative Injection

## Requirements
- **Goal:** Define rich narrative content for the "Steller" B2B Gift Card Platform scenario, focusing on Ecommerce Metrics.
- **Focus:** Scenarios must impact Traffic, Conversion, Revenue, as well as the existing Iron Quadrant (Health, Trust, Morale).
- **Data Stores:**
  - `data/content/emails.json`: Contains "Inbox" style scenarios (Crisis, Growth opportunities, Noise).
  - `data/content/chats.json`: Contains "Team Chat" style scenarios (Dev constraints, Team sentiment).
- **Schema:**
  - `id`: Unique identifier string.
  - `type`: Category (crisis, noise, politics, growth).
  - `sender`: Name/Role of the sender.
  - `subject`: Email subject line (or generic 'New Message' for chat).
  - `body`: The narrative text.
  - `options`: Array of choices, each containing:
    - `label`: Text displayed to user.
    - `action_id`: ID used by the engine to calculate physics impacts.
    - `impact_hint`: (Optional) Descriptive hint about potential impact.

## DoD
- JSON files created with valid structure.
- Content includes specific Ecommerce scenarios (Cart Abandonment, Ad Spend, Analytics performance).
- Content loader (`ContentManager`) implemented and verified.
