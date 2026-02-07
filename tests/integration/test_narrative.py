def test_get_inbox(client, session_id):
    """
    Verifies that the /inbox endpoint returns a list of emails
    and that the content matches the expected schema.
    """
    headers = {"X-Session-ID": session_id}
    response = client.get("/inbox", headers=headers)
    
    assert response.status_code == 200
    emails = response.json()
    
    assert isinstance(emails, list)
    assert len(emails) > 0
    
    # Check structure of the first email
    first_email = emails[0]
    assert "id" in first_email
    assert "subject" in first_email
    assert "sender" in first_email
    assert "body" in first_email
    assert "options" in first_email
    
    # Specific content check (from DATA-05 - Funnel Optimization)
    pm_email = next((e for e in emails if "Checkout Drop-off" in e["subject"]), None)
    assert pm_email is not None

def test_get_chats(client, session_id):
    """
    Verifies that the /chats endpoint returns a list of chat messages.
    """
    headers = {"X-Session-ID": session_id}
    response = client.get("/chats", headers=headers)
    
    assert response.status_code == 200
    chats = response.json()
    
    # Currently chats.json is static test data, verifying it loads
    assert isinstance(chats, list)
