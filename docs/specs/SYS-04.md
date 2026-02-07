# SYS-04: Ecommerce Physics Upgrade

## Requirements
- **Goal:** Expand the simulation engine to track and calculate real Ecommerce financial metrics, moving beyond abstract "Score".
- **New State Attributes (`GameState`):**
  - `traffic` (int): Daily site visitors. Default: 10,000.
  - `conversion_rate` (float): Percentage of visitors who buy. Default: 0.02 (2%).
  - `average_order_value` (float): Average spend per transaction. Default: 50.0.
  - `revenue` (float): Calculated Metric. Formula: `traffic * conversion_rate * average_order_value`.
- **Logic Updates (`SimulationController`):**
  - The `execute_turn` method must now parse impacts on `traffic`, `conversion_rate`, and `average_order_value`.
  - A new `_recalculate_revenue()` method must be called at the end of every turn to update the `revenue` field based on the new state of the variables.

## DoD
- Pydantic model accepts and validates the new fields.
- Revenue is auto-calculated, never manually set by an action.
- Verification script proves that increasing Traffic automatically increases Revenue.
