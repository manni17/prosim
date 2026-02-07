# SYS-02: Deterministic Controller & Atomic Turns
- **Core:** Functional math logic using `self.rng = random.Random(state.seed)`.
- **Atomic Pattern:** Every turn must `deepcopy` state, execute, and `save()` only on success.
- **Rollback:** Any validation error must trigger a restore of the state snapshot.