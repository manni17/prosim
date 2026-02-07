# DATA-09: Time-Series Data Engine

## Requirements
- **Goal:** Simulate high-resolution monitoring by providing "Hourly" data points within a single turn cycle.
- **Mechanic:** Sub-Turn Resolution. Each turn can be expanded into 24 data points representing a single day.
- **Scenario ("The Memory Leak"):**
  - **Hours 1-12:** System is healthy. Traffic is stable, latency is low.
  - **Hours 13-18:** **The Warning.** Latency begins to climb (Leading Indicator) while traffic remains stable.
  - **Hours 19-24:** **The Failure.** Latency spikes, and traffic subsequently crashes due to timeouts and user frustration.
- **Data Engineering:**
  - Create `data/analytics/series_leak.json` containing 24 points for `traffic`, `latency`, and `revenue`.
  - Update `ContentManager` to load this series data.
- **UI Integration (`MaxPanel.jsx`):**
  - Add a **"Real-Time"** tab.
  - Render a dual-axis line chart (Traffic vs. Latency) to teach proactive monitoring.

## DoD
- /analytics response includes a `time_series` object.
- MaxPanel displays the hourly chart.
- The "Leading Indicator" (latency spike before traffic crash) is visually obvious.
