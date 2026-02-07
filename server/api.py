from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pathlib import Path
from typing import Dict, Annotated, List, Any, Optional
import uuid
import sys
import os

# Ensure engine is in path
sys.path.append(str(Path(__file__).parent.parent))

from engine.state import GameState, load_game, DEFAULTS_FILE, save_game
from engine.controller import SimulationController
from engine.hydrator import load_scenario
import json

app = FastAPI(title="proSIM API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SESSION_DIR = Path("data/sessions")
SESSION_DIR.mkdir(parents=True, exist_ok=True)

# Mount Static Assets for SPA
# Must be before the catch-all route, but arguably can be anywhere if path matches.
# However, putting it here is safe.
if os.path.exists("client/dist/assets"):
    app.mount("/assets", StaticFiles(directory="client/dist/assets"), name="assets")

# In-memory session store (Cache)
sessions: Dict[str, SimulationController] = {}

class TurnRequest(BaseModel):
    action_id: str

class NewGameRequest(BaseModel):
    name: Optional[str] = "Candidate"

class NewGameResponse(BaseModel):
    message: str
    session_id: str
    state: GameState

def save_session_to_disk(session_id: str, state: GameState):
    """Saves the session state to a JSON file."""
    file_path = SESSION_DIR / f"{session_id}.json"
    save_game(state, file_path)

def load_session_from_disk(session_id: str) -> SimulationController | None:
    """Attempts to load a session from disk."""
    file_path = SESSION_DIR / f"{session_id}.json"
    if not file_path.exists():
        return None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    state = GameState(**data)
    return SimulationController(state)

def get_controller(x_session_id: Annotated[str | None, Header()] = None) -> SimulationController:
    """Dependency to retrieve the controller for the current session, checking disk if cache miss."""
    if x_session_id is None:
        raise HTTPException(status_code=400, detail="Missing X-Session-ID header")
    
    if x_session_id in sessions:
        return sessions[x_session_id]
    
    # Cache miss - check disk
    controller = load_session_from_disk(x_session_id)
    if controller:
        sessions[x_session_id] = controller
        return controller
        
    raise HTTPException(status_code=404, detail="Session not found")

@app.post("/new-game", response_model=NewGameResponse)
def new_game(request: Optional[NewGameRequest] = None):
    """Starts a new game session, saves to disk, and returns the session ID."""
    session_id = str(uuid.uuid4())
    
    if not DEFAULTS_FILE.exists():
         raise HTTPException(status_code=500, detail="Defaults file missing")

    with open(DEFAULTS_FILE, 'r', encoding='utf-8') as f:
        default_data = json.load(f)
    
    if request and request.name:
        default_data["player_name"] = request.name

    state = GameState(**default_data)
    controller = SimulationController(state)
    
    sessions[session_id] = controller
    save_session_to_disk(session_id, state)
    
    return {"message": "New session created", "session_id": session_id, "state": state}

@app.post("/resign")
def resign(x_session_id: Annotated[str | None, Header()] = None, controller: SimulationController = Depends(get_controller)):
    """Manually terminates the simulation."""
    controller.state.status = "GAME_OVER"
    # Create System Message
    from engine.content import NarrativeContent
    system_msg = NarrativeContent(
        id="sys_resign",
        type="system",
        sender="SYSTEM",
        subject="TERMINATION: Voluntary Resignation",
        body="You have submitted your resignation. The board has accepted. Access to Steller OS is being revoked.",
        options=[]
    )
    controller.inbox.insert(0, system_msg)
    save_session_to_disk(x_session_id, controller.state)
    return {"message": "Resignation accepted", "state": controller.state}

@app.post("/tutorial-complete")
def tutorial_complete(x_session_id: Annotated[str | None, Header()] = None, controller: SimulationController = Depends(get_controller)):
    """Marks the tutorial as complete."""
    controller.complete_tutorial()
    save_session_to_disk(x_session_id, controller.state)
    return {"message": "Tutorial marked complete", "state": controller.state}

@app.get("/state", response_model=GameState)
def get_state(controller: SimulationController = Depends(get_controller)):
    """Returns the current game state for the session."""
    return controller.state

from engine.content import NarrativeContent

@app.get("/inbox", response_model=List[NarrativeContent])
def get_inbox(controller: SimulationController = Depends(get_controller)):
    """Returns the list of active emails for the session."""
    return controller.inbox

@app.get("/chats", response_model=List[NarrativeContent])
def get_chats(controller: SimulationController = Depends(get_controller)):
    """Returns the list of active chat messages for the session."""
    return controller.chats

@app.get("/events", response_model=List[Dict[str, Any]])
def get_events(controller: SimulationController = Depends(get_controller)):
    """Returns the raw event stream for the session."""
    return controller.state.events

@app.get("/analytics")
def get_analytics(controller: SimulationController = Depends(get_controller)):
    """Returns strategy-specific analytics datasets and time-series data."""
    strategy_data = controller.content_manager.load_analytics(controller.state.strategy_archetype)
    
    if len(controller.state.history) > 0:
        time_series = controller.content_manager.load_time_series("leak")
        strategy_data["time_series"] = time_series["series"]
    
    return strategy_data

from engine.content import Intervention

@app.get("/interventions", response_model=List[Intervention])
def get_interventions(controller: SimulationController = Depends(get_controller)):
    """Returns the list of tactical interventions."""
    return controller.content_manager.interventions

class InterventionRequest(BaseModel):
    action_id: str

@app.post("/intervention")
def execute_intervention(request: InterventionRequest, controller: SimulationController = Depends(get_controller)):
    """Executes a tactical intervention."""
    try:
        result = controller.execute_intervention(request.action_id)
        return {"result": result, "state": controller.state}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/next-level")
def next_level(x_session_id: Annotated[str | None, Header()] = None, controller: SimulationController = Depends(get_controller)):
    """Advances the simulation to the next level."""
    try:
        controller.advance_level()
        save_session_to_disk(x_session_id, controller.state)
        return {"message": f"Advanced to level {controller.state.current_level}", "state": controller.state}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

class StrategyRequest(BaseModel):
    focus_id: str

@app.post("/commit-strategy")
def commit_strategy(request: StrategyRequest, x_session_id: Annotated[str | None, Header()] = None, controller: SimulationController = Depends(get_controller)):
    """Commits to a quarterly strategy and advances the level."""
    try:
        controller.commit_strategy(request.focus_id)
        save_session_to_disk(x_session_id, controller.state)
        return {"message": "Strategy committed", "state": controller.state}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/turn", response_model=GameState)
def execute_turn(request: TurnRequest, x_session_id: Annotated[str | None, Header()] = None, controller: SimulationController = Depends(get_controller)):
    """Executes a turn for the session and persists to disk."""
    state = controller.state
    
    if state.status != 'ACTIVE':
        raise HTTPException(status_code=400, detail=f"Game Over: {state.status}")
    
    try:
        scenario = load_scenario(state.phase)
        valid_actions = [a.id for a in scenario.actions]
        
        if request.action_id not in valid_actions:
            raise HTTPException(status_code=400, detail=f"Invalid action: {request.action_id}. Valid: {valid_actions}")
            
        controller.execute_turn({"type": request.action_id})
        save_session_to_disk(x_session_id, controller.state)
        return state
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Catch-all Route for SPA (Must be last)
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    """Serves the Single Page Application (React) for any non-API route."""
    # Check if a specific file is requested and exists in dist (e.g., favicon.ico, manifest.json)
    file_path = Path(f"client/dist/{full_path}")
    if file_path.exists() and file_path.is_file():
        return FileResponse(file_path)
    
    # Otherwise, return index.html to let React Router handle the path
    return FileResponse("client/dist/index.html")
