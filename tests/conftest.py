import pytest
import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from server.api import app

@pytest.fixture(scope="module")
def client():
    """Returns a TestClient instance for the API."""
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def session_id(client):
    """Creates a new game session and returns the session ID."""
    response = client.post("/new-game")
    assert response.status_code == 200
    data = response.json()
    return data["session_id"]
