# DATA-05: PM-Quality Scenarios

## Requirements
- **Goal:** Introduce high-fidelity narrative scenarios that force trade-offs at specific steps of the Ecommerce funnel.
- **Scenarios:**
  - **The Login Wall:** High drop-off at checkout. Choice: Enable Guest Checkout (+Checkout Rate, -Trust/Security) vs. Forced Login (+LTV/Data Quality).
  - **Payment Options:** Transactions failing. Choice: Add Apple Pay (+Payment Rate, +Tech Debt) vs. Status Quo.
  - **Junk Traffic:** High volume surge. Choice: Aggressive Ads (+Traffic, -Cart Rate) vs. Targeted (+Trust, +Cart Rate).
- **Data:**
  - Update `data/content/emails.json` with detailed bodies and PM-centric choices.
  - Update `data/scenarios/phase_1.json` with aggressive, stage-specific physics impacts.

## DoD
- Emails are readable in the Inbox app.
- Options correctly target specific funnel rates (e.g., Apple Pay targets `payment_rate`).
