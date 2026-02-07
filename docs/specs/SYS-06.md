# SYS-06: Dynamic Funnel Physics

## Requirements
- **Goal:** Replace the monolithic conversion rate with a multi-step dynamic funnel to allow for specific stage optimization.
- **Funnel Stages:**
  - `cart_rate` (float): Visitors -> Cart. Default: 0.25.
  - `checkout_rate` (float): Cart -> Checkout. Default: 0.40.
  - `payment_rate` (float): Checkout -> Purchase. Default: 0.80.
- **Formula:**
  - `Visitors` = base_traffic + traffic_delta
  - `Carts` = Visitors * cart_rate
  - `Checkouts` = Carts * checkout_rate
  - `Purchases` = Checkouts * payment_rate
  - `Revenue` = Purchases * AOV
- **Logic:**
  - `SimulationController` must handle impacts on these individual rates.
  - Revenue must be recalculated based on the cumulative product of these rates.

## DoD
- `GameState` contains the 3 new rate variables.
- Revenue changes logically when a single funnel stage is optimized.
- Verification script confirms the multi-step calculation.
