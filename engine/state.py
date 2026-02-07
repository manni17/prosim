import json
from pathlib import Path
from typing import Dict, List, Any, Literal, Optional
from pydantic import BaseModel, Field, field_validator, ValidationError

# Define the path to the state file
STATE_FILE = Path("data/state.json")
DEFAULTS_FILE = Path("data/defaults.json")

GameStatus = Literal['ACTIVE', 'WON', 'LOST_BURNOUT', 'LOST_FIRED', 'LOST_MUTINY', 'VICTORY', 'GAME_OVER', 'REVIEW']

class LogEntry(BaseModel):
    timestamp: str
    turn_index: int
    phase: int
    action_id: str
    metrics: Dict[str, float]
    # Snapshots for AAR (WEB-07)
    health: float = 0.0
    morale: float = 0.0
    trust: float = 0.0
    revenue: float = 0.0
    active_users: int = 0
    seed: int

class GameState(BaseModel):
    health: float = Field(..., description="Player health, max 1.0")
    morale: float = Field(..., description="Team morale, max 1.0")
    trust: float = Field(..., description="Stakeholder trust, max 1.0")
    traffic: int = Field(default=10000, description="Daily visitors")
    conversion_rate: float = Field(default=0.02, description="Conversion Rate (0.0 - 1.0)")
    average_order_value: float = Field(default=50.0, description="Average Order Value ($)")
    revenue: float = Field(default=10000.0, description="Calculated Revenue")
    # Retention Physics (SYS-11)
    active_users: int = Field(default=1000, description="Current install base")
    churn_rate: float = Field(default=0.05, description="Monthly churn rate (0.0 - 1.0)")
    # Funnel Physics (SYS-06)
    cart_rate: float = Field(default=0.25, description="Visitors -> Cart")
    checkout_rate: float = Field(default=0.40, description="Cart -> Checkout")
    payment_rate: float = Field(default=0.80, description="Checkout -> Purchase")
    phase: int = Field(..., description="Game phase, max 3")
    current_level: int = Field(default=1, description="Active campaign level")
    player_name: str = Field(default="Candidate", description="Player name")
    job_title: str = Field(default="Associate PM", description="Job title")
    tutorial_complete: bool = Field(default=False, description="Whether onboarding is done")
    quarterly_focus: Optional[str] = Field(default=None, description="Current strategy focus")
    physics_modifiers: Dict[str, float] = Field(default_factory=lambda: {"traffic": 1.0, "cost": 1.0, "aov": 1.0, "conv": 1.0}, description="Physics multipliers")
    status: GameStatus = Field(default='ACTIVE', description="Current game status")
    termination_details: Dict[str, str] = Field(default_factory=dict, description="Reason and notes for game over")
    strategy_archetype: str = Field(default="default", description="Active strategic path")
    points: Dict[str, int] = Field(default_factory=dict, description="Score points")
    history: List[LogEntry] = Field(default_factory=list, description="Action history")
    events: List[Dict[str, Any]] = Field(default_factory=list, description="Raw event stream")
    delivered_event_ids: List[str] = Field(default_factory=list, description="IDs of narrative events delivered")
    active_risks: List[str] = Field(default_factory=list, description="Active hidden risks (e.g., memory_leak)")
    seed: int = Field(..., description="RNG Seed for determinism")

    @field_validator('health', 'morale', 'trust')
    @classmethod
    def check_float_range(cls, v: float) -> float:
        if v > 1.0: return 1.0
        if v < 0.0: return 0.0
        return v
        
    @field_validator('health')
    @classmethod
    def check_health(cls, v: float) -> float:
        if v > 1.0: raise ValueError('health must be <= 1.0')
        return v
    
    @field_validator('morale')
    @classmethod
    def check_morale(cls, v: float) -> float:
        if v > 1.0: raise ValueError('morale must be <= 1.0')
        return v

    @field_validator('trust')
    @classmethod
    def check_trust(cls, v: float) -> float:
        if v > 1.0: raise ValueError('trust must be <= 1.0')
        return v

    @field_validator('phase')
    @classmethod
    def check_phase(cls, v: int) -> int:
        if v > 3:
            raise ValueError('phase must be <= 3')
        return v

# Fix for Pydantic v2 deferred evaluation
GameState.model_rebuild()

def save_game(state: GameState, file_path: Path = STATE_FILE) -> None:
    """Saves the GameState to a JSON file."""
    # Ensure parent directory exists
    file_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(state.model_dump_json(indent=2))

def load_game(file_path: Path = STATE_FILE) -> GameState:
    """Loads the GameState from a JSON file. Returns a default state from defaults.json if file missing."""
    if not file_path.exists():
        if not DEFAULTS_FILE.exists():
            raise FileNotFoundError(f"Missing defaults file: {DEFAULTS_FILE}")
            
        with open(DEFAULTS_FILE, 'r', encoding='utf-8') as f:
            default_data = json.load(f)
        return GameState(**default_data)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    return GameState(**data)