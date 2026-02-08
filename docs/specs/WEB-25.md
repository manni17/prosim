# WEB-25: Wiki Knowledge Engine

## Requirements
- **Goal:** Implement "Just-in-Time" learning by embedding interactive tooltips for complex PM terms directly into the narrative and UI.
- **Data Source:** `data/content/wiki.json` containing definitions, formulas, and trade-off descriptions.
- **Parsing Logic:** 
  - Text strings containing `[[term_id]]` must be dynamically converted into interactive components.
  - Case-insensitive matching preferred.
- **UI Architecture:**
  - `WikiTooltip.tsx`: A glassmorphism popover that triggers on hover.
  - `textParser.tsx`: A utility to transform raw strings into JSX arrays.

## Data Schema
```json
{
  "churn": {
    "title": "Churn Rate",
    "definition": "The percentage of customers who stop using your product during a specific timeframe.",
    "formula": "(Lost Customers / Total Customers) * 100",
    "trade_off": "High growth is offset by high churn; focus on retention to build a 'compound interest' engine."
  }
}
```

## DoD
- Keywords in the Inbox are highlighted (Blue/Primary color).
- Hovering shows a high-fidelity glass popover.
- Definitions are consistent across the entire platform.
