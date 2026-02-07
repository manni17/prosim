# DATA-10: Historical Performance Enrichment

## Goal
Provide "Backstory Data" (Pre-Game History) for MaxPanel to give players context about the company's trajectory before their tenure begins.

## Data Schema
Update `analytics_*.json` files to include a new key: `history`.
- **Format:** List of 12 objects representing the previous fiscal year.
- **Fields:**
  - `month`: string (e.g., "Jan")
  - `revenue`: float
  - `traffic`: int
  - `churn`: float

## Integration Logic
- **Frontend (MaxPanel):** The chart data source should be a concatenation of `analyticsData.history` (static backstory) and `gameState.history` (live simulation).
- **Visual Distinction:** The chart should visually differentiate between "Historical" (Past) and "Simulation" (Present) data, possibly using a reference line or color gradient.

## Backstory Archetypes
1.  **Default:** Stable, flat growth. A steady ship needing direction.
2.  **Floodgate:** High traffic spike, flat revenue. The "Vanity Metric" trap.
3.  **Velvet:** Declining traffic, rising revenue. The niche premium pivot.
