import sys
from pathlib import Path

# Add project root to path so we can import engine
sys.path.append(str(Path(__file__).parent.parent))

from engine.state import GameState, save_game, load_game, LogEntry
from pydantic import ValidationError

def test_valid_state():
    print("Testing valid state...", end=" ")
    state = GameState(health=1.0, phase=1, morale=0.8, trust=0.5, seed=42)
    assert state.health == 1.0
    assert state.phase == 1
    print("PASS")

def test_health_clamping():
    print("Testing health clamping (> 1.0)...", end=" ")
    state = GameState(health=1.1, phase=1, morale=0.8, trust=0.5, seed=42)
    assert state.health == 1.0
    print("PASS (Clamped to 1.0)")

def test_invalid_phase():
    print("Testing invalid phase (> 3)...", end=" ")
    try:
        GameState(health=1.0, phase=4, morale=0.8, trust=0.5, seed=42)
        print("FAIL (Should have raised ValidationError)")
        sys.exit(1)
    except ValidationError:
        print("PASS")
    except Exception as e:
        print(f"FAIL (Wrong exception: {e})")
        sys.exit(1)

def test_persistence():
    print("Testing persistence...", end=" ")
    test_file = Path("data/test_state.json")
    
    # Clean up before
    if test_file.exists():
        test_file.unlink()

    # Create a valid LogEntry for history
    log_entry = LogEntry(
        timestamp="2023-01-01T00:00:00",
        turn_index=1,
        phase=1,
        action_id="test_action",
        metrics={},
        seed=42
    )

    state = GameState(
        health=0.5, 
        phase=2, 
        points={"score": 10}, 
        history=[log_entry], 
        morale=0.5, 
        trust=0.5, 
        seed=42
    )
    save_game(state, test_file)
    
    if not test_file.exists():
        print("FAIL (File not created)")
        sys.exit(1)
        
    loaded_state = load_game(test_file)
    assert loaded_state.health == 0.5
    assert loaded_state.phase == 2
    assert loaded_state.points["score"] == 10
    assert len(loaded_state.history) == 1
    assert loaded_state.history[0].action_id == "test_action"
    
    # Clean up after
    test_file.unlink()
    print("PASS")
