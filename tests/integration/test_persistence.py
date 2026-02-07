import os
from pathlib import Path
from server.api import sessions

def test_session_disk_persistence(client):
    """Verifies that sessions are saved to disk and reloaded on cache miss."""
    # 1. Create session
    resp = client.post("/new-game")
    assert resp.status_code == 200
    session_id = resp.json()["session_id"]
    
    # 2. Verify file exists
    session_file = Path(f"data/sessions/{session_id}.json")
    assert session_file.exists()
    
    # 3. Modify state via turn
    headers = {"X-Session-ID": session_id}
    client.post("/turn", json={"action_id": "guest_checkout"}, headers=headers)
    
    # 4. Clear in-memory cache to simulate server restart
    if session_id in sessions:
        del sessions[session_id]
    
    # 5. Retrieve state (should trigger disk reload)
    resp_state = client.get("/state", headers=headers)
    assert resp_state.status_code == 200
    
    # Verify it's not the default 1.0 health (assuming guest_checkout affects something)
    # Actually guest_checkout affects checkout_rate and trust.
    # Let's check trust. Default is 0.5.
    assert resp_state.json()["trust"] < 0.5
    
    # 6. Verify session is back in memory
    assert session_id in sessions
