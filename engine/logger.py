from datetime import datetime
from typing import Dict, Any
from engine.state import GameState, LogEntry

class TelemetryLogger:
    def __init__(self, state: GameState):
        self.state = state

    def log_turn(self, action_id: str, metrics: Dict[str, float]) -> None:
        """
        Creates a structured LogEntry and appends it to the state history.
        """
        entry = LogEntry(
            timestamp=datetime.now().isoformat(),
            turn_index=len(self.state.history) + 1,
            phase=self.state.phase,
            action_id=action_id,
            metrics=metrics,
            # Snapshots (WEB-07)
            health=self.state.health,
            morale=self.state.morale,
            trust=self.state.trust,
            revenue=self.state.revenue,
            seed=self.state.seed
        )
        self.state.history.append(entry)
