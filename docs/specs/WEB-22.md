# WEB-22: MaxPanel Metric Explorer

## Goal
Transform the static KPI cards in MaxPanel into interactive controllers that drive the main visualization.

## UX Pattern: "The Explorer"
Instead of showing 4 small sparklines or one fixed "Revenue" chart, we use the "Explorer Pattern":
1.  **Select:** User clicks a KPI Card (Revenue, Traffic, Conversion, AOV).
2.  **Focus:** The card highlights to indicate active state.
3.  **Reveal:** The large AreaChart updates to show the historical trend for the *selected* metric.

## Technical Requirements

### State Management
- `activeMetric`: string (default: 'revenue').
- Supported keys: `revenue`, `traffic`, `conversion_rate`, `average_order_value`.

### Data Normalization
The chart data source must be a merged array of `history` (Backstory) and `live` (GameState).
**Critical:** Historical data often only has `revenue` and `traffic`. We must backfill missing keys for `conversion_rate` and `aov` to prevent chart errors.
- `conversion_rate` fallback: `revenue / (traffic * 50)` (Approximate).
- `aov` fallback: `50` (Default).

### Visuals
- **Gradients:**
  - Revenue: Emerald/Green
  - Traffic: Blue
  - Conversion: Purple
  - AOV: Pink
- **Y-Axis:** Must use `domain={['auto', 'auto']}` to handle the massive scale difference between Traffic (50,000) and Conversion (0.02).
