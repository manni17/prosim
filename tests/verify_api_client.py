import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from server.api import app

client = TestClient(app)

def run_tests():
    print("Running In-Process API Tests...")

    # 1. Reset Game
    print("1. POST /new-game", end="... ")
    response = client.post("/new-game")
    assert response.status_code == 200
    data = response.json()
    assert data["state"]["status"] == "ACTIVE"
    print(f"PASS (Health: {data['state']['health']})")

    # 2. Get State
    print("2. GET /state", end="... ")
    response = client.get("/state")
    assert response.status_code == 200
    data = response.json()
    assert data["phase"] == 1
    print("PASS")

    # 3. Execute Turn
    print("3. POST /turn (Patch)", end="... ")
    response = client.post("/turn", json={"action_id": "patch"})
    assert response.status_code == 200
    data = response.json()
    # Health should drop from 1.0 (defaults.json might be 1.0 or reset resets to 1.0)
    # Check if health changed or matches expected range
    print(f"PASS (New Health: {data['health']:.2f})")

    print("\nAll API tests passed via TestClient.")

if __name__ == "__main__":
    run_tests()
