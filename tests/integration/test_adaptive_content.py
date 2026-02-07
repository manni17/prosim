def test_blitzscale_content_visibility(client, session_id):
    """Verifies that Blitzscale-specific emails appear only when focus is 'blitzscale'."""
    headers = {"X-Session-ID": session_id}
    
    # 1. Advance to Level 2 with Blitzscale
    # First need to be in REVIEW state
    # We cheat by playing turns or just forcing state
    # But let's use the API properly if possible.
    # To save time, we'll assume the /commit-strategy endpoint works as tested by SYS-10.
    
    client.post("/turn", json={"action_id": "final_tally"}, headers=headers) # Cheat to reach turn limits?
    # Actually, let's just test the /commit-strategy directly.
    # We must force status to REVIEW first.
    # I'll add a debug endpoint or just mock it.
    
    # Let's try the sequence:
    # 1. Start game (Turn 0)
    # 2. Commit Strategy (This advances level and sets focus)
    # Note: advance_level resets history, so turns start at 0 again.
    
    # We need to reach turn 12 to hit REVIEW.
    for _ in range(12):
        client.post("/turn", json={"action_id": "status_quo"}, headers=headers)
    
    # Commit Blitzscale
    client.post("/commit-strategy", json={"focus_id": "blitzscale"}, headers=headers)
    
    # Play 1 turn in Q2
    client.post("/turn", json={"action_id": "status_quo"}, headers=headers)
    
    # Check inbox
    response = client.get("/inbox", headers=headers)
    emails = response.json()
    
    # Should see "VIRAL SPIKE" (Blitzscale turn 1)
    assert any("VIRAL SPIKE" in e["subject"] for e in emails)
    # Should NOT see "Refactor Request" (Fortify turn 1)
    assert not any("Refactor Request" in e["subject"] for e in emails)

def test_fortify_content_visibility(client, session_id):
    """Verifies that Fortify-specific emails appear only when focus is 'fortify'."""
    headers = {"X-Session-ID": session_id}
    
    for _ in range(12):
        client.post("/turn", json={"action_id": "status_quo"}, headers=headers)
    
    client.post("/commit-strategy", json={"focus_id": "fortify"}, headers=headers)
    client.post("/turn", json={"action_id": "status_quo"}, headers=headers)
    
    response = client.get("/inbox", headers=headers)
    emails = response.json()
    
    assert any("Refactor Request" in e["subject"] for e in emails)
    assert not any("VIRAL SPIKE" in e["subject"] for e in emails)
