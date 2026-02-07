# LOG-03: Benchmarking & High Scores

## Requirements
- **Goal:** Drive replayability by comparing user performance against an "ideal" benchmark and tracking personal records.
- **Benchmarks:**
  - **S-Rank Target:** $150,000 Revenue.
  - **Efficiency Metric:** `Final Revenue / Total Turns`.
- **Persistence:**
  - Use Browser `localStorage` to save the user's `personal_best` revenue.
- **UI Integration (`ReportCard.jsx`):**
  - Display a visual progress bar comparing current revenue to the $150k target.
  - Celebrate "NEW RECORD!" if the current session exceeds the personal best.
  - Show the "Efficiency" score (Revenue per Turn).

## DoD
- End-game screen displays "Target: $150,000".
- High score is persisted across page refreshes.
- Efficiency calculation is accurate.
