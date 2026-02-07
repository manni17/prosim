# DATA-06: The 12-Turn Campaign Arc

## Requirements
- **Goal:** Create a cohesive 12-turn narrative and gameplay loop that tests strategic alignment.
- **Campaign Structure:**
  - **Turns 1-2: Onboarding.** Basic fixes (Login Wall, Express Pay) to introduce the funnel.
  - **Turn 3: THE FORK.** The Board Meeting (Floodgate vs. Velvet vs. Frictionless).
  - **Turns 4-8: Alignment Tests.** Scenarios that reward the player if they stick to their chosen strategy and punish them if they deviate.
  - **Turns 9-12: The Scale Phase.** High-stakes choices (International Expansion, AI Personalization) to push toward the $100k goal.
- **Strategic Consistency:** Choices must have different weights based on the active archetype (simulated via narrative and physics impacts).

## DoD
- `emails.json` contains at least 10-12 sequential scenarios.
- Physics impacts in `phase_1.json` support the alignment rewards/punishments.
- Total game length averages 12 decisions.