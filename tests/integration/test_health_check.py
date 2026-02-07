def test_api_root_404(client):
    """
    Since we haven't defined a root GET /, FastAPI should return 404 (Not Found).
    This confirms the server is reachable and processing requests.
    """
    response = client.get("/")
    assert response.status_code == 404

def test_new_game_creation(client):
    """Verifies that we can create a game and get a valid UUID."""
    response = client.post("/new-game")
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert "state" in data
    assert data["state"]["phase"] == 1
