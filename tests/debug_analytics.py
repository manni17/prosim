import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from server.api import app

client = TestClient(app)

def debug_analytics():
    print("--- Analytics Diagnostic ---")
    
    # 1. Create a session
    print("1. Creating session...", end=" ")
    resp = client.post("/new-game")
    if resp.status_code != 200:
        print(f"FAIL: {resp.text}")
        return
    session_id = resp.json()["session_id"]
    print(f"OK ({session_id})")

    # 2. Call /analytics
    print("2. Fetching /analytics...", end=" ")
    headers = {"X-Session-ID": session_id}
    resp = client.get("/analytics", headers=headers)
    
    if resp.status_code == 200:
        data = resp.json()
        print("OK")
        print(f"   Data Keys: {list(data.keys())}")
        print(f"   Funnel: {data.get('funnel')}")
    else:
        print(f"FAIL: Status {resp.status_code}")
        print(f"   Detail: {resp.text}")

if __name__ == "__main__":
    debug_analytics()
