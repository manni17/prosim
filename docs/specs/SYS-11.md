# SYS-11: Retention & Churn Logic

## Requirements
- **Goal:** Implement dynamic user churn physics to model the "Leaky Bucket" effect in SaaS/Subscription businesses.
- **Formula:** 
  - `churn_rate = base_churn + (1 - trust) * 0.1 + (1 - health) * 0.05`
  - `lost_users = active_users * churn_rate`
  - `new_users = traffic * conversion_rate`
  - `active_users_next = active_users - lost_users + new_users`
- **Revenue Model Update:**
  - `Recurring Revenue = active_users * average_order_value` (Simplified: Treating AOV as ARPU for this model, or we might need a separate ARPU. The prompt implies mixing Transactional and Recurring. Let's stick to the prompt's instruction: Revenue = (Active Users * Subscription Fee) + (New Traffic * Conversion * AOV). *Wait, if AOV is transactional, what is Subscription Fee? I will assume a default constant or derive it. For now, let's assume AOV applies to new users (Transactional) and maybe a fraction or a specific 'subscription_fee' applies to active users. The prompt says "Revenue = (Active Users * Subscription Fee) + (New Traffic * Conversion * AOV)". I will add `subscription_fee` to state or use a constant.*)

## Data Schema Changes
- `GameState`:
  - `active_users` (int): Current install base. Default: 1000.
  - `churn_rate` (float): Percentage of users lost per turn. Default: 0.05.

## Logic Changes
- **Controller:**
  - `_calculate_churn(state)`: Called before revenue calculation.
  - `_recalculate_revenue(state)`: Updated to include recurring revenue component.

## Impact
- **Gameplay:** Low Trust now causes long-term damage (Churn) rather than just immediate score penalties.
- **Visualization:** MaxPanel must show "Active Users" to give players a metric to protect.
