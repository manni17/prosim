import sys
from pathlib import Path
from pydantic import BaseModel

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from engine.state import GameState
from engine.controller import SimulationController
from engine.hydrator import Scenario, ScenarioAction, ActionCost, ActionReward

# Mock Scenario Loader
def mock_load_scenario(phase: int):
    return Scenario(
        phase_id=1,
        title="Test Commerce",
        description="Testing Physics",
        actions=[
            ScenarioAction(
                id="boost_traffic",
                label="Buy Ads",
                cost=ActionCost(),
                reward=ActionReward(traffic=[5000, 5000]),
                description="Boosts traffic by 5000"
            )
        ]
    )

def run_tests():
    print("Verifying Ecommerce Physics...")

    # 1. Initialize State (Defaults: T=10k, CR=0.02, AOV=50 -> Rev=10k)
    state = GameState(
        health=1.0, morale=0.8, trust=0.5, phase=1,
        traffic=10000, conversion_rate=0.02, average_order_value=50.0,
        revenue=10000.0, seed=42
    )
    
    print(f"1. Initial Revenue: ${state.revenue:,.2f}...", end=" ")
    assert state.revenue == 10000.0
    print("PASS")

    # 2. Setup Controller with Mock
    controller = SimulationController(state)
    # Monkey patch the scenario loader for this instance/test context
    # Since controller loads scenario in __init__, we need to patch BEFORE init or manually replace it
    controller.scenario = mock_load_scenario(1)

    # 3. Execute Turn (Traffic +5000)
    print("2. Executing 'boost_traffic' (+5000 Traffic)...", end=" ")
    controller.execute_turn({"type": "boost_traffic"})
    
    # Expected: Traffic = 15000. Rev = 15000 * 0.02 * 50 = 15000
    print(f"PASS (New Revenue: ${state.revenue:,.2f})")
    
    assert state.traffic == 15000
    assert state.revenue == 15000.0

    print("\nEcommerce Physics Verified.")

if __name__ == "__main__":
    run_tests()
