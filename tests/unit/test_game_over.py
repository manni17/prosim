import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

from engine.state import GameState
from engine.controller import SimulationController
from engine.hydrator import Scenario, ScenarioAction, ActionCost, ActionReward

def test_loss_condition_health():
    """Verifies that health <= 0 triggers GAME_OVER."""
    state = GameState(
        health=0.1, morale=0.8, trust=0.5, phase=1, status='ACTIVE',
        traffic=1000, conversion_rate=0.01, average_order_value=50, revenue=10, seed=42
    )
    controller = SimulationController(state)
    
    # Mock an action that kills health
    controller.scenario.actions.append(ScenarioAction(
        id="burnout", label="Crunch", cost=ActionCost(health=[0.2, 0.2]), 
        reward=ActionReward(), description="Kills health"
    ))
    
    controller.execute_turn({"type": "burnout"})
    assert state.status == "GAME_OVER"
    assert any(msg.sender == "SYSTEM" for msg in controller.inbox)

def test_win_condition_revenue():
    """Verifies that revenue >= 100k triggers VICTORY."""
    state = GameState(
        health=1.0, morale=0.8, trust=0.5, phase=1, status='ACTIVE',
        traffic=90000, conversion_rate=0.02, average_order_value=50, revenue=90000, seed=42
    )
    controller = SimulationController(state)
    
    # Mock an action that boosts traffic to exceed 100k revenue
    # Traffic 90k -> 110k. 110k * 0.02 * 50 = 110,000
    controller.scenario.actions.append(ScenarioAction(
        id="ads", label="Ads", cost=ActionCost(), 
        reward=ActionReward(traffic=[20000, 20000]), description="Boosts revenue"
    ))
    
    controller.execute_turn({"type": "ads"})
    assert state.status == "VICTORY"
    assert state.revenue >= 100000
    assert any("VICTORY" in msg.subject for msg in controller.inbox)
