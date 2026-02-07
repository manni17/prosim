import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from server.api import app

client = TestClient(app)

def run_tests():
    print("Verifying Narrative API Endpoints...")

    # 1. Start New Game
    print("1. Starting New Game...", end=" ")
    resp = client.post("/new-game")
    assert resp.status_code == 200
    session_id = resp.json()["session_id"]
    print(f"PASS (Session: {session_id})")

    headers = {"X-Session-ID": session_id}

    # 2. GET /inbox
    print("2. GET /inbox...", end=" ")
    resp_inbox = client.get("/inbox", headers=headers)
    assert resp_inbox.status_code == 200
    emails = resp_inbox.json()
    assert isinstance(emails, list)
    assert len(emails) >= 1
    
    # Verify Content
    first_email = emails[0]
    assert "Cart Abandonment" in first_email["subject"]
    print(f"PASS (Found: '{first_email['subject']}')")

    # 3. GET /chats
    print("3. GET /chats...", end=" ")
    resp_chats = client.get("/chats", headers=headers)
    assert resp_chats.status_code == 200
    chats = resp_chats.json()
    assert len(chats) >= 1
    print(f"PASS (Found {len(chats)} messages)")

    print("\nNarrative API Verification Complete.")

if __name__ == "__main__":
    run_tests()
