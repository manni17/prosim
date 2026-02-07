# WEB-10: MaxPanel 3.0 (Mixpanel Tabs)

## Requirements
- **Goal:** Upgrade the analytics dashboard to a professional multi-tab interface.
- **Architecture:** 
  - Implement a Tab-based navigation system.
- **Tabs:**
  1. **Overview:** KPI Cards + Revenue Chart.
  2. **Insights:** Traffic Sources (Pie Chart) + Device Breakdown.
  3. **Funnels:** Step-by-step conversion visualization.
  4. **Flows:** Path analysis after errors.
  5. **Retention:** Placeholder cohort analysis.
  6. **Dictionary:** Metadata table of defined events.
- **Data:** Digest the `events` stream from the backend.

## DoD
- UI allows switching between all 6 tabs.
- Insights tab displays a Pie Chart of sources.
- Dictionary tab lists the events defined in `DATA-07`.
