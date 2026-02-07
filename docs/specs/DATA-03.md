# DATA-03: Level 1 - The Launch Crunch

## Scenario Overview
- **Title:** The Launch Crunch
- **Premise:** It is launch day for Steller's new B2B Gift Card API. The CEO has set a hard target of $100,000 revenue. The team is already exhausted from the final sprint.
- **Goal:** Survive the day while hitting the revenue target without burning out or losing the team's trust.

## Narrative Arc (The 4 Key Events)
1.  **09:00 - The Traffic Spike:** Traffic is 3x higher than expected.
    - **Choice A (Scale Up):** Buy more server capacity. (Cost: Revenue--, Trust: ++, Stability: ++)
    - **Choice B (Throttle):** Limit incoming users. (Cost: Traffic--, Trust: --, Morale: ++)
2.  **12:00 - The Gateway Crash:** The payment provider is failing under load.
    - **Choice A (Hotfix):** Patch it live. (Cost: Health--, Revenue: ++, Stability: --)
    - **Choice B (Failover):** Switch to backup (slower). (Cost: ConvRate--, Morale: --, Trust: ++)
3.  **15:00 - The Mutiny:** The Lead Dev is threatening to walk out.
    - **Choice A (Pizza & Pep-talk):** Mandatory fun. (Cost: Health--, Morale: ++, Revenue--)
    - **Choice B (Early Release):** Send them home early. (Cost: Stability--, Morale: +++, Trust: --)
4.  **17:00 - The Verdict:** The day ends. Did you hit the $100k revenue?

## Implementation Details
- **Impacts:** Aggressive swings in metrics (0.15 - 0.30 range).
- **Physics:** Ensure revenue recalculation reflects the high-stakes traffic changes.
