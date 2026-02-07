# WEB-04: MaxPanel Analytics Dashboard

## Requirements
- **Goal:** Provide a visual dashboard for players to monitor Ecommerce KPIs (Traffic, Conversion, Revenue).
- **Tech Stack:** `recharts` for data visualization.
- **Features:**
  - **KPI Cards:** Summary tiles for Traffic, Conversion Rate (%), Average Order Value ($), and Daily Revenue ($).
  - **Funnel Visualization:** A Bar Chart comparing Total Visitors vs. Successful Orders (Traffic * ConvRate).
- **Integration:**
  - The dashboard must receive `gameState` as a prop and update in real-time as turns are executed in other apps (like Inbox).
- **UI:**
  - Standard "Window" style consistent with `Inbox.jsx`.
  - Dark-themed charts.

## DoD
- "Analytics" icon on Desktop toggles the dashboard.
- KPIs match the values from the backend exactly.
- Bar chart correctly displays the calculated "Orders" volume.
