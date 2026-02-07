import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from server.api import app

client = TestClient(app)

def run_tests():
    print("Running Session Isolation Tests...")

    # 1. Create Game A
    print("1. Creating Session A...", end=" ")
    resp_a = client.post("/new-game")
    assert resp_a.status_code == 200
    id_a = resp_a.json()["session_id"]
    print(f"PASS (ID: {id_a})")

    # 2. Create Game B
    print("2. Creating Session B...", end=" ")
    resp_b = client.post("/new-game")
    assert resp_b.status_code == 200
    id_b = resp_b.json()["session_id"]
    print(f"PASS (ID: {id_b})")

    assert id_a != id_b, "Session IDs must be unique"

    # 3. Game A executes turn (Health should drop)
    print("3. Executing Turn in Session A...", end=" ")
    headers_a = {"X-Session-ID": id_a}
    resp_turn = client.post("/turn", json={"action_id": "patch"}, headers=headers_a)
    assert resp_turn.status_code == 200
    health_a = resp_turn.json()["health"]
    print(f"PASS (Health A: {health_a:.2f})")

    # 4. Check Game B state (Health should match initial default)
    print("4. Checking Session B State (Should be unchanged)...", end=" ")
    headers_b = {"X-Session-ID": id_b}
    resp_state = client.get("/state", headers=headers_b)
    assert resp_state.status_code == 200
    health_b = resp_state.json()["health"]
    print(f"PASS (Health B: {health_b:.2f})")

    # 5. Assert Isolation
    print("5. Verifying Isolation...", end=" ")
    # Assuming "patch" drops health. Defaults is 1.0. A should be < 1.0. B should be 1.0.
    if health_a != health_b:
        print(f"PASS (A: {health_a} != B: {health_b})")
    else:
        print(f"FAIL (States match! A: {health_a}, B: {health_b})")
        sys.exit(1)

    print("\nSession Management Verification Complete.")

if __name__ == "__main__":
    run_tests()
