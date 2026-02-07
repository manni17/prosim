# SYS-01: State Schema & JSON Persistence

## Requirements

- Define GameState model: health(float), phase(int), points(dict), history(list).
- Implement save/load logic to 'data/state.json'.
- DoD: Script must reject health > 1.0 or phase > 3.